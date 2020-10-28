import { Controller, Get, Query, BadRequestException, Post, Body, Delete, Put } from '@nestjs/common';
import { ArticleService } from './article.service';
import {
    HTTP_QUERY_ERROR_TEXT,
    HTTP_QUERY_SUCCESS_TEXT,
    HTTP_ADD_ERROR_TEXT,
    HTTP_ADD_SUCCESS_TEXT,
    HTTP_DELETE_SUCCESS_TEXT,
    HTTP_UPDATE_SUCCESS_TEXT
} from 'src/constants/text.constant';
import { ResponseData } from 'src/interface/response.interface';
import { ListData, ArticlePage, Article } from 'src/interface/article.interface';
import { dateFmt } from 'src/public/utils/time'
import { ArticleDto } from './dto';


@Controller('article')
export class ArticleController {
    constructor(private readonly articleService: ArticleService) {}

    @Get()
    async getList(@Query() query: ArticlePage): Promise<ResponseData<ListData>> {
        const { pageSize, current, type } = query;
        try {
            const res = await this.articleService.pageQuery({
                pageSize: Number(pageSize),
                current: Number(current),
                type: Number(type)
            });
            const { total, list } = res;
            const newList = list.map(m => {
                return {
                    id: m.id,
                    title: m.title,
                    content: m.content,
                    cover: m.cover,
                    is_delete: m.is_delete,
                    is_publish: m.is_publish,
                    is_drafts: m.is_drafts,
                    create_time: m.create_time ? dateFmt(m.create_time) : null,
                    update_time: m.update_time ? dateFmt(m.update_time) : null,
                    publish_time: m.publish_time ? dateFmt(m.publish_time) : null
                }
            });
            return {
                message: HTTP_QUERY_SUCCESS_TEXT,
                data: {
                    total,
                    list: newList
                },
                statusCode: 0
            }
        } catch (error) {
            throw new BadRequestException({
                message: HTTP_QUERY_ERROR_TEXT,
                statusCode: 400,
                data: {}
            });
        }
    }


    @Post()
    async addArticle(@Body() body: ArticleDto): Promise<ResponseData<{}>> {
        try {
            await this.articleService.addOne(body);
            return {
                statusCode: 0,
                data: {},
                message: HTTP_ADD_SUCCESS_TEXT
            }
        } catch (error) {
            throw new BadRequestException({
                message: HTTP_ADD_ERROR_TEXT,
                statusCode: 400,
                data: {}
            });
        }
    }


    @Delete()
    async deleteArticle(@Query('id') id: number): Promise<ResponseData<{}>> {
        try {
            await this.articleService.deleteOne(id);
            return {
                statusCode: 0,
                data: {},
                message: HTTP_DELETE_SUCCESS_TEXT
            }
        } catch (error) {
            return error.response;
        }
    }

    @Get('detail')
    async getDetail(@Query('id') id: number): Promise<ResponseData<Article>> {
        try {
            const res = await this.articleService.getOne(id);
            const { create_time, update_time, publish_time, ...others } = res;
            const article = {
                create_time: create_time ? dateFmt(create_time) : null,
                update_time: update_time ? dateFmt(update_time) : null,
                publish_time: publish_time ? dateFmt(publish_time) : null,
                ...others
            }
            return {
                statusCode: 0,
                data: article,
                message: HTTP_QUERY_SUCCESS_TEXT
            }
        } catch (error) {
            return error.response;
        }
    }

    @Put()
    async updateArticle(@Body() body: Article): Promise<ResponseData<{}>> {
        try {
            await this.articleService.updateOne(body);
            return {
                statusCode: 0,
                data: {},
                message: HTTP_UPDATE_SUCCESS_TEXT
            }
        } catch (error) {
            return error.response;
        }
    }

    @Put('publish')
    async publishArticle(
        @Body('id') id: number,
        @Body('is_publish') isPublish: number
    ): Promise<ResponseData<{}>> {
        try {
            await this.articleService.updatePublish(id, isPublish);
            return {
                statusCode: 0,
                message: HTTP_UPDATE_SUCCESS_TEXT,
                data: {}
            }
        } catch (error) {
            return error.response;
        }
    }

    @Put('drafts')
    async saveArticleToDrafts(@Body('id') id: number): Promise<ResponseData<{}>> {
        try {
            await this.articleService.updateDrafts(id);
            return {
                statusCode: 0,
                message: HTTP_UPDATE_SUCCESS_TEXT,
                data: {}
            }
        } catch (error) {
            return error.response;
        }
    }

    @Put('list')
    async saveArticleToList(@Body('id') id: number): Promise<ResponseData<{}>> {
        try {
            await this.articleService.updateList(id);
            return {
                statusCode: 0,
                message: HTTP_UPDATE_SUCCESS_TEXT,
                data: {}
            }
        } catch (error) {
            return error.response;
        }
    }

}
