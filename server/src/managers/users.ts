import * as bcrypt from 'bcrypt';
import { AUTH_TYPE, IUser, User } from '../models/users';
import ENV from '../config/config';
import { Types } from 'mongoose';
import * as jwt from "jsonwebtoken";
import { randomStr } from '../config/utils';
import { Request, Response } from 'express';
import { OAuth2Client } from 'google-auth-library';

const hashPassword = async (password: string) => {
    const hashedPassword: string = await bcrypt.hash(password, 10)
    return hashedPassword
}

const checkPassword = async (user: IUser, password: string) => {
    return await bcrypt.compare(password, user.password)
}

const createUser = async (userData: Record<string, any>, isEmailVerified: boolean = false, authType: AUTH_TYPE = AUTH_TYPE.PASSWORD) => {
    const { password, ...otherUserData } = userData;
    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({ password: hashedPassword, isEmailVerified, authType, ...otherUserData });
    return newUser;
};

const createOtp = async (user: IUser): Promise<number> => {
    const otp: number = Math.floor(100000 + Math.random() * 900000);
    const otpExpiry = new Date(Date.now() + ENV.EMAIL_OTP_EXPIRE_SECONDS * 1000);

    try {
        await User.updateOne(
            { _id: user._id },
            { $set: { otp, otpExpiry } }
        );
    } catch (error) {
        console.error('Error updating OTP and expiry:', error);
        throw error;
    }
    return otp
};

// Authentication Tokens
const ALGORITHM = "HS256"
const createAccessToken = (userId: Types.ObjectId) => {
    let payload = {
        userId,
        exp: Math.floor(Date.now() / 1000) + (ENV.ACCESS_TOKEN_EXPIRY * 60)
    }
    return jwt.sign(payload, ENV.JWT_SECRET, { algorithm: ALGORITHM });
}

const createRefreshToken = () => {
    const payload: Record<string, string | number> = {
        data: randomStr(10),
        exp: Math.floor(Date.now() / 1000) + (ENV.REFRESH_TOKEN_EXPIRY * 60)
    }
    return jwt.sign(payload, ENV.JWT_SECRET, { algorithm: ALGORITHM });
}

const verifyAsync = (token: string, secret: string) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, secret, {}, (err, payload) => {
            if (err) {
                reject(err);
            } else {
                resolve(payload);
            }
        });
    });
}

const verifyRefreshToken = async (token: string) => {
    try {
        const decoded = await verifyAsync(token, ENV.JWT_SECRET) as any;
        return true
    } catch (error) {
        return false;
    }
}

const decodeAuth = async (token: string): Promise<IUser | null> => {
    try {
        const decoded = await verifyAsync(token, ENV.JWT_SECRET) as { userId?: string };
        const userId = decoded?.userId;

        if (!userId) {
            return null;
        }

        const user = await User.findOne({ _id: userId, "tokens.access": token });
        return user;
    } catch (error) {
        return null;
    }
}

const setAuthCookie = (res: Response, req: Request, cookieType: 'access' | 'refresh', token: string) => {
    const isAccessToken = cookieType === 'access';

    // Determine expiration time and cookie name based on token type
    const cookieName = isAccessToken ? 'accessToken' : 'refreshToken';
    const expiresInMs = isAccessToken
        ? parseInt(process.env.ACCESS_TOKEN_EXPIRY || '86400000')   // Default to 24 hours if not set
        : parseInt(process.env.REFRESH_TOKEN_EXPIRY || '604800000'); // Default to 7 days if not set

    // Calculate expiration date
    const expirationDate = new Date(Date.now() + expiresInMs);

    // Set cookie with appropriate options
    res.cookie(cookieName, token, {
        expires: expirationDate,
        httpOnly: !isAccessToken,   // Access token isn't httpOnly by default
        secure: req.secure || req.headers['x-forwarded-proto'] === 'https',
        sameSite: 'strict',
    });
};

const client = new OAuth2Client(ENV.GOOGLE_CLIENT_ID);

const validateGoogleToken = async (authToken: string): Promise<Record<string, any>> => {
    try {
        const ticket = await client.verifyIdToken({
            idToken: authToken,
            audience: ENV.GOOGLE_CLIENT_ID
        });

        const payload = ticket.getPayload();
        if (!payload || !payload['sub']) {
            return { payload: null, error: 'Invalid Auth Token' };
        }
        return { payload, error: null };
    } catch (error) {
        return { payload: null, error: 'Invalid Auth Token' };
    }
}

export {
    hashPassword,
    checkPassword,
    createAccessToken,
    createRefreshToken,
    createUser,
    createOtp,
    verifyRefreshToken,
    decodeAuth,
    setAuthCookie,
    validateGoogleToken
};
