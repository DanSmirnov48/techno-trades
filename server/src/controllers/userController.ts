import { NextFunction, Request, Response } from 'express';
import { User } from '../models/users';
import asyncHandler from '../middlewares/asyncHandler';

const filterObj = <T extends Record<string, unknown>>
    (obj: T, ...allowedFields: (keyof T)[]): Partial<T> => {
    const newObj: Partial<T> = {};
    Object.keys(obj).forEach((el) => {
        if (allowedFields.includes(el as keyof T)) {
            newObj[el as keyof T] = obj[el] as T[keyof T];
        }
    });
    return newObj;
};

export const getMe = (
    req: Request,
    res: Response,
    next: NextFunction) => {
    req.params.id = req.user._id.toString();
    next();
}

export const getCurentUser = async (req: Request, res: Response) => {
    try {
        const { id } = req.params
        const cookies = req.cookies;
        const user = await User.findById(id)

        return res.status(200).json({
            status: 'success',
            data: {
                user,
                accessToke: cookies.accessToken,
                lastSignIn: cookies.lastSignInTime
            }
        }).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400)
    }
}

export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await User.find()
        return res.status(200).json(users);
    } catch (error) {
        console.log(error);
        return res.sendStatus(400)
    }
}

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const user = await User.findById(id).select('-password')
    if (user) {
        return res.json(user)
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})

export const updateMe = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // 1) Create error if user POSTs password data
    if (req.body.password || req.body.passwordConfirm) {
        return next(new Error('This route is not for password updates. Please use /updateMyPassword.'));
    }

    // 2) Filtered out unwanted fields names that are not allowed to be updated
    const filteredBody = filterObj(req.body, 'firstName', 'lastName', 'photo');

    // 3) Update user document
    const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        status: 'success',
        data: {
            user: updatedUser
        }
    });
})

export const deleteMe = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    await User.findByIdAndUpdate(req.user._id, { active: false })
    res.status(204).json({
        status: 'success',
        data: null
    })
})