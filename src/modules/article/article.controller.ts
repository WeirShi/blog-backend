import { Controller, Get, Query, BadRequestException, Post, Body, Delete, Put } from '@nestjs/common';
import { ArticleService } from './article.service';
import {
    HTTP_QUERY_ERROR_TEXT,
    HTTP_QUERY_SUCCESS_TEXT,
    HTTP_ADD_ERROR_TEXT,
    HTTP_ADD_SUCCESS_TEXT,
    HTTP_DELETE_SUCCESS_TEXT,
    HTTP_UPDATE_SUCCESS_TEXT,
    HTTP_DELETE_ERROR_TEXT,
    HTTP_UPDATE_ERROR_TEXT
} from 'src/constants/text.constant';
import { ResponseData } from 'src/interface/response.interface';
import { ListData, ArticlePage, Article } from 'src/interface/article.interface';
import { ArticleDto } from './dto';


@Controller()
export class ArticleController {
    constructor(private readonly articleService: ArticleService) {}

    @Get('article')
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
            return {
                statusCode: 400,
                data: error,
                message: HTTP_QUERY_ERROR_TEXT
            }
        }
    }


    @Post('article')
    async addArticle(@Body() body: ArticleDto): Promise<ResponseData<{}>> {
        try {
            await this.articleService.addOne(body);
            return {
                statusCode: 0,
                data: {},
                message: HTTP_ADD_SUCCESS_TEXT
            }
        } catch (error) {
            return {
                statusCode: 400,
                data: error,
                message: HTTP_ADD_ERROR_TEXT
            }
        }
    }


    @Delete('article')
    async deleteArticle(@Query('id') id: number): Promise<ResponseData<{}>> {
        try {
            await this.articleService.deleteOne(id);
            return {
                statusCode: 0,
                data: {},
                message: HTTP_DELETE_SUCCESS_TEXT
            }
        } catch (error) {
            return {
                statusCode: 400,
                data: error.response,
                message: HTTP_DELETE_ERROR_TEXT
            }
        }
    }

    @Put('article')
    async updateArticle(@Body() body: ArticleDto): Promise<ResponseData<{}>> {
        try {
            await this.articleService.updateOne(body);
            return {
                statusCode: 0,
                data: {},
                message: HTTP_UPDATE_SUCCESS_TEXT
            }
        } catch (error) {
            return {
                statusCode: 400,
                data: error.response,
                message: HTTP_UPDATE_ERROR_TEXT
            }
        }
    }

    @Get('article/detail')
    async getDetail(@Query('id') id: number): Promise<ResponseData<Article>> {
        try {
            const res = await this.articleService.getOne(id);
            return {
                statusCode: 0,
                data: res,
                message: HTTP_QUERY_SUCCESS_TEXT
            }
        } catch (error) {
            return error.response;
        }
    }

    @Put('article/publish')
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

    @Put('article/drafts')
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

    @Put('article/list')
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

    // blog 前台相关API
    @Get('blog/article/list')
    async getArticleListForBlog(@Query() query: ArticlePage): Promise<ResponseData<ListData>> {
        const { pageSize, current } = query;
        try {
            const res = await this.articleService.pageQueryForBlog({
                pageSize: Number(pageSize),
                current: Number(current)
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
            throw new BadRequestException({
                message: HTTP_QUERY_ERROR_TEXT,
                statusCode: 400,
                data: {}
            });
        }
    }

    @Get('blog/article/detail')
    async getArticleDetailForBlog(@Query('id') id: number): Promise<ResponseData<Article>> {
        try {
            const res = await this.articleService.getOne(id);
            return {
                statusCode: 0,
                data: res,
                message: HTTP_QUERY_SUCCESS_TEXT
            }
        } catch (error) {
            return error.response;
        }
    }

    @Put('blog/article/like')
    async likeArticleForBlog(@Body('id') id: number): Promise<ResponseData<{}>> {
        try {
            await this.articleService.addLikeTimes(id);
            return {
                statusCode: 0,
                message: HTTP_UPDATE_SUCCESS_TEXT,
                data: {}
            }
        } catch (error) {
            return error.response;
        }
    }

    @Put('blog/article/watchtimes/add')
    async addArticleWatchTimes(@Body('id') id: number): Promise<ResponseData<{}>> {
        try {
            await this.articleService.addWatchTimes(id);
            return {
                statusCode: 0,
                message: HTTP_UPDATE_SUCCESS_TEXT,
                data: {}
            }
        } catch (error) {
            return error.response;
        }
    }

    @Get('blog/article/next')
    async getArticlePreOrNext(@Query('id') id: number): Promise<ResponseData<{}>> {
        try {
            const res = await this.articleService.queryPreOrNextData(id);
            return {
                statusCode: 0,
                message: HTTP_QUERY_SUCCESS_TEXT,
                data: res
            }
        } catch (error) {
            return error.response;
        }
    }

    // @Get('blog/article/by/category')
    // async getArticleByCategory(
    //     @Query('id') id: number,
    //     @Query('pageSize') pageSize: number,
    //     @Query('current') current: number,
    // ): Promise<ResponseData<{}>> {
    //     try {
    //         const res = await this.articleService.queryArticleListByCategoryOrTag(id, pageSize, current);
    //         return {
    //             statusCode: 0,
    //             message: HTTP_QUERY_SUCCESS_TEXT,
    //             data: res
    //         }
    //     } catch (error) {
    //         console.log(error);
    //         return error.response;
    //     }
    // }
}
