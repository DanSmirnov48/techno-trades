import { NextFunction, Request, Response } from "express";
import { ErrorCode, RequestError } from "../config/handlers"

export const handleError = (err: RequestError, req: Request, res: Response, next: NextFunction) => {
    const status = err.status || 500;
    const code = err.code || ErrorCode.SERVER_ERROR;
    const message = err.message || 'Something went wrong';
    const data = err.data || null;

    // Format the error response
    const errorResponse = {
        status: 'failure',
        message: message,
        code: code,
        ...(data && { data: data }) // Conditionally include `data` if it exists
    };

    res.status(status).json(errorResponse);
};
