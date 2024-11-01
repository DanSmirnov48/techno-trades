import * as bcrypt from 'bcrypt';
import { IUser, User } from '../models/users';
import ENV from '../config/config';
import { Types } from 'mongoose';
import * as jwt from "jsonwebtoken";
import { randomStr } from '../config/utils';

const hashPassword = async (password: string) => {
    const hashedPassword: string = await bcrypt.hash(password, 10)
    return hashedPassword
}

const checkPassword = async (user: IUser, password: string) => {
    return await bcrypt.compare(password, user.password)
}

const createUser = async (userData: Record<string, any>, isEmailVerified: boolean = false) => {
    const { password, ...otherUserData } = userData;
    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({ password: hashedPassword, isEmailVerified, ...otherUserData });
    return newUser;
};

const createOtp = async (user: IUser): Promise<number> => {
    const otp: number = Math.floor(100000 + Math.random() * 900000);
    const otpExpiry = new Date(Date.now() + ENV.EMAIL_OTP_EXPIRE_SECONDS * 1000);
    await User.updateOne({ _id: user._id }, { $set: { otp, otpExpiry } });
    return otp
};

// Authentication Tokens
const ALGORITHM = "HS256"
const createAccessToken = (userId: Types.ObjectId) => {
    let payload = { userId, exp: Math.floor(Date.now() / 1000) + (ENV.ACCESS_TOKEN_EXPIRY * 60) }
    return jwt.sign(payload, ENV.JWT_SECRET, { algorithm: ALGORITHM });
}

const createRefreshToken = () => {
    const payload: Record<string, string | number> = { data: randomStr(10), exp: Math.floor(Date.now() / 1000) + (ENV.REFRESH_TOKEN_EXPIRY * 60) }
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

const decodeAuth = async (token: string): Promise<IUser | null> => {
    try {
        const decoded = await verifyAsync(token, ENV.JWT_SECRET) as { userId?: string };
        const userId = decoded?.userId;

        if (!userId) {
            return null;
        }

        const user = await User.findOne({ _id: userId})
        return user;
    } catch (error) {
        return null;
    }
}

export { hashPassword, checkPassword, createAccessToken, createRefreshToken, createUser, createOtp, decodeAuth };
