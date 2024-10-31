import { plainToInstance } from "class-transformer";

type ResponseBase = {
    message: string;
    status: string;
    code?: string;
};

export const convertSchemaData = <T, U, V extends T>(dataSchema: new () => V, data: U | U[]): any => {
    return plainToInstance(dataSchema, data, {
        excludeExtraneousValues: true,
        enableImplicitConversion: true,
    }) as any
}

export class CustomResponse {
    static success<T, U, V extends T | undefined>(
        message: string,
        data?: U | U[],
        dataSchema?: new () => V
    ): ResponseBase & { data?: T } {
        let response: ResponseBase & { data?: T } = {
            status: "success",
            message
        };

        if (dataSchema && data !== undefined) {
            response.data = convertSchemaData(dataSchema, data)
        } else {
            response.data = data as T;
        }
        return response;
    }

    static error(message: string, code: string, data?: Record<string, any>): ResponseBase {
        var resp: ResponseBase & { data?: Record<string, any> } = {
            status: "failure",
            code,
            message,
        };
        if (data) resp.data = data
        return resp
    }
}

export const randomStr = (length: number): string => {
    const charset = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let randomString = "";

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * charset.length);
        randomString += charset.charAt(randomIndex);
    }

    return randomString;
}