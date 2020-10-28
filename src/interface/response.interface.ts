export interface ResponseData<T> {
    message: string;
    statusCode: number;
    data?: T;
}
