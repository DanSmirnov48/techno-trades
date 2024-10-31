import { Request, Response, NextFunction } from "express";
import { CustomResponse } from "../config/utils";
import { User } from "../models/users";
import { ErrorCode, RequestError, ValidationErr } from "../config/handlers";
import { checkPassword, createAccessToken, createRefreshToken, createUser, } from "../managers/users";
import asyncHandler from "../middlewares/asyncHandler";

export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userData = req.body;

        const { email } = userData;
        const existingUser = await User.findOne({ email })
        if (existingUser) throw new ValidationErr("email", "Email already registered")
        const user = await createUser(req.body)
        return res.status(201).json(CustomResponse.success('Registration successful', user))
    } catch (error) {
        next(error)
    }
});

export const logIn = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userData = req.body;

        const { email, password } = userData;
        const user = await User.findOne({ email }).select('+password');
        if (!user) throw new RequestError("Invalid credentials!", 401, ErrorCode.INVALID_CREDENTIALS);
        if (!user || !(await checkPassword(user, password as string))) throw new RequestError("Invalid credentials!", 401, ErrorCode.INVALID_CREDENTIALS);

        if (!user.isEmailVerified) throw new RequestError("Verify your email first", 401, ErrorCode.UNVERIFIED_USER);

        // Generate tokens
        const access = createAccessToken(user.id)
        const refresh = createRefreshToken()
        let tokens = { access, refresh }

        return res.status(201).json(CustomResponse.success('Login successful', tokens))
    } catch (error) {
        next(error)
    }
});
