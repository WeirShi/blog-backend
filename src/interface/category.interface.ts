import { ResponseData } from './response.interface';

export interface Category {
    id: number;
    name: string;
    sort?: number;
    create_time?: string | null;
    update_time?: string | null;
    is_detele?: number;
}

export interface ListData extends ResponseData {
    data: {
        total: number;
        list: Category[];
    }
}
