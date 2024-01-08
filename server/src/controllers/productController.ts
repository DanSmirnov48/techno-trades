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
        return res.status(200).json({ size: products.length, products });
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
});

export const getPaginatedProducts = asyncHandler(async (req: Request, res: Response) => {
    try {
      const { page = 1, pageSize = 10 } = req.query;
      console.log(page, pageSize)
  
      const products = await ProductModel.find()
        .skip((+page - 1) * +pageSize)
        .limit(+pageSize);
  
      const totalProducts = await ProductModel.countDocuments();
  
      return res.status(200).json({ totalProducts, products });
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

export const getProductBySlug = asyncHandler(
    async (req: Request, res: Response) => {
        const { slug } = req.params;
        const product = await ProductModel.findOne({ slug });

        if (!product) {
            return res.status(404).json({ error: 'Product by slug not found' });
        }

        return res.status(200).json({ data: product });
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
                .status(200)
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

export const setProductDiscount = asyncHandler(
    async (req: Request, res: Response) => {
        const { isDiscounted, discountedPrice } = req.body;

        try {
            const product = await ProductModel.findById(req.params.id);

            if (!product) {
                return res.status(404).json({ message: 'Product not found' });
            }

            // Update discount-related fields
            if (isDiscounted !== undefined) {
                product.isDiscounted = isDiscounted;

                // If ending the discount, reset the discount-related fields
                if (!isDiscounted) {
                    product.discountedPrice = undefined;
                }
            }

            // Optionally update discountedPrice if provided
            if (discountedPrice !== undefined) {
                // Check if discounted price is less than or equal to normal price
                if (isDiscounted && discountedPrice > product.price) {
                    return res.status(400).json({ message: 'Discounted price cannot exceed normal price' });
                }
                product.discountedPrice = discountedPrice;
            }

            // Save the updated product
            const updatedProduct = await product.save();

            res
                .status(200)
                .json({ message: "Product Updated", data: updatedProduct })
                .end();
        } catch (error) {
            console.log("Error while trying to update product", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
);

