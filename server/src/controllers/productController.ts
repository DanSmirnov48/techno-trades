import { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import {
    CreateProduct,
    DeleteProductById,
    GetproductByName,
    ProductModel,
    UpdateProductById,
} from "../models/products";
import { ObjectId } from "mongoose";

export const getProducts = asyncHandler(async (req: Request, res: Response) => {
    try {
        const products = await ProductModel.find();
        return res.status(200).json({ products });
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
});

export const getProductById = asyncHandler(
    async (req: Request, res: Response) => {
        const product = await ProductModel.findById(req.params.id);
        if (product) {
            res.send(product);
        } else {
            res.status(404);
            throw new Error("Product not found");
        }
    }
);

export const getProductByName = asyncHandler(
    async (req: Request, res: Response) => {
        const product = await GetproductByName(req.body.name);
        if (product) {
            res.send(product);
        } else {
            res.status(404);
            throw new Error("Product not found");
        }
    }
);

export const createProduct = asyncHandler(
    async (req: Request, res: Response) => {
        try {
            const createdProduct = await CreateProduct({
                user: req.body.userId as ObjectId,
                name: req.body.name as string,
                image: req.body.image as Object,
                brand: req.body.brand as string,
                category: req.body.category as string,
                description: req.body.description as string,
                price: Number(req.body.price),
                countInStock: Number(req.body.countInStock),
            });

            if (!createdProduct) {
                res.status(500).json({ error: "Product creation failed" });
            }
            res
                .status(201)
                .json({ message: "Created Product", data: createdProduct })
                .end();
        } catch (error) {
            console.log("Error while trying to create product", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
);

export const updateProduct = asyncHandler(
    async (req: Request, res: Response) => {
        try {
            const updatedProduct = await UpdateProductById(req.params.id, req.body);

            if (!updatedProduct) {
                res.status(500).json({ error: "Product update failed" });
            }
            res
                .status(201)
                .json({ message: "Product Updated", data: updatedProduct })
                .end();
        } catch (error) {
            console.log("Error while trying to update product", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
);

export const deleteProduct = asyncHandler(
    async (req: Request, res: Response) => {
        try {
            const { id } = req.params;
            const deleteProduct = await DeleteProductById(id);
            return res.json(deleteProduct);
        } catch (error) {
            console.log(error);
            return res.sendStatus(400);
        }
    }
);
