import { Request, Response, NextFunction } from "express";
import { CustomResponse, randomStr } from "../config/utils";
import { User } from "../models/users";
import { ErrorCode, NotFoundError, RequestError, ValidationErr } from "../config/handlers";
import { checkPassword, createAccessToken, createOtp, createRefreshToken, createUser, hashPassword, setAuthCookie, validateGoogleToken } from "../managers/users";
import asyncHandler from "../middlewares/asyncHandler";
import { getUser } from "../middlewares/auth";
import { sendEmail, EmailType } from '../utils/mailSender'
import { TokenPayload } from "google-auth-library";

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

export const resendVerificationEmail = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userData = req.body;
        const { email } = userData;

        const user = await User.findOne({ email })
        if (!user) {
            throw new NotFoundError("Incorrect email!")
        }

        if (user.isEmailVerified) {
            return res.status(200).json(CustomResponse.success("Email already verified"))
        }

        const otp = await createOtp(user);

        return res.status(200).json(CustomResponse.success('Email sent successful', otp))
    } catch (error) {
        next(error)
    }
});

export const sendPasswordResetOtp = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userData = req.body;
        const { email } = userData;

        const user = await User.findOne({ email })
        if (!user) {
            throw new NotFoundError("User not found!")
        }

        let otp = await createOtp(user);
        return res.status(200).json(CustomResponse.success('Email sent successful', otp))
    } catch (error) {
        next(error)
    }
});

export const setNewPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userData = req.body;
        const { email, otp, password } = userData;
        const user = await User.findOne({ email })
        if (!user) {
            throw new NotFoundError("Incorrect email!")
        }

        // Verify otp
        let currentDate = new Date()
        if (user.otp !== otp || currentDate > user.otpExpiry) {
            throw new RequestError("Otp is invalid or expired", 400, ErrorCode.INVALID_OTP)
        }

        // Update user
        await User.updateOne(
            { _id: user._id },
            { $set: { otp: null, otpExpiry: null, password: password } }
        );
        return res.status(200).json(CustomResponse.success('Password reset successful'))
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

        // Set cookies
        setAuthCookie(res, req, 'access', access);
        setAuthCookie(res, req, 'refresh', refresh);

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

        // Set cookies
        setAuthCookie(res, req, 'access', access);
        setAuthCookie(res, req, 'refresh', refresh);

        return res.status(201).json(CustomResponse.success('Login successful', { user, tokens }))
    } catch (error) {
        next(error)
    }
});

export const validate = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { accessToken } = req.cookies;
        if (accessToken) {
            const user = await getUser(accessToken);
            req.user = user
            return res.status(200).json(CustomResponse.success('Validate successful', user))
        }
    } catch (error) {
        next(error)
    }
});

export const logout = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.clearCookie("accessToken");
        res.clearCookie("refreshToken");
        return res.status(200).json(CustomResponse.success('Logout successful'))
    } catch (error) {
        next(error)
    }
});

export const google = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userData = req.body;
        const { token } = userData;

        // Validate token
        const { payload, error } = await validateGoogleToken(token as string) as { payload: TokenPayload, error: string }
        if (error) {
            throw new RequestError(error, 401, ErrorCode.INVALID_TOKEN);
        }

        // Get or Create User
        let user = await User.findOne({ email: payload.email })
        if (!user) {
            const userData = {
                firstName: payload.given_name || payload.name || '',
                lastName: payload.family_name || '',
                email: payload.email || '',
                password: await hashPassword('password123'),
                isEmailVerified: payload.email_verified || false,
                isActive: true,
                role: 'user' as const,
                photo: {
                    key: payload.sub,
                    name: randomStr(10),
                    url: payload.picture,
                }
            }
            user = await createUser(userData, true)
        }

        // Generate tokens
        const access = createAccessToken(user.id)
        const refresh = createRefreshToken()

        // Set cookies
        setAuthCookie(res, req, 'access', access);
        setAuthCookie(res, req, 'refresh', refresh);

        // Update user with access and refresh tokens
        let tokens = { user, access, refresh }
        await User.updateOne(
            { _id: user._id },
            { $push: { tokens } }
        );
        return res.status(201).json(CustomResponse.success('Login successful', { user, tokens }))
    } catch (error) {
        next(error)
    }
});