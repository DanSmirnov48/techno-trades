import { NextFunction, Request, Response } from "express";
import { ErrorCode, RequestError } from "../config/handlers";
import { ACCOUNT_TYPE, IUser } from "../models/users";
import { decodeAuth } from "../managers/users"

export const getUser = async (token: string): Promise<IUser> => {
    const user = await decodeAuth(token)
    if (!user) {
        throw new RequestError("Access token is invalid or expired", 401, ErrorCode.INVALID_TOKEN)
    }
    return user
}

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (!req.headers.authorization || !req.headers.authorization.startsWith('Bearer ')) {
            throw new RequestError("Unauthorized User", 401, ErrorCode.UNAUTHORIZED_USER);
        }
        req.user = await getUser(req.headers.authorization.replace('Bearer ', ''));
        next();
    } catch (error) {
        next(error)
    }
};

export const staff = async (req: Request, res: Response, next: NextFunction) => {
    try {
        if (req.user.accountType !== ACCOUNT_TYPE.STAFF) {
            throw new RequestError("Unauthorized User", 401, ErrorCode.UNAUTHORIZED_USER);
        }
        next();
    } catch (error) {
        next(error)
    }
};