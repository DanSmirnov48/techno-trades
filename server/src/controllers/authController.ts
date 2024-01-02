import crypto from 'crypto';
import { promisify } from 'util';
import jwt from 'jsonwebtoken'
import User, { UserDocument } from '../models/users'
import { NextFunction, Response, Request } from 'express';
import asyncHandler from '../middlewares/asyncHandler';
import { sendEmail } from '../utils/email';

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
        httpOnly: false,
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
        return res.status(401).json({ error: 'Incorrect email or password' });
    }
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

export const validateJWT = asyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.jwt;

    if (!token) {
        return res.status(401).json({ error: 'No token provided' });
    }

    // Verify and decode the JWT
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as { id: string };

    // Retrieve user from the database using the decoded user ID
    const user = await User.findById(decoded.id)

    if (!user) {
        return res.status(401).json({ error: 'Invalid token - user not found' });
    }

    res.status(200).json({ user });
    res.locals.user = user;
    // next();
});

export const forgotPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // 1) Get user based on POSTed email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
        return next(new Error('There is no user with email address.'));
    }

    // 2) Generate the random reset token
    //@ts-ignore
    const resetToken = user.createPasswordResetToken();
    await user.save({ validateBeforeSave: false });

    // 3) Send it to user's email
    const resetURL = `${req.protocol}://${req.get(
        'host'
    )}/api/users/reset-password/${resetToken}`;

    const message = `Forgot your password? Submit a PATCH request with your new password and passwordConfirm to: ${resetURL}.\nIf you didn't forget your password, please ignore this email!`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Your password reset token (valid for 10 min)',
            message
        });

        res.status(200).json({
            status: 'success',
            message: 'Token sent to email!',
            passwordResetExpires: user.passwordResetExpires
        });
    } catch (err) {
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(new Error('There was an error sending the email. Try again later!'));
    }
})

export const resetPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // 1) Get user based on the token
    const hashedToken = crypto
        .createHash('sha256')
        .update(req.params.token)
        .digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });

    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
        return next(new Error('Token is invalid or has expired'));
    }
    user.password = req.body.password;
    user.passwordConfirm = req.body.passwordConfirm;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();

    // 3) Update changedPasswordAt property for the user
    // 4) Log the user in, send JWT
    createSendToken(user, 200, req, res);
})

export const updatePassword = asyncHandler(async (req: CustomRequest, res: Response, next: NextFunction) => {
    // 1) Get user from collection
    const user = await User.findById(req.user?._id).select('+password');

    if (user) {
        // 2) Check if POSTed current password is correct 
        if (!(await user.correctPassword(req.body.passwordCurrent, user.password))) {
            return res.status(401).json({ error: "Wrong Password" });
        }

        // 3) If so, update password
        user.password = req.body.password;
        user.passwordConfirm = req.body.passwordConfirm;
        await user.save();
        // User.findByIdAndUpdate will NOT work as intended!
    }

    // 4) Log user in, send JWT
    createSendToken(user!, 200, req, res);
})