import { Request, Response, NextFunction } from "express";
import { CustomResponse } from "../config/utils";
import { User } from "../models/users";
import { ErrorCode, NotFoundError, RequestError, ValidationErr } from "../config/handlers";
import { checkPassword, createAccessToken, createOtp, createRefreshToken, createUser, } from "../managers/users";
import asyncHandler from "../middlewares/asyncHandler";

export const register = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userData = req.body;
        const { email } = userData;
        
        const existingUser = await User.findOne({ email })
        if (existingUser) {
            throw new ValidationErr("email", "Email already registered")
        }
        const user = await createUser(req.body)
        let otp = await createOtp(user);
        return res.status(201).json(CustomResponse.success('Registration successful', { user, otp }))
    } catch (error) {
        next(error)
    }
});

export const verifyEmail = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userData = req.body;
        const { email, otp } = userData;

        const user = await User.findOne({ email })
        if (!user) throw new NotFoundError("Incorrect email!")

        if (user.isEmailVerified) {
            return res.status(200).json(CustomResponse.success("Email already verified"))
        }

        // Verify otp
        const currentDate = new Date()
        if (user.otp !== otp || currentDate > user.otpExpiry) {
            throw new RequestError("Otp is invalid or expired", 400, ErrorCode.INVALID_OTP)
        }

        // Update user
        await User.updateOne(
            { _id: user._id },
            { $set: { otp: null, otpExpiry: null, isEmailVerified: true } }
        );

        return res.status(200).json(CustomResponse.success('Verification successful', user))
    } catch (error) {
        next(error)
    }
});

export const logIn = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userData = req.body;
        const { email, password } = userData;

        const user = await User.findOne({ email })
        if (!user || !(await checkPassword(user, password as string))) {
            throw new RequestError("Invalid credentials!", 401, ErrorCode.INVALID_CREDENTIALS);
        }
        if (!user.isEmailVerified) {
            throw new RequestError("Verify your email first", 401, ErrorCode.UNVERIFIED_USER);
        }

        // Generate tokens
        const access = createAccessToken(user.id)
        const refresh = createRefreshToken()
        let tokens = { access, refresh }

        return res.status(201).json(CustomResponse.success('Login successful', { user, tokens }))
    } catch (error) {
        next(error)
    }
});

export const sendLoginOtp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const email: string = req.body.email;

        const user = await User.findOne({ email })
        if (!user) {
            throw new NotFoundError("User not found!")
        }
        if (!user.isEmailVerified) {
            throw new RequestError("Verify your email first", 401, ErrorCode.UNVERIFIED_USER);
        }

        let otp = await createOtp(user);
        return res.status(201).json(CustomResponse.success('Login otp sent successful', otp))
    } catch (error) {
        next(error)
    }
});

export const logingWithOtp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userData = req.body;
        const { email, otp } = userData;

        const user = await User.findOne({ email })
        if (!user) {
            throw new NotFoundError("Incorrect email!")
        }

        // Verify otp
        const currentDate = new Date()
        if (user.otp !== otp || currentDate > user.otpExpiry) {
            throw new RequestError("Otp is invalid or expired", 400, ErrorCode.INVALID_OTP)
        }

        // Generate tokens
        const access = createAccessToken(user.id)
        const refresh = createRefreshToken()
        let tokens = { access, refresh }

        return res.status(201).json(CustomResponse.success('Login successful', { user, tokens }))
    } catch (error) {
        next(error)
    }
});