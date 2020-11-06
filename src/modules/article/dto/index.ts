import { IsArray, IsNotEmpty } from 'class-validator';
import { Tag } from 'src/interface/tag.interface';
import { Category } from 'src/interface/category.interface';


export class ArticleDto {
    readonly id?: number;
    
    @IsNotEmpty()
    readonly title: string;

    @IsNotEmpty()
    readonly description: string;

    @IsNotEmpty()
    readonly content: string;

    @IsNotEmpty()
    readonly html_content: string;

    @IsNotEmpty()
    readonly cover: string;
    
    @IsArray()
    @IsNotEmpty()
    readonly tags: Tag[];

    @IsArray()
    @IsNotEmpty()
    readonly categories: Category[];

    readonly is_publish?: number;
    
    readonly is_drafts?: number;

    readonly is_delete?: number;
}
