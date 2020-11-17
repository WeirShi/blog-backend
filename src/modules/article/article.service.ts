import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { HTTP_ERROR_TEXT, HTTP_QUERY_ERROR_TEXT, HTTP_DELETE_ERROR_TEXT, HTTP_UPDATE_ERROR_TEXT } from 'src/constants/text.constant';
import { ArticleEntity } from './article.entity';
import { ArticlePage, Article } from 'src/interface/article.interface';
import { Tag } from 'src/interface/tag.interface';
import { Category } from 'src/interface/category.interface';
import { ArticleDto } from './dto';
import { dateFmt } from 'src/public/utils/time';
import { TagEntity } from '../tag/tag.entity';
import { CategoryEntity } from '../category/category.entity';

@Injectable()
export class ArticleService {
    constructor(
        @InjectRepository(ArticleEntity) private readonly articleRepository: Repository<ArticleEntity>
    ){}


    async pageQuery({ pageSize, current, type = 0 }: ArticlePage): Promise<{ total: number; list: Article[] }> {
        
        const qb = this.articleRepository.createQueryBuilder('article');
        if (type === 0) {
            qb.where(`article.is_delete=0`)
                .andWhere(`is_drafts=0`)
        }
        if (type === 1) {
            qb.where(`article.is_delete=0`)
                .andWhere(`is_drafts=1`)
                .andWhere(`is_publish=0`)
        }
        if (type === 2) {
            qb.where(`article.is_delete=1`)
        }
        qb.skip(pageSize * (current - 1))
            .take(pageSize)
            .leftJoinAndSelect('article.categories', 'categories')
            .leftJoinAndSelect('article.tags', 'tags')
            .orderBy('article.create_time', 'DESC')

        const [ list, total ] = await qb.getManyAndCount();
        
        const newList = list.map(m => {
            const { create_time, update_time, publish_time, ...others } = m;
            return {
                ...others,
                create_time: create_time ? dateFmt(create_time) : null,
                update_time: update_time ? dateFmt(update_time) : null,
                publish_time: publish_time ? dateFmt(publish_time) : null
            }
        });
        return {
            total,
            list: newList
        }
    }


    private handleTags (tagList: Tag[]): TagEntity[] {
        const tagEntities = [];
        tagList.forEach(tag => {
            const tagEntity = new TagEntity();
            tagEntity.id = tag.id;
            tagEntity.name = tag.name;
            tagEntity.color = tag.color;
            tagEntity.sort = tag.sort;
            tagEntity.create_time = new Date(tag.create_time);
            tagEntity.update_time = new Date(tag.update_time);
            tagEntities.push(tagEntity);
        })
        return tagEntities;
    }

    private handleCategories (categoryList: Category[]): CategoryEntity[] {
        const categoryEntities = [];
        categoryList.forEach(category => {
            const categoryEntity = new CategoryEntity();
            categoryEntity.id = category.id;
            categoryEntity.name = category.name;
            categoryEntity.sort = category.sort;
            categoryEntity.create_time = new Date(category.create_time);
            categoryEntity.update_time = new Date(category.update_time);
            categoryEntities.push(categoryEntity);
        })
        return categoryEntities;
    }


    async addOne(dto: ArticleDto) {
        const { title, content, cover, html_content, is_publish, is_delete, is_drafts, tags, categories, description } = dto;
        const article = new ArticleEntity();
        article.title = title;
        article.content = content;
        article.html_content = html_content;
        article.description = description;
        article.cover = cover;
        article.is_publish = is_publish;
        article.is_delete = is_delete;
        article.is_drafts = is_drafts;
        article.create_time = new Date();

        article.tags = this.handleTags(tags);
        article.categories = this.handleCategories(categories);
        
        const savedArticle = await this.articleRepository.save(article);
        return savedArticle;
    }

    async updateOne(params: ArticleDto): Promise<ArticleEntity> {
        const { id, title, content, html_content, cover, tags, categories, description } = params;
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
        res.html_content = html_content;
        res.description = description;
        res.cover = cover;
        res.tags = this.handleTags(tags);
        res.categories = this.handleCategories(categories);
        res.update_time = new Date();

        const article = Object.assign({}, res);
        const savedArticle = await this.articleRepository.save(article);
        return savedArticle;
    }

    async getOne(id: number): Promise<Article> {
        const qb = this.articleRepository.createQueryBuilder('article');
        qb.where(`article.is_delete=0`)
            .andWhere(`article.id=${id}`)
            .leftJoinAndSelect('article.tags', 'tags')
            .leftJoinAndSelect('article.categories', 'categories')
        const res = await qb.getOne();
        if (!res) {
            throw new BadRequestException({
                message: HTTP_QUERY_ERROR_TEXT,
                statusCode: 400,
                data: {}
            });
        }
        const { create_time, update_time, publish_time, ...others } = res;
        const article = {
            create_time: create_time ? dateFmt(create_time) : null,
            update_time: update_time ? dateFmt(update_time) : null,
            publish_time: publish_time ? dateFmt(publish_time) : null,
            ...others
        }

        return article;
    }

    async deleteOne(id: number): Promise<ArticleEntity> {
        const res = await this.articleRepository.findOne({
            id: id,
            is_delete: 0,
            is_publish: 0
        });
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

    // blog 前台相关
    async pageQueryForBlog ({ pageSize, current }: ArticlePage): Promise<{ total: number; list: Article[] }> {
        const qb = this.articleRepository.createQueryBuilder('article');
        qb.where('article.is_delete=0')
            .andWhere('article.is_publish=1')
            .andWhere('article.is_drafts=0')
            .skip(pageSize * (current - 1))
            .take(pageSize)
            .leftJoinAndSelect('article.categories', 'categories')
            .leftJoinAndSelect('article.tags', 'tags')
            .orderBy('article.create_time', 'DESC')

        const [ list, total ] = await qb.getManyAndCount();
        
        const newList = list.map(m => {
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { create_time, update_time, publish_time, content, ...others } = m;
            return {
                ...others,
                create_time: create_time ? dateFmt(create_time) : null,
                update_time: update_time ? dateFmt(update_time) : null,
                publish_time: publish_time ? dateFmt(publish_time) : null
            }
        });
        return {
            total,
            list: newList
        }
    }

    // 新增观看次数
    async addWatchTimes(id: number): Promise<ArticleEntity> {
        const res = await this.articleRepository.findOne({
            id: id,
            is_delete: 0,
            is_publish: 1
        });
        if (!res) {
            throw new BadRequestException({
                message: HTTP_UPDATE_ERROR_TEXT,
                statusCode: 400,
                data: {}
            });
        }
        res.watch_times+=1;
        res.update_time = new Date();
        const article = Object.assign({}, res);
        const savedArticle = await this.articleRepository.save(article);
        return savedArticle;
    }

    // 新增点赞次数
    async addLikeTimes(id: number): Promise<ArticleEntity> {
        const res = await this.articleRepository.findOne({
            id: id,
            is_delete: 0,
            is_publish: 1
        });
        if (!res) {
            throw new BadRequestException({
                message: HTTP_UPDATE_ERROR_TEXT,
                statusCode: 400,
                data: {}
            });
        }
        res.like_times += 1;
        res.update_time = new Date();
        const article = Object.assign({}, res);
        const savedArticle = await this.articleRepository.save(article);
        return savedArticle;
    }

    // 查询某一条数据的前一条和后一条
    async queryPreOrNextData(id: number): Promise<{ pre: {id: number; title: string;} | null; next: {id: number; title: string;} | null }> {
        const res = await this.articleRepository.query(`
            select * from article where id  in (
                (select max(id) from article where id < ${id} and is_publish = 1), 
                (select min(id) from article where id > ${id} and is_publish = 1)
            )
        `);
        const [ article1, article2 ] = res;
        const result = {
            pre: null,
            next: null
        };
        if (article1 && article2) {
            result.pre = {
                id: article1.id,
                title: article1.title
            };
            result.next = {
                id: article2.id,
                title: article2.title
            };
        }
        if (article1 && !article2) {
            if (article1.id < id) {
                result.pre = {
                    id: article1.id,
                    title: article1.title
                };
            } else {
                result.next = {
                    id: article1.id,
                    title: article1.title
                };
            }
        }

        return result;
    }

    // async queryArticleListByCategoryOrTag (id, pageSize, current) {
    //     const qb = this.articleRepository.createQueryBuilder('article');
    //     qb.where('article.is_delete=0')
    //         .andWhere('article.is_publish=1')
    //         .andWhere('article.is_drafts=0')
    //         .skip(pageSize * (current - 1))
    //         .take(pageSize)
    //         .leftJoinAndSelect('article.categories', 'category')
    //         .leftJoinAndSelect('article.tags', 'tag')
    //         .orderBy('article.create_time', 'DESC')


    //     const [ list, total ] = await qb.getManyAndCount();
    //     console.log('list', list);
    //     console.log('total', total);

    //     return list;
    // }
}
