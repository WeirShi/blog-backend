import { Injectable, BadRequestException } from '@nestjs/common';
import { CategoryEntity } from './category.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Pagination } from 'src/interface/pagination.interface';
import { Category } from 'src/interface/category.interface';
import { CategoryDto } from './dto';
import { HTTP_ERROR_TEXT } from 'src/constants/text.constant';

@Injectable()
export class CategoryService {
    constructor(
        @InjectRepository(CategoryEntity)
        private readonly categoryRepository: Repository<CategoryEntity>
    ) {}

    async pageQuery ({ pageSize, current }: Pagination): Promise<{ total: number, list: CategoryEntity[] }> {
        const qb = this.categoryRepository.createQueryBuilder('category');
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


    async addOne(dto: CategoryDto): Promise<CategoryEntity> {
        const { name, sort } = dto;

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
