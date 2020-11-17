import { Injectable, BadRequestException } from '@nestjs/common';
import { TagEntity } from './tag.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pagination } from 'src/interface/pagination.interface';
import { Tag } from 'src/interface/tag.interface';
import { Article } from 'src/interface/article.interface';
import { TagDto } from './dto';
import { HTTP_ERROR_TEXT, PARAM_NAME_EXIST, HTTP_QUERY_ERROR_TEXT } from 'src/constants/text.constant';
import { dateFmt } from 'src/public/utils/time';

@Injectable()
export class TagService {
    constructor(
        @InjectRepository(TagEntity) private readonly tagRepository: Repository<TagEntity>
    ) {}
    

    // 分页查找
    async pageQuery ({ pageSize, current }: Pagination): Promise<{ total: number, list: Tag[] }> {
        const qb = this.tagRepository.createQueryBuilder('tag');
        qb.where(`tag.is_delete=0`)
            .skip(pageSize * (current - 1))
            .take(pageSize)
            .leftJoinAndSelect('tag.articles', 'article', 'article.is_delete=0 and article.is_publish=1')
            .orderBy('tag.sort', 'DESC')

        const [ list, total] = await qb.getManyAndCount();
        const newList = list.map(m => {
            const { create_time, update_time, articles, ...others } = m;
            return {
                ...others,
                article_count: articles.length,
                create_time: create_time ? dateFmt(create_time) : null,
                update_time: update_time ? dateFmt(update_time) : null
            }
        });
        return {
            total,
            list: newList
        }
    }

    // 查询全部
    async getAll(): Promise<Tag[]>{
        const qb = this.tagRepository.createQueryBuilder('tag');
        qb.where(`tag.is_delete=0`)
            .leftJoinAndSelect('tag.articles', 'article', 'article.is_delete=0 and article.is_publish=1')
            .orderBy('tag.sort', 'DESC')
            .addOrderBy('tag.create_time', 'DESC')
        const res = await qb.getMany();
        if (!res) {
            throw new BadRequestException({
                statusCode: 400,
                message: HTTP_QUERY_ERROR_TEXT,
                data: {}
            })
        }
        const newList = res.map(m => {
            const { create_time, update_time, articles, ...others } = m;
            return {
                ...others,
                article_count: articles.length,
                create_time: create_time ? dateFmt(create_time) : null,
                update_time: update_time ? dateFmt(update_time) : null
            }
        });

        return newList;
    }

    async getOneTagOfArticles(id: number): Promise<Article[]> {
        const qb = this.tagRepository.createQueryBuilder('tag');
        qb.where(`tag.is_delete=0`)
            .andWhere(`tag.id=${id}`)
            .leftJoinAndSelect('tag.articles', 'article', 'article.is_delete=0 and article.is_publish=1')
        const res = await qb.getOne();
        if (!res) {
            throw new BadRequestException({
                statusCode: 400,
                message: HTTP_QUERY_ERROR_TEXT,
                data: {}
            })
        }

        const { articles } = res;
        const newArticles = articles.map(article => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { create_time, update_time, publish_time, content, ...others } = article;
            return {
                ...others,
                create_time: create_time ? dateFmt(create_time) : null,
                update_time: update_time ? dateFmt(update_time) : null,
                publish_time: publish_time ? dateFmt(publish_time) : null,
            }
        });

        return newArticles;
    }


    async addOne(dto: TagDto): Promise<TagEntity> {
        const { name, sort, color } = dto;
        const res = await this.tagRepository.findOne({
            name: name
        });
        if (res) {
            throw new BadRequestException({
                statusCode: 400,
                data: {},
                message: PARAM_NAME_EXIST
            });
        }
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
