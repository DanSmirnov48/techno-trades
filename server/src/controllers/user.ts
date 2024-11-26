import { Request, Response, NextFunction, Router } from "express";
import { CustomResponse } from "../config/utils";
import { User } from "../models/users";
import { ErrorCode, NotFoundError, RequestError, ValidationErr } from "../config/handlers";
import { checkPassword, createAccessToken, createOtp, createRefreshToken, createUser, setAuthCookie } from "../managers/users";
import asyncHandler from "../middlewares/asyncHandler";
import { authMiddleware, admin } from "../middlewares/auth";

const userRouter = Router();

userRouter.get('/', authMiddleware, admin, asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const users = await User.find()
        if (!users) {
            throw new NotFoundError("Users not found")
        }
        return res.status(200).json(CustomResponse.success("OK", { users }))
    } catch (error) {
        next(error)
    }
}));

userRouter.get('/:id', asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { id } = req.params
        const user = await User.findById(id).select('-password')
        if (!user) {
            throw new NotFoundError("User not found")
        }
        return res.status(200).json(CustomResponse.success("OK", { user }))
    } catch (error) {
        next(error)
    }
}));

userRouter.patch('/update-my-password', authMiddleware, asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const userData = req.body;
    const { currentPassword, newPassword } = userData;

    const user = req.user
    if (!user || !(await checkPassword(user, currentPassword as string))) {
        throw new RequestError("Invalid credentials!", 401, ErrorCode.INVALID_CREDENTIALS);
    }
    if (!user.isEmailVerified) {
        throw new RequestError("Verify your email first", 401, ErrorCode.UNVERIFIED_USER);
    }

    // Update user
    await User.updateOne(
        { _id: user._id },
        { $set: { password: newPassword } }
    );
    return res.status(200).json(CustomResponse.success('Password reset successful'))
}));

userRouter.get('/send-email-change-otp', authMiddleware, asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const user = req.user

        if (!user.isEmailVerified) {
            throw new RequestError("Verify your email first", 401, ErrorCode.UNVERIFIED_USER);
        }

        let otp = await createOtp(user);
        return res.status(200).json(CustomResponse.success('Email sent successful', otp))
    } catch (error) {
        next(error)
    }
}));

userRouter.patch('/update-my-email', authMiddleware, asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userData = req.body;
        const { email, otp } = userData;

        const user = req.user
        if (user.isEmailVerified) {
            return res.status(200).json(CustomResponse.success("Email already verified"))
        }

        // Verify otp
        const currentDate = new Date()
        if (user.otp !== otp || currentDate > user.otpExpiry) {
            throw new RequestError("Otp is invalid or expired", 400, ErrorCode.INVALID_OTP)
        }

        // Update user
        const updatedUser = await User.findByIdAndUpdate(
            user._id,
            { $set: { otp: null, otpExpiry: null, email: email, isEmailVerified: true } },
            { new: true, runValidators: true }
        );

        return res.status(200).json(CustomResponse.success('Verification successful', updatedUser))
    } catch (error) {
        next(error)
    }
}));

userRouter.patch('/update-me', authMiddleware, asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        const userData = req.body;

        const updatedUser = await User.findByIdAndUpdate(req.user._id, userData,
            { new: true, runValidators: true }
        );

        return res.status(200).json(CustomResponse.success('User updated successfully', updatedUser))
    } catch (error) {
        next(error)
    }
}));

userRouter.delete('/deactivate-me', authMiddleware, asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    try {
        await User.findByIdAndUpdate(req.user._id, { active: false })
        return res.status(200).json(CustomResponse.success('User deleted successfully'))
    } catch (error) {
        next(error)
    }
}));

export default userRouter;