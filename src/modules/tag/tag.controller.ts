import { Controller, Get, Post, Put, Delete, Query, Body, BadRequestException } from '@nestjs/common';
import { TagService } from './tag.service';
import { Pagination } from 'src/interface/pagination.interface';
import { ListData, Tag } from 'src/interface/tag.interface';
import { ResponseData } from 'src/interface/response.interface';
import {
    HTTP_QUERY_SUCCESS_TEXT,
    HTTP_ADD_SUCCESS_TEXT,
    HTTP_DELETE_SUCCESS_TEXT,
    HTTP_UPDATE_SUCCESS_TEXT
} from 'src/constants/text.constant';
import { TagDto } from './dto';


@Controller()
export class TagController {
    constructor(private readonly tagService: TagService) {}


    @Get('tag')
    async getTagList(@Query() query: Pagination): Promise<ResponseData<ListData>> {
        try {
            const res = await this.tagService.pageQuery(query);
            return {
                statusCode: 0,
                data: res,
                message: HTTP_QUERY_SUCCESS_TEXT
            }
        } catch (error) {
            throw new BadRequestException({
                statusCode: 400,
                data: {},
                message: error
            });
        }
    }

    @Post('tag')
    async addTag(@Body() body: TagDto): Promise<ResponseData<{}>> {
        try {
            await this.tagService.addOne(body);
            return {
                statusCode: 0,
                data: {},
                message: HTTP_ADD_SUCCESS_TEXT
            }
        } catch (error) {
            return error.response;
        }
    }

    @Put('tag')
    async changeTag(@Body() body): Promise<ResponseData<{}>> {
        try {
            await this.tagService.updateOne(body);
            return {
                statusCode: 0,
                data: {},
                message: HTTP_UPDATE_SUCCESS_TEXT
            }
        } catch (error) {
            return error.response;
        }
        
    }

    @Delete('tag')
    async deleteTag(@Query('id') id: number): Promise<ResponseData<{}>> {
        try {
            await this.tagService.deleteOne(id);
            return {
                statusCode: 0,
                data: {},
                message: HTTP_DELETE_SUCCESS_TEXT
            }
        } catch (error) {
            return error.response;
        }
    }

    @Get('tag/all')
    async getAllTag(): Promise<ResponseData<Tag[]>> {
        try {
            const res = await this.tagService.getAll();
            return {
                statusCode: 0,
                data: res,
                message: HTTP_QUERY_SUCCESS_TEXT
            }
        } catch (error) {
            throw new BadRequestException({
                statusCode: 400,
                data: {},
                message: error
            });
        }
    }

    @Get('blog/tag/all')
    async getAllTagForBlog(): Promise<ResponseData<Tag[]>> {
        try {
            const res = await this.tagService.getAll();
            return {
                statusCode: 0,
                data: res,
                message: HTTP_QUERY_SUCCESS_TEXT
            }
        } catch (error) {
            return error.response;
        }
    }
}
