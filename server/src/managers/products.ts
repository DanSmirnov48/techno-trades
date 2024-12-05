import { PipelineStage } from "mongoose";
import { Product } from "../models/products";

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

export { getProducts }