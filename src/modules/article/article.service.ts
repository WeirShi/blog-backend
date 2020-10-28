import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HTTP_ERROR_TEXT, HTTP_QUERY_ERROR_TEXT, HTTP_DELETE_ERROR_TEXT, HTTP_UPDATE_ERROR_TEXT } from 'src/constants/text.constant';
import { ArticleEntity } from './article.entity';
import { ArticlePage, Article } from 'src/interface/article.interface';
import { ArticleDto } from './dto';


@Injectable()
export class ArticleService {
    constructor(
        @InjectRepository(ArticleEntity)
        private readonly articleRepository: Repository<ArticleEntity>
    ){}


    async pageQuery({ pageSize, current, type = 0 }: ArticlePage): Promise<{ total: number; list: ArticleEntity[] }> {
        
        const qb = this.articleRepository.createQueryBuilder('article');
        if (type === 0) {
            qb.where(`is_delete=0`)
                .andWhere(`is_drafts=0`)
        }
        if (type === 1) {
            qb.where(`is_delete=0`)
                .andWhere(`is_drafts=1`)
                .andWhere(`is_publish=0`)
        }
        if (type === 2) {
            qb.where(`is_delete=1`)
        }
        qb.skip(pageSize * (current - 1))
            .take(pageSize)
            .orderBy('create_time', 'DESC')

        const [ list, total ] = await qb.getManyAndCount();
        return {
            total,
            list
        }
    }


    async addOne(dto: ArticleDto): Promise<ArticleEntity> {
        const { title, content, cover, is_publish, is_delete, is_drafts } = dto;

        const article = new ArticleEntity();
        article.title = title;
        article.content = content;
        article.cover = cover;
        article.is_publish = is_publish;
        article.is_delete = is_delete;
        article.is_drafts = is_drafts;
        article.create_time = new Date();
        const savedArticle = await this.articleRepository.save(article);
        return savedArticle;
    }

    async updateOne(params: Article): Promise<ArticleEntity> {
        const { id, title, content, cover } = params;
        const qb = this.articleRepository.createQueryBuilder('article');
        qb.where(`id=${id}`)
            .andWhere('is_delete=0')
            .andWhere('is_publish=0')
        const res = await qb.getOne();
        if (!res) {
            throw new BadRequestException({
                statusCode: 400,
                data: {},
                message: HTTP_ERROR_TEXT
            });
        }
        res.title = title;
        res.content = content;
        res.cover = cover;
        res.update_time = new Date();
        const article = Object.assign({}, res);
        const savedArticle = await this.articleRepository.save(article);
        return savedArticle;
    }

    async getOne(id: number): Promise<ArticleEntity> {
        const res = await this.articleRepository.findOne({
            id: id,
            is_delete: 0
        });
        if (!res) {
            throw new BadRequestException({
                message: HTTP_QUERY_ERROR_TEXT,
                statusCode: 400,
                data: {}
            });
        }
        return res;
    }

    async deleteOne(id: number): Promise<ArticleEntity> {
        const res = await this.articleRepository.findOne({
            id: id,
            is_delete: 0,
            is_publish: 0
        });
        console.log(res);
        if (!res) {
            throw new BadRequestException({
                message: HTTP_DELETE_ERROR_TEXT,
                statusCode: 400,
                data: {}
            });
        }
        res.is_delete = 1;
        res.update_time = new Date();
        const article = Object.assign({}, res);
        const savedArticle = await this.articleRepository.save(article);
        return savedArticle;
    }

    // 发布或下架文章
    async updatePublish(id: number, isPublish: number): Promise<ArticleEntity> {
        const res = await this.articleRepository.findOne({
            id: id,
            is_delete: 0,
            is_drafts: 0
        });
        if (!res) {
            throw new BadRequestException({
                message: HTTP_UPDATE_ERROR_TEXT,
                statusCode: 400,
                data: {}
            });
        }
        res.is_publish = isPublish;
        res.update_time = new Date();
        res.publish_time = isPublish === 1 ? new Date() : null;
        const article = Object.assign({}, res);
        const savedArticle = await this.articleRepository.save(article);
        return savedArticle;
    }

    // 移动已删除的到草稿箱
    async updateDrafts(id: number): Promise<ArticleEntity> {
        const res = await this.articleRepository.findOne({
            id: id,
            is_delete: 1
        });
        if (!res) {
            throw new BadRequestException({
                message: HTTP_UPDATE_ERROR_TEXT,
                statusCode: 400,
                data: {}
            });
        }
        res.is_delete = 0;
        res.is_drafts = 1;
        res.is_publish = 0;
        res.update_time = new Date();
        const article = Object.assign({}, res);
        const savedArticle = await this.articleRepository.save(article);
        return savedArticle;
    }

    // 移动到列表
    async updateList(id: number): Promise<ArticleEntity> {
        const res = await this.articleRepository.findOne({
            id: id
        });
        if (!res) {
            throw new BadRequestException({
                message: HTTP_UPDATE_ERROR_TEXT,
                statusCode: 400,
                data: {}
            });
        }
        res.is_delete = 0;
        res.is_drafts = 0;
        res.is_publish = 0;
        res.update_time = new Date();
        const article = Object.assign({}, res);
        const savedArticle = await this.articleRepository.save(article);
        return savedArticle;
    }

}
