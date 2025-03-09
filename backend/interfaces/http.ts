export interface IResponse<T> {
    message: string;
    status_code: number;
    data?: T;
    error?: {};
}