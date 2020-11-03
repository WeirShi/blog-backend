import { IsArray, IsNotEmpty } from 'class-validator';
import { Tag } from 'src/interface/tag.interface';
import { Category } from 'src/interface/category.interface';


export class ArticleDto {
    id?: number;
    
    @IsNotEmpty()
    title: string;

    @IsNotEmpty()
    content: string;

    @IsNotEmpty()
    html_content: string;

    @IsNotEmpty()
    cover: string;
    
    @IsArray()
    @IsNotEmpty()
    tags: Tag[];

    @IsArray()
    @IsNotEmpty()
    categories: Category[];

    is_publish?: number;
    
    is_drafts?: number;

    is_delete?: number;
}
