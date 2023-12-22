import { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import { utapi } from "../upload";

export const listFiles = asyncHandler(async (req: Request, res: Response) => {
    const files = await utapi.listFiles();
    res.json(files)
})

export const getFileUrl = asyncHandler(async (req: Request, res: Response) => {
    const oneUrl = await utapi.getFileUrls(req.body.fileKey);
    res.json(oneUrl)
})

export const deleteFiles = asyncHandler(async (req: Request, res: Response) => {
    await utapi.deleteFiles(req.body.fileKeys);
    res.status(200).json("Successfully Deleted")
})
