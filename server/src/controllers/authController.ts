import crypto from 'crypto';
import { promisify } from 'util';
import jwt, { Secret, VerifyOptions } from 'jsonwebtoken'
import { User, IUser } from '../models/users'
import { NextFunction, Response, Request } from 'express';
import asyncHandler from '../middlewares/asyncHandler';
import { sendEmailChangeVerificationMail, sendEmailVerificationMail, sendForgotPasswordVerificationMail, sendMagicSignInLinkMail } from '../utils/email';

// Custom interface to extend the Request interface
// interface Request extends Request {
//     user?: IUser;
// }

interface DecodedToken {
    id: string;
    iat: number;
    exp: number;
}

const isTokenValid = (decodedToken: { exp?: number, iat?: number }): boolean => {
    // Check if the expiration time is present and in the future
    if (!decodedToken.exp || Date.now() >= decodedToken.exp * 1000) {
        return false;
    }

    // Check if the token was issued in the future (clock skew)
    if (decodedToken.iat && decodedToken.iat * 1000 > Date.now()) {
        return false;
    }
    // The token is considered valid
    return true;
};

const signToken = (id: string, secret: string, expiresIn: string | number) => {
    if (!secret) {
        throw new Error('JWT secret is missing.');
    }

    return jwt.sign({ id }, secret, {
        expiresIn
    });
};

const verifyAsync = promisify<string, Secret, VerifyOptions, DecodedToken>(jwt.verify);

const verifyToken = async (token: string, secret: Secret): Promise<DecodedToken> => {
    return await verifyAsync(token, secret, {});
}

const isTokenAboutToExpire = (decodedToken: DecodedToken, thresholdMillis: number = 7200000): boolean => {
    const expirationDate = new Date(decodedToken.exp * 1000);
    const currentTime = new Date();
    const timeUntilExpiration = expirationDate.getTime() - currentTime.getTime();
    return timeUntilExpiration < thresholdMillis;
}

const createSendToken = (user: IUser, statusCode: number, req: Request, res: Response, includeRefreshToken: boolean = true) => {
    // Create Access Token
    const accessToken = signToken(user._id.toString(), process.env.JWT_SECRET!, process.env.JWT_EXPIRES_IN!);

    // Set expiration for access token (24 hours)
    const accessExpires = 24 * 60 * 60 * 1000; // 24 hours
    const accessExpirationDate = new Date(Date.now() + accessExpires);

    // Set cookies for access token
    res.cookie('accessToken', accessToken, {
        expires: accessExpirationDate,
        httpOnly: false,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
        sameSite: 'strict',
    });

    // Optionally, create and set a new refresh token
    if (includeRefreshToken) {
        // Create Refresh Token
        const refreshToken = signToken(user._id.toString(), process.env.REFRESH_TOKEN_SECRET!, process.env.REFRESH_TOKEN_EXPIRES_IN!);

        // Set expiration for refresh token (14 days)
        const refreshExpires = 14 * 24 * 60 * 60 * 1000; // 14 days
        const refreshExpirationDate = new Date(Date.now() + refreshExpires);

        // Set cookies for refresh token
        res.cookie('refreshToken', refreshToken, {
            expires: refreshExpirationDate,
            httpOnly: true,
            secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
            sameSite: 'strict',
        });
    }

    // Set cookie for last sign-in time
    const lastSignInTime = new Date();
    res.cookie('lastSignInTime', lastSignInTime.toISOString(), {
        expires: new Date(253402300000000),
        httpOnly: false,
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
        sameSite: 'strict',
    });

    // Remove password from output
    user.password = undefined as any;

    // Send response
    return res.status(statusCode).json({
        status: 'success',
        accessToken,
        data: {
            user
        }
    }).end();
};

const generateRandomCode = (): number => {
    return Math.floor(100000 + Math.random() * 900000);
};

export const signup = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const verificationCode = generateRandomCode()

    await User.create({
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        password: req.body.password,
        passwordConfirm: req.body.passwordConfirm,
        verificationCode: verificationCode,
    });

    await sendEmailVerificationMail({
        to: req.body.email,
        verificationCode: verificationCode.toString()
    });

    return res.status(200).json({ status: 'success' }).end();
});

export const verifyAccount = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { code } = req.body;

    // Find the user with the provided verification code
    const user = await User.findOne({ verificationCode: code });

    if (!user) {
        // If no user is found with the provided code, return an error
        return res.status(400).json({ error: 'Invalid verification code' });
    }

    // Check if the verification code matches the one stored in the user document
    const isCodeValid = user.checkValidationCode(code);

    if (!isCodeValid) {
        // If the codes don't match, return an error
        return res.status(400).json({ error: 'Invalid verification code' });
    }

    // Update the user's verification status to true
    const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { $set: { verified: true }, $unset: { verificationCode: 1 } },
        { new: true, runValidators: true }
    );

    return res.status(200).json({ status: 'success' }).end();
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
    // 3) If everything ok, send token to client
    createSendToken(user!, 200, req, res);
});

export const magicLinkLogIn = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    // 1) Check if email and password exist
    if (!email) {
        return next(new Error('Please provide email!'));
    }
    // 2) Check if user exists && password is correct
    const user = await User.findOne({ email });

    if (!user) {
        return res.status(401).json({ error: 'User not found' });
    }

    // 2) Generate the random reset token
    const magicLink = user.createMagicLogInLink();
    await user.save({ validateBeforeSave: false });

    // 3) Send it to user's email
    const resetURL = `${process.env.CLIENT_URL}/login/${magicLink}`;

    try {
        await sendMagicSignInLinkMail({
            to: req.body.email,
            magicLink: resetURL
        });

        return res.status(200).json({
            status: 'success',
            message: 'Magic Link sent to email!'
        }).end();
    } catch (err) {
        user.magicLogInLink = undefined;
        user.magicLogInLinkExpires = undefined;
        await user.save({ validateBeforeSave: false });

        return next(
            new Error('There was an error sending the email. Try again later!'),
        );
    }
});

export const logInWithMagicLink = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { token } = req.params;

    if (token) {
        // 1) Get user based on the token
        const user = await User.findOne({
            magicLogInLink: token,
            magicLogInLinkExpires: { $gt: Date.now() }
        });

        console.log(user)

        // 2) If token has not expired, and there is user, set the new password
        if (!user) {
            return next(new Error('Token is invalid or has expired'));
        }

        user.magicLogInLink = undefined;
        user.magicLogInLinkExpires = undefined;
        await user.save({ validateBeforeSave: false });

        // 3) Log the user in, send JWT
        createSendToken(user, 200, req, res);
    }
});

export const logout = (req: Request, res: Response) => {
    res.clearCookie("accessToken");
    res.clearCookie("refreshToken");
    res.clearCookie("lastSignInTime");
    res.status(200).json({ status: 'success' });
    res.end()
};

export const protect = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // 1) Getting token and check of it's there
    let token;
    if (
        req.headers.authorization &&
        req.headers.authorization.startsWith('Bearer')
    ) {
        token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies.accessToken) {
        token = req.cookies.accessToken;
    }

    if (!token) {
        return
    }

    // 2) Verification token
    const decodedToken: DecodedToken = await verifyToken(token, process.env.JWT_SECRET!);
    console.log('Decoded token:', decodedToken);

    // 3) Check if user still exists
    const currentUser = await User.findById(decodedToken.id);
    if (!currentUser) {
        return next(
            new Error('The user belonging to this token does no longer exist.')
        );
    }

    // // GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
});

export const restrictTo = (...roles: Array<IUser['role']>) => {
    return (req: Request, res: Response, next: NextFunction) => {
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

export const validate = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { accessToken, refreshToken } = req.cookies;

    if (accessToken && accessToken !== undefined) {
        console.log("accessToken")
        try {
            // Verify and decode the JWT
            const decoded = jwt.verify(accessToken, process.env.JWT_SECRET!) as { id: string };

            // Retrieve user from the database using the decoded user ID
            const user = await User.findById(decoded.id)

            if (!user) {
                return res.status(401).json({ error: 'Invalid token - user not found' });
            }

            res.locals.user = user;
            return res.status(200).json({
                status: 'success',
                accessToken,
                data: {
                    user
                }
            }).end();
        } catch (error) {
            console.error('Access Token Verification Error:', error);
            return res.status(401).json({ error: 'Invalid access token' });
        }
    }

    if (refreshToken) {
        console.log("refreshToken")
        try {
            // Decode the refresh token to get the user ID
            const decodedRefreshToken = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET!) as { id: string };

            // Retrieve the user from the database using the user ID
            const user = await User.findById(decodedRefreshToken.id);

            if (!user) return res.status(401).json({ error: 'Invalid refresh token - user not found' });

            // Use your existing function to generate only a new access token
            createSendToken(user, 200, req, res, false); // Pass false to exclude a new refresh token
        } catch (error) {
            console.error('Refresh Token Verification Error:', error);
            return res.status(401).json({ error: 'Invalid refresh token' });
        }
    }

    if (accessToken == undefined && refreshToken == undefined) {
        return res.status(401).json('Unauthorized');
    }
});

export const refreshAccessToken = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return next(new Error('No refresh token provided.'));
    }

    try {
        // Verify the refresh token
        const decodedRefreshToken: DecodedToken = await verifyToken(refreshToken, process.env.REFRESH_TOKEN_SECRET!);

        // Check if the refresh token is still valid
        if (isTokenValid(decodedRefreshToken)) {
            // Generate a new access token

            const newAccessToken = signToken(decodedRefreshToken.id, process.env.JWT_SECRET!, process.env.JWT_EXPIRES_IN!);

            // Set the new access token in the response header
            res.setHeader('Authorization', `Bearer ${newAccessToken}`);

            // Continue to the next middleware or route
            next();
        } else {
            return next(new Error('Invalid refresh token. Please log in again.'));
        }
    } catch (error) {
        return next(new Error('Invalid refresh token. Please log in again.'));
    }
});

export const validateAccessToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // Extract the access token from the request
        const accessToken = req.headers.authorization?.split(' ')[1];

        if (!accessToken) {
            return res.status(401).json({ error: 'No access token provided.' });
        }

        // Verify the access token
        const decoded: DecodedToken = await verifyToken(accessToken, process.env.JWT_SECRET!);

        // Assume User.findById is a function to retrieve a user by ID
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(401).json({ error: 'Invalid access token - user not found.' });
        }

        // Attach the user to the request or response.locals if needed
        req.user = user;
        res.locals.user = user;

        // Continue to the next middleware or route
        next();
    } catch (error) {
        console.error('Access Token Verification Error:', error);
        return res.status(401).json({ error: 'Invalid access token.' });
    }
};

export const forgotPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email } = req.body;

    // 1) Get user based on POSTed email
    const user = await User.findOne({ email: email });
    if (!user) {
        return next(new Error('There is no user with email address.'));
    }

    if (email) {
        // 2) Generate the random reset token
        const code = user.createPasswordResetVerificationCode();
        await user.save({ validateBeforeSave: false });

        // 3) Send it to user's email
        try {
            await sendForgotPasswordVerificationMail({
                to: email.toString(),
                verificationCode: code
            });

            return res.status(200).json({
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
    }
    res.status(500).end();
})

export const verifyPasswordResetCode = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { code } = req.body;

    // 1) Get user based on POSTed email
    const user = await User.findOne({
        passwordResetToken: code,
        passwordResetExpires: { $gt: Date.now() }
    });

    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
        return res.status(400).json({ error: 'Token is invalid or has expired' });
    }

    // Check if the verification code matches the one stored in the user document
    const isCodeValid = user.checkForgotPasswordVerificationCode(code.toString());

    if (isCodeValid) {
        // If the codes don't match, return an error
        return res.status(200).json({ success: 'Valid Code' });
    }

    res.status(500).end();
})

export const resetPassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { password, confirmPassword, email, code } = req.body;

    // // 1) Get user based on the token
    const user = await User.findOne({
        email: email,
        passwordResetToken: code,
        passwordResetExpires: { $gt: Date.now() }
    });

    // 2) If token has not expired, and there is user, set the new password
    if (!user) {
        return next(new Error('User not found'));
    }

    // 3) Update changedPasswordAt property for the user
    try {
        user.password = password;
        user.passwordConfirm = confirmPassword;
        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;
        await user.save();

        return res.status(200).json({ success: 'Password Reset Success' });
    } catch (err) {
        return next(new Error('There was an error sending the email. Try again later!'));
    }
})

export const updatePassword = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
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

export const generateUserEmailChangeVerificationCode = asyncHandler(async (req: Request, res: Response) => {
    const { email } = req.query;

    // 1) Get user from collection
    const user = await User.findById(req.user?._id);

    if (!user) {
        // If no user is found with the provided code, return an error
        return res.status(400).json({ error: 'User not found' });
    }

    if (email) {
        const code = user.createEmailUpdateVerificationCode();
        const fdf = await user.save({ validateBeforeSave: false });
        console.log({ fdf })

        await sendEmailChangeVerificationMail({
            to: email.toString(),
            verificationCode: code
        });

        return res.status(200).json({
            status: 'success',
            message: 'Code sent to email!',
        }).end();
    }

    res.status(500).end();
})

export const updateUserEmail = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { code, newEmail } = req.body;

    // Find the user with the provided verification code
    const user = await User.findById(req.user?._id);

    if (!user) {
        // If no user is found with the provided code, return an error
        return res.status(400).json({ error: 'User not found' });
    }

    // Check if the verification code matches the one stored in the user document
    const isCodeValid = user.checkUserEmailupdateVerificationCode(code.toString());

    if (!isCodeValid) {
        // If the codes don't match, return an error
        return res.status(400).json({ error: 'Invalid verification code' });
    }

    // Update the user's verification status to true
    const updatedUser = await User.findByIdAndUpdate(
        user._id,
        { $set: { verified: true, email: newEmail }, $unset: { emailUpdateVerificationCode: 1 } },
        { new: true, runValidators: true }
    );

    console.log({ updatedUser })

    return res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    }).end();
});