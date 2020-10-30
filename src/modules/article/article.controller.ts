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
            const { total, list} = res;
            return {
                message: HTTP_QUERY_SUCCESS_TEXT,
                data: {
                    total,
                    list
                },
                statusCode: 0
            }
        } catch (error) {
            console.log('error', error);
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
            return {
                statusCode: 0,
                data: res,
                message: HTTP_QUERY_SUCCESS_TEXT
            }
        } catch (error) {
            console.log(error);
            return error.response;
        }
    }

    @Put()
    async updateArticle(@Body() body: ArticleDto): Promise<ResponseData<{}>> {
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
