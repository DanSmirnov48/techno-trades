import { Request, Response } from 'express';
import User, { getUser } from '../models/users';
import asyncHandler from '../middlewares/asyncHandler';


export const getAllUsers = async (req: Request, res: Response) => {
    try {
        const users = await getUser();
        return res.status(200).json({ data: users });
    } catch (error) {
        console.log(error);
        return res.sendStatus(400)
    }
}

export const getUserById = asyncHandler(async (req: Request, res: Response) => {
    const { id } = req.params
    const user = await User.findById(id).select('-password')
    if (user) {
        res.json(user)
    } else {
        res.status(404)
        throw new Error('User not found')
    }
})
