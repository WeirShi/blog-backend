import { IsInt, IsNotEmpty } from 'class-validator';
import { PARAM_NAME_REQUIRED, PARAM_SORT_NUMBER_TEXT, PARAM_TAG_COLOR_TEXT } from '../../../constants/text.constant'
// import { ApiProperty } from '@nestjs/swagger';


export class TagDto {

    @IsNotEmpty({ message: PARAM_NAME_REQUIRED })
    readonly name: string;

    @IsNotEmpty({ message: PARAM_TAG_COLOR_TEXT })
    readonly color: string;

    @IsInt({ message: PARAM_SORT_NUMBER_TEXT })
    readonly sort: number;
}

