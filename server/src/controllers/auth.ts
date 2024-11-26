import { Request, Response, NextFunction, Router } from "express";
import { CustomResponse, randomStr } from "../config/utils";
import { AUTH_TYPE, User } from "../models/users";
import { ErrorCode, NotFoundError, RequestError, ValidationErr } from "../config/handlers";
import { checkPassword, createAccessToken, createOtp, createRefreshToken, createUser, hashPassword, setAuthCookie, validateGoogleToken, verifyRefreshToken } from "../managers/users";
import asyncHandler from "../middlewares/asyncHandler";
import { authMiddleware, getUser } from "../middlewares/auth";
import { sendEmail, EmailType } from '../utils/mailSender'
import { TokenPayload } from "google-auth-library";

const authRouter = Router();

authRouter.post('/register', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
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
}));

authRouter.post('/verify-email', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userData = req.body;
        const { email } = userData;
        const otp = Number(userData.otp)

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
}));

authRouter.post('/resend-verification-email', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
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
}));

authRouter.post('/send-password-reset-otp', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userData = req.body;
        const { email } = userData;

        const user = await User.findOne({ email })
        if (!user) {
            throw new NotFoundError("Incorrect email!")
        }
        if (user.authType === AUTH_TYPE.GOOGLE) {
            throw new RequestError("Cannot request password reset for account created via google sign in", 401, ErrorCode.INCORRECT_EMAIL)
        }

        let otp = await createOtp(user);
        return res.status(200).json(CustomResponse.success('Email sent successful', otp))
    } catch (error) {
        next(error)
    }
}));

authRouter.post('/set-new-password', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userData = req.body;
        const { email, password } = userData;
        const otp = Number(userData.otp)

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
            { $set: { otp: null, otpExpiry: null, password: await hashPassword(password as string) } }
        );
        return res.status(200).json(CustomResponse.success('Password reset successful'))
    } catch (error) {
        next(error)
    }
}));

authRouter.post('/login', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
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
        const tokens = { user, access, refresh }

        // Set cookies
        setAuthCookie(res, req, 'access', access);
        setAuthCookie(res, req, 'refresh', refresh);

        // Update user with access tokens
        await User.updateOne(
            { _id: user._id },
            { $push: { tokens } }
        );
        return res.status(201).json(CustomResponse.success('Login successfully', tokens))
    } catch (error) {
        next(error)
    }
}));

authRouter.post('/send-login-otp', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
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
}));

authRouter.post('/login-with-otp', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userData = req.body;
        const { email } = userData;
        const otp = Number(userData.otp)

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
        const tokens = { user, access, refresh }

        // Set cookies
        setAuthCookie(res, req, 'access', access);
        setAuthCookie(res, req, 'refresh', refresh);

        // Update user with access tokens
        await User.updateOne(
            { _id: user._id },
            { $push: { tokens } }
        );
        return res.status(201).json(CustomResponse.success('Login successfully', tokens))
    } catch (error) {
        next(error)
    }
}));

authRouter.get('/validate', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
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
}));

authRouter.post('/refresh', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const refreshToken: string = req.body.refresh;
        const user = await User.findOne({ "tokens.refresh": refreshToken });
        if (!user || !(await verifyRefreshToken(refreshToken))) {
            throw new RequestError("Refresh token is invalid or expired!", 401, ErrorCode.INVALID_TOKEN);
        }

        // Generate new tokens
        const access = createAccessToken(user.id)
        const refresh = createRefreshToken()

        // Update user with access tokens
        let tokens = { user, access, refresh }
        await User.updateOne(
            { _id: user._id, "tokens.refresh": refreshToken },
            { $set: { "tokens.$": tokens } }
        );
        return res.status(201).json(CustomResponse.success('Tokens refreshed successfully', tokens))
    } catch (error) {
        next(error)
    }
}));


authRouter.get('/logout', authMiddleware, asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user;

        const authorization = req.headers.authorization as string
        const token = authorization.replace('Bearer ', '');
        await User.updateOne(
            { _id: user._id, "tokens.access": token },
            { $pull: { tokens: { access: token } } }
        );
        return res.status(200).json(CustomResponse.success("Logout Successfully"))
    } catch (error) {
        next(error)
    }
}));

authRouter.post('/google', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
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
        if (user && user.authType === AUTH_TYPE.PASSWORD) {
            throw new RequestError("Requires password to sign in to this account", 401, ErrorCode.INVALID_AUTH);
        }
        else if (!user) {
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
            user = await createUser(userData, true, AUTH_TYPE.GOOGLE)
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
}));

export default authRouter;