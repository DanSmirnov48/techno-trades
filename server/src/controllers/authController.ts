import { promisify } from 'util';
import jwt from 'jsonwebtoken'
import User, { UserDocument } from '../models/users'
import { NextFunction, Response, Request } from 'express';
import asyncHandler from '../middlewares/asyncHandler';

// Custom interface to extend the Request interface
interface CustomRequest extends Request {
    user?: UserDocument;
}

const signToken = (id: string) => {
    return jwt.sign({ id }, process.env.JWT_SECRET!, {
        expiresIn: process.env.JWT_EXPIRES_IN
    });
};

const createSendToken = (user: UserDocument, statusCode: number, req: Request, res: Response,) => {
    const token = signToken(user._id.toString());

    const expires = parseInt("14", 10) * 24 * 60 * 60 * 1000;

    // Corrected: Add expires to the current timestamp
    const expirationDate = new Date(Date.now() + expires);

    res.cookie('jwt', token, {
        expires: expirationDate,
        httpOnly: true,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https'
    });

    // Remove password from output
    user.password = undefined as any;

    res.status(statusCode).json({
        status: 'success',
        token,
        data: {
            user
        }
    });
};

export const signup = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const newUser = await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm
    });

    createSendToken(newUser, 201, req, res);
});

export const logIn = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, password } = req.body;

    // 1) Check if email and password exist
    if (!email || !password) {
        return next(new Error('Please provide email and password!'));
    }
    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.correctPassword(password, user.password))) {
        return next(new Error('Incorrect email or password'));
    }
    console.log(user)
    // // 3) If everything ok, send token to client
    createSendToken(user, 200, req, res);
});

export const logout = (req: Request, res: Response) => {
    res.clearCookie("jwt");
    res.status(200).json({ status: 'success' });
    res.end()
};

export const protect = asyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
    // 1) Getting token and check of it's there
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.jwt) {
        token = req.cookies.jwt;
    }

    if (!token) {
        return next(
            new Error('You are not logged in! Please log in to get access.')
        );
    }
    console.log(token)

    // 2) Verification token
    const decoded = await promisify<string, string>(jwt.verify)(token, process.env.JWT_SECRET!);
    console.log('Decoded token:', decoded);
    console.log('token:', token);

    // 3) Check if user still exists
    // @ts-ignore
    const currentUser = await User.findById(decoded.id);
    if (!currentUser) {
        return next(
            new Error('The user belonging to this token does no longer exist.')
        );
    }

    // // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
});

export const restrictTo = (...roles: Array<UserDocument['role']>) => {
    return (req: CustomRequest, res: Response, next: NextFunction) => {
        // Ensure req.user and req.user.role are defined
        if (!req.user || !req.user.role) {
            return next(
                new Error('User information is missing. You do not have permission to perform this action.')
            );
        }

        // roles ['admin']. role='user'
        if (!roles.includes(req.user.role)) {
            return next(
                new Error('You do not have permission to perform this action')
            );
        }
        next();
    };
};