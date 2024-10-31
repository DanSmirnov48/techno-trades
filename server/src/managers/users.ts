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

const createUser = async (userData: Record<string,any>, isEmailVerified: boolean = false) => {
    const { password, ...otherUserData } = userData;
    const hashedPassword = await hashPassword(password);
    const newUser = await User.create({ password: hashedPassword, isEmailVerified, ...otherUserData });
    return newUser; 
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

export { hashPassword, checkPassword, createAccessToken, createRefreshToken, createUser };
