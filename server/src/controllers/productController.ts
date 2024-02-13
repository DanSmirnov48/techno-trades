import { Request, Response } from "express";
import asyncHandler from "../middlewares/asyncHandler";
import {
    ArchiveProductById,
    CreateProduct,
    DeleteProductById,
    GetproductByName,
    ProductModel,
    UpdateProductById,
    UpdateProductStockById,
} from "../models/products";
import { ObjectId, Types } from "mongoose";
import { filterAndSortProducts } from "../utils/filterAndSortProducts";
import { IUser } from "../models/users";

interface CustomRequest extends Request {
    user: IUser;
}

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

export const getFilteredProducts = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { hideOutOfStock, prices, brands, categories, ratings, page = 1, pageSize = 10, sort } = req.body;
        console.log({ hideOutOfStock, prices, brands, categories, ratings, page, pageSize, sort });

        const { filteredAndSortedProducts, totalFilteredProducts } = await filterAndSortProducts({
            hideOutOfStock,
            prices,
            brands,
            categories,
            ratings,
            page,
            pageSize,
            sort
        });

        return res.status(200).json({ totalProducts: totalFilteredProducts, products: filteredAndSortedProducts }).end();
    } catch (error) {
        console.error(error);
        return res.status(500).json({ error: 'Internal Server Error' });
    }
});

export const searchProducts = asyncHandler(async (req: Request, res: Response) => {
    const { q } = req.query;

    try {
        const results = await ProductModel.find({ name: { $regex: new RegExp(q as string, 'i') } }).limit(10);
        res.json({ results });
    } catch (error) {
        console.error('Error searching for products:', error);
        res.status(500).json({ error: 'Internal Server Error' });
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
        const product = await ProductModel.findOne({ slug }).populate({
            path: 'reviews.user',
            model: 'User',
        });

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
                isDiscounted: req.body.isDiscounted as boolean,
                discountedPrice: req.body.discountedPrice ? Number(req.body.discountedPrice) : undefined,
            });

            if (!createdProduct) {
                return res.status(500).json({ error: "Product creation failed" });
            }
            return res.status(201)
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
            return res.status(200)
                .json({ message: "Product Updated", data: updatedProduct })
                .end();
        } catch (error) {
            console.log("Error while trying to update product", error);
            res.status(500).json({ error: "Internal server error" });
        }
    }
);

export const deleteProduct = asyncHandler(async (req: Request, res: Response) => {
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

export const archiveProduct = asyncHandler(async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await ArchiveProductById(id);
        return res.status(200).json({ message: "Product Archived" }).end();
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
}
);

export const updateMultipleProducts = asyncHandler(async (req: Request, res: Response) => {
    try {
        const updates = req.body;
        const updatedProducts = await UpdateMultipleProductsStock(updates);

        return res.status(201).json({ message: "Products Updated", data: updatedProducts });
    } catch (error) {
        console.error("Error updating products:", error);
        res.status(500).json({ error: "Internal server error" });
    }
});

export const UpdateMultipleProductsStock = async (updates: { id: string; quantity: number }[]) => {
    const updatedProducts = await Promise.all(
        updates.map(async ({ id, quantity }) => {

            try {
                const product = await ProductModel.findById(id);

                if (!product) {
                    console.error(`Product with ID ${id} not found.`);
                    return null;
                }

                const currentStock = product.countInStock;

                // Check if there is enough stock for the requested quantity
                if (quantity > currentStock) {
                    throw new Error(`Insufficient stock for product: ${id}. Requested quantity: ${quantity}, Current stock: ${currentStock}`);
                }

                // Calculate the new stock after considering the quantity
                const newStock = currentStock - quantity;

                // Update the stock
                return UpdateProductStockById(id, newStock);

            } catch (error: any) {
                throw new Error(error.message);
            }
        })
    );

    return updatedProducts;
};

export const updateProductStock = async (req: Request, res: Response) => {
    const { id, quantity } = req.body;

    try {
        // Get the current stock of the product
        const product = await ProductModel.findById(id);

        if (!product) {
            return res.status(404).json({ error: `Product with ID ${id} not found.` });
        }

        const currentStock = product.countInStock;

        // Calculate the new stock after adding the quantity
        const newStock = currentStock + quantity;

        // Update the stock
        const updatedProduct = await UpdateProductStockById(id, newStock);

        return res.status(200).json({ message: "Stock increased successfully", data: updatedProduct });
    } catch (error) {
        res.status(500).json({ error: "Internal server error" });
        throw new Error(`Error increasing stock for product with ID ${id}`);
    }
};

export const setProductDiscount = asyncHandler(async (req: Request, res: Response) => {
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

            return res.status(200)
                .json({ message: "Product Updated", data: updatedProduct })
                .end();
        } catch (error) {
            console.log("Error while trying to update product", error);
            return res.status(500).json({ error: "Internal server error" });
        }
    }
);

export const createProductReview = asyncHandler(async (req: CustomRequest, res: Response) => {
        const { rating, title, comment } = req.body
        const { id } = req.params
        const user = req.user

        // console.log({rating, title, comment, id, user})

        const product = await ProductModel.findById(id);

        if (product) {
            const alreadyReviewed = product.reviews
                .find(r => r.user.toString() === user._id.toString())

            if (alreadyReviewed) {
                return res.status(400).json({ error: "Product already reviewed" });
            }

            const review = {
                name: user.firstName.concat(" " + user.lastName),
                rating: Number(rating),
                title,
                comment,
                user: user._id
            }

            product.reviews.push(review)
            product.numReviews = product.reviews.length

            product.rating = product.reviews.reduce((acc, curr) =>
                curr.rating + acc, 0) / product.reviews.length

            await product.save()
            return res.status(201).json({ message: 'Review Added' })
        } else {
            res.status(404)
            throw new Error('Product not found')
        }
    }
);