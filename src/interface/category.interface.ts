export interface Category {
    id: number;
    name: string;
    sort?: number;
    create_time?: string | null;
    update_time?: string | null;
    is_detele?: number;
}

export interface ListData {
    total: number;
    list: Category[];
}
