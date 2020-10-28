import { IsNotEmpty, IsMobilePhone } from 'class-validator';
import { PARAM_MOBILE_REQUIRED, PARAM_PASSWORD_REQUIRED } from '../../../constants/text.constant'
import { ApiProperty } from '@nestjs/swagger';


export class UserDto {
    @ApiProperty({
        description: '用户名：手机号'
    })
    @IsMobilePhone('zh-CN')
    @IsNotEmpty({ message: PARAM_MOBILE_REQUIRED })
    readonly mobile: string;

    @ApiProperty({
        description: '密码'
    })
    @IsNotEmpty({ message: PARAM_PASSWORD_REQUIRED })
    readonly password: string;
}
