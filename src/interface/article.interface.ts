import { Pagination } from './pagination.interface';
export interface Article {
    id: number;
    title: string;
    content: string;
    cover: string;
    is_publish: number;
    is_drafts: number;
    is_delete: number;
    publish_time?: string;
    update_time?: string;
    create_time?: string;
}

export interface ListData {
    total: number;
    list: Article[];
}

export interface ArticlePage extends Pagination {
    type?: number;
}

