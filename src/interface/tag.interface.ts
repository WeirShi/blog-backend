export interface Tag {
    id: number;
    name: string;
    color: string;
    sort?: number;
    create_time?: string;
    update_time?: string;
    is_detele?: number;
}

export interface ListData {
    total: number;
    list: Tag[];
}
