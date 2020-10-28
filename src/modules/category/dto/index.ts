import { IsInt, IsNotEmpty } from 'class-validator';
import { PARAM_NAME_REQUIRED, PARAM_SORT_NUMBER_TEXT } from '../../../constants/text.constant'
// import { ApiProperty } from '@nestjs/swagger';


export class CategoryDto {

    @IsNotEmpty({ message: PARAM_NAME_REQUIRED })
    readonly name: string;

    @IsInt({ message: PARAM_SORT_NUMBER_TEXT })
    readonly sort: number;
}

