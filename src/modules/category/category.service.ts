import { Injectable, BadRequestException } from '@nestjs/common';
import { CategoryEntity } from './category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pagination } from 'src/interface/pagination.interface';
import { Category } from 'src/interface/category.interface';
import { CategoryDto } from './dto';
import { HTTP_ERROR_TEXT, PARAM_NAME_EXIST } from 'src/constants/text.constant';
import { dateFmt } from 'src/public/utils/time';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(CategoryEntity) private readonly categoryRepository: Repository<CategoryEntity>
    ) {}

    async pageQuery ({ pageSize, current }: Pagination): Promise<{ total: number, list: Category[] }> {
        const qb = this.categoryRepository.createQueryBuilder('category');
        qb.where(`category.is_delete=0`)
            .skip(pageSize * (current - 1))
            .take(pageSize)
            .leftJoinAndSelect('category.articles', 'article')
            .orderBy('category.sort', 'DESC')

        const [ list, total] = await qb.getManyAndCount();
        const newList = list.map(m => {
            const {create_time, update_time, articles, ...others} = m;
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

    async getAll(): Promise<Category[]> {
        const qb = this.categoryRepository.createQueryBuilder('category');
        qb.where(`category.is_delete=0`)
            .leftJoinAndSelect('category.articles', 'article')
            .orderBy('category.sort', 'DESC')
            .addOrderBy('category.create_time', 'DESC')
            .printSql()
        const list = await qb.getMany();
        const newList = list.map(m => {
            const {create_time, update_time, articles, ...others} = m;
            return {
                ...others,
                article_count: articles.length,
                create_time: create_time ? dateFmt(create_time) : null,
                update_time: update_time ? dateFmt(update_time) : null
            }
        });

        return newList;
    }

    async addOne(dto: CategoryDto): Promise<CategoryEntity> {
        const { name, sort } = dto;
        const res = await this.categoryRepository.findOne({
            name: name
        });
        if (res) {
            throw new BadRequestException({
                statusCode: 400,
                data: {},
                message: PARAM_NAME_EXIST
            });
        }

        const category = new CategoryEntity();
        category.name = name;
        category.sort = sort;
        category.create_time = new Date();

        const savedCategory = await this.categoryRepository.save(category);
        console.log('savedCategory', savedCategory);

        return savedCategory;
    }


    async updateOne(params: Category): Promise<CategoryEntity> {
        const { id, name, sort } = params;
        const qb = this.categoryRepository.createQueryBuilder('category');
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
        res.update_time = new Date();
        const category = Object.assign({}, res);

        const savedCategory = await this.categoryRepository.save(category);
        return savedCategory;
    }


    async deleteOne(id: number): Promise<CategoryEntity> {
        const qb = this.categoryRepository.createQueryBuilder('category');
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
        const category = Object.assign({}, res);

        const savedCategory = await this.categoryRepository.save(category);
        return savedCategory;
    }
}
