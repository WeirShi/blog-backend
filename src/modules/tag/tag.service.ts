import { Injectable, BadRequestException } from '@nestjs/common';
import { TagEntity } from './tag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pagination } from 'src/interface/pagination.interface';
import { Tag } from 'src/interface/tag.interface';
import { TagDto } from './dto';
import { HTTP_ERROR_TEXT } from 'src/constants/text.constant';

@Injectable()
export class TagService {
    constructor(
        @InjectRepository(TagEntity)
        private readonly tagRepository: Repository<TagEntity>
    ) {}
    


    async pageQuery ({ pageSize, current }: Pagination): Promise<{ total: number, list: TagEntity[] }> {
        const qb = this.tagRepository.createQueryBuilder('tag');
        qb.where(`is_delete=0`)
            .skip(pageSize * (current - 1))
            .take(pageSize)
            .orderBy('sort', 'DESC')

        const [ list, total] = await qb.getManyAndCount();
        return {
            total,
            list
        }
    }


    async addOne(dto: TagDto): Promise<TagEntity> {
        const { name, sort, color } = dto;

        const tag = new TagEntity();
        tag.name = name;
        tag.sort = sort;
        tag.color = color;
        tag.create_time = new Date();

        const savedTag = await this.tagRepository.save(tag);
        return savedTag;
    }


    async updateOne(params: Tag): Promise<TagEntity> {
        const { id, name, sort, color } = params;
        const qb = this.tagRepository.createQueryBuilder('tag');
        qb.where(`id=${id}`)
            .andWhere('is_delete=0')
        const res = await qb.getOne();
        if (!res) {
            throw new BadRequestException({
                statusCode: 400,
                data: {},
                message: HTTP_ERROR_TEXT
            });
        }
        res.name = name;
        res.sort = sort;
        res.color = color;
        res.update_time = new Date();
        const tag = Object.assign({}, res);

        const savedTag = await this.tagRepository.save(tag);
        return savedTag;
    }


    async deleteOne(id: number): Promise<TagEntity> {
        const qb = this.tagRepository.createQueryBuilder('tag');
        qb.where(`id=${id}`)
            .andWhere('is_delete=0')
        const res = await qb.getOne();
        if (!res) {
            throw new BadRequestException({
                statusCode: 400,
                data: {},
                message: HTTP_ERROR_TEXT
            });
        }
        res.is_delete = 1;
        res.update_time = new Date();
        const tag = Object.assign({}, res);

        const savedTag = await this.tagRepository.save(tag);
        return savedTag;
    }
}
