import { PipelineStage } from "mongoose";
import { IProduct, Product } from "../models/products";
import { ErrorCode, RequestError } from "../config/handlers";

const getProducts = async (nameFilter: string | null = null) => {
    try {
        const aggregateData: PipelineStage[] = [
            // Add reviewsCount and avgRating
            {
                $addFields: {
                    reviewsCount: { $size: { $ifNull: ['$reviews', []] } },
                    avgRating: {
                        $cond: {
                            if: { $gt: [{ $size: { $ifNull: ['$reviews', []] } }, 0] },
                            then: { $avg: '$reviews.rating' }, else: 0,
                        },
                    },
                },
            },
            // Unwind reviews to be able to lookup user details
            {
                $unwind: {
                    path: '$reviews',
                    preserveNullAndEmptyArrays: true
                }
            },
            // Lookup user details for each review
            {
                $lookup: {
                    from: 'users',
                    localField: 'reviews.user',
                    foreignField: '_id',
                    as: 'reviewUser'
                }
            },
            // Unwind the reviewUser
            {
                $unwind: {
                    path: '$reviewUser',
                    preserveNullAndEmptyArrays: true
                }
            },
            // Add user details to the review
            {
                $addFields: {
                    'reviews.userFirstName': '$reviewUser.firstName',
                    'reviews.userLastName': '$reviewUser.lastName',
                    'reviews.userAvatar': '$reviewUser.avatar'
                }
            },
            // Group back to original structure
            {
                $group: {
                    _id: '$_id',
                    user: { $first: '$user' },
                    name: { $first: '$name' },
                    slug: { $first: '$slug' },
                    description: { $first: '$description' },
                    price: { $first: '$price' },
                    isDiscounted: { $first: '$isDiscounted' },
                    discountedPrice: { $first: '$discountedPrice' },
                    category: { $first: '$category' },
                    brand: { $first: '$brand' },
                    countInStock: { $first: '$countInStock' },
                    image: { $first: '$image' },
                    reviews: { $push: '$reviews' },
                    reviewsCount: { $first: '$reviewsCount' },
                    avgRating: { $first: '$avgRating' },
                    createdAt: { $first: '$createdAt' }
                }
            },
            // Populate the seller
            {
                $lookup: { from: 'users', localField: 'user', foreignField: '_id', as: 'user' },
            },
            {
                $unwind: {
                    path: '$user',
                    preserveNullAndEmptyArrays: true, // Allow products without a seller
                },
            },
            // Sort by createdAt descending
            { $sort: { createdAt: -1 } }
        ];
        if (nameFilter) {
            aggregateData.push({ $match: { name: { $regex: nameFilter, $options: "i" } } })
        }
        const products = await Product.aggregate(aggregateData)
        return products;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

const updateProductDiscount = async (
    productId: string,
    discountData: {
        isDiscounted: boolean;
        discountedPrice?: number;
    }
): Promise<IProduct> => {
    try {
        // Find the product and verify ownership
        const product = await Product.findById(productId);

        if (!product) {
            throw new RequestError("Product not found", 404, ErrorCode.NON_EXISTENT);
        }

        // If discount is being set to true, validate discounted price
        if (discountData.isDiscounted) {
            // Ensure discounted price is provided and lower than original price
            if (!discountData.discountedPrice) {
                throw new RequestError("Discounted price is required when isDiscounted is true", 400, ErrorCode.INVALID_VALUE);
            }

            if (discountData.discountedPrice >= product.price) {
                throw new RequestError("Discounted price must be lower than original price", 400, ErrorCode.INVALID_VALUE);
            }
        }

        // Update the product
        product.isDiscounted = discountData.isDiscounted;

        // If discount is true, set discounted price
        // If discount is false, remove discounted price
        product.discountedPrice = discountData.isDiscounted
            ? discountData.discountedPrice
            : undefined;

        // Save the updated product
        await product.save();

        return product;
    } catch (err) {
        console.error(err);
        throw err;
    }
}

const updateProductStock = async (productId: string, stockChange: number): Promise<IProduct> => {
    try {
        const product = await Product.findById(productId);
        if (!product) {
            throw new RequestError("Product not found", 404, ErrorCode.NON_EXISTENT);
        }

        const newStockCount = product.countInStock + stockChange;
        if (newStockCount < 0) {
            throw new RequestError("Stock cannot be negative", 400, ErrorCode.INVALID_VALUE);
        }

        product.countInStock = newStockCount;
        await product.save();
        return product;
    } catch (err) {
        console.error(err);
        throw err;
    }
};

export { getProducts, updateProductDiscount, updateProductStock }