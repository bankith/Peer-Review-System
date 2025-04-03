// utils/ResponseFactory.ts
import ResponseData from '../models/Response/ResponseData';

export class ResponseFactory {
    static success<T>(data: T): ResponseData<T> {
        return {
            data: data,
            isError: false
        };
    }

    static error<T>(errorMessage: string, errorCode: string): ResponseData<T> {
        return {
            errorCode: errorCode,
            errorMessage: errorMessage,
            isError: true
        };
    }
}
