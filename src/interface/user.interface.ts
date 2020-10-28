import { ResponseData } from './response.interface';
export interface UserData {
    id: number;
    mobile: string;
    token?: string;
    password?: string;
    avatar?: string;
    create_time?: string;
    update_time?: string;
}

export interface LoginData extends ResponseData {
    data: UserData
}
