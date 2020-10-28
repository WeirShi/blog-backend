import {} from 'class-validator';


export class ArticleDto {
    title: string;

    content: string;

    cover: string;

    is_publish?: number;
    
    is_drafts?: number;

    is_delete?: number;
}
