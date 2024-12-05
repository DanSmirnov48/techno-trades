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