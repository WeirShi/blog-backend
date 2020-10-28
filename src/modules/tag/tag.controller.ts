import { Controller, Get, Post, Put, Delete, Query, Body, BadRequestException } from '@nestjs/common';
import { TagService } from './tag.service';
import { Pagination } from 'src/interface/pagination.interface';
import { ListData } from 'src/interface/tag.interface';
import { ResponseData } from 'src/interface/response.interface';
import {
    HTTP_QUERY_SUCCESS_TEXT,
    HTTP_ADD_SUCCESS_TEXT,
    HTTP_DELETE_SUCCESS_TEXT,
    HTTP_UPDATE_SUCCESS_TEXT
} from 'src/constants/text.constant';
import { dateFmt } from 'src/public/utils/time';
import { TagDto } from './dto';



@Controller('tag')
export class TagController {
    constructor(private readonly tagService: TagService) {}


    @Get()
    async getCategoryList(@Query() query: Pagination): Promise<ResponseData<ListData>> {
        try {
            const res = await this.tagService.pageQuery(query);
            const { total, list } = res;
            const newList = list.map(m => {
                return {
                    id: m.id,
                    sort: m.sort,
                    name: m.name,
                    color: m.color,
                    create_time: m.create_time ? dateFmt(m.create_time) : null,
                    update_time: m.update_time ? dateFmt(m.update_time) : null,
                    is_delete: m.is_delete
                }
            });
            return {
                statusCode: 0,
                data: {
                    total,
                    list: newList
                },
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

    @Post()
    async addCategory(@Body() body: TagDto): Promise<ResponseData<{}>> {
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

    @Put()
    async changeCategory(@Body() body): Promise<ResponseData<{}>> {
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

    @Delete()
    async deleteCategory(@Query('id') id: number): Promise<ResponseData<{}>> {
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

}
