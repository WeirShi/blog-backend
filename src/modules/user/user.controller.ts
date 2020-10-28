import {
  Controller, Get, Post, Body, Req,
  NotFoundException, BadRequestException
} from '@nestjs/common';
import { UserData } from 'src/interface/user.interface';
import { ResponseData } from 'src/interface/response.interface';
import { UserDto } from './dto';
import { UserService } from './user.service';

import {
  HTTP_REGIST_SUCCESS_TEXT,
  HTTP_LOGIN_SUCCESS_TEXT,
  HTTP_NO_USER_TEXT,
  HTTP_QUERY_SUCCESS_TEXT
} from 'src/constants/text.constant';

import { dateFmt } from 'src/public/utils/time';
import { Request } from 'express';

import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';


@ApiBearerAuth()
@ApiTags('user')
@Controller()
export class UserController {
  constructor(private readonly userService: UserService) {}

    @Post('login')
    async login(@Body() userDto: UserDto): Promise<ResponseData<UserData>> {
      const user = await this.userService.findOne(userDto);
      if (!user) {
        throw new NotFoundException({
          statusCode: 400,
          message: HTTP_NO_USER_TEXT
        });
      }
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { create_time, update_time, password, ...others } = user;
      return {
        statusCode: 0,
        data: {
          ...others,
          create_time: create_time ? dateFmt(create_time) : null,
          update_time: update_time ? dateFmt(create_time) : null,
          token: this.userService.generateToken(user)
        },
        message: HTTP_LOGIN_SUCCESS_TEXT
      }
    }


    @Post('regist')
    async regist(@Body() userDto: UserDto): Promise<ResponseData<{}>> {
      try {
        await this.userService.createOne(userDto);
        return {
          message: HTTP_REGIST_SUCCESS_TEXT,
          data: {},
          statusCode: 0
        }
      } catch (error) {
        throw new BadRequestException({
          statusCode: 400,
          data: {},
          message: error
        });
      }
    }

    
    @Get('user')
    async getUser(@Req() request: Request): Promise<ResponseData<UserData>> {
      const user = request['user'];
      try {
        const res = await this.userService.findById(user.id);
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { create_time, update_time, password, ...others } = res;
        return {
          statusCode: 0,
          data: {
            ...others,
            create_time: create_time ? dateFmt(create_time) : null,
            update_time: update_time ? dateFmt(create_time) : null
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
}
