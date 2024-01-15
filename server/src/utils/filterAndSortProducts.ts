import { IProduct, ProductModel } from "../models/products";

interface PriceRange {
    min: number;
    max: number;
}

interface FilterAndSortProductsParams {
    hideOutOfStock?: boolean;
    prices?: PriceRange[];
    brands?: string[];
    categories?: string[];
    ratings?: number[];
    page?: number;
    pageSize?: number;
    sort?: string;
}

export const filterAndSortProducts = async ({
    hideOutOfStock,
    prices,
    brands,
    categories,
    ratings,
    page = 1,
    pageSize = 10,
    sort
}: FilterAndSortProductsParams): Promise<{ totalFilteredProducts: number; filteredAndSortedProducts: IProduct[] }> => {
    // Build the base query
    const baseQuery: any = {};

    // Apply hideOutOfStock filter
    if (hideOutOfStock) {
        baseQuery.countInStock = { $gt: 0 };
    }

    // Apply price filter if available
    if (prices && prices.length > 0) {
        baseQuery.price = {
            $gte: prices[0].min,
            $lte: prices[prices.length - 1].max,
        };
    }

    // Apply brand filter if available
    if (brands && brands.length > 0) {
        baseQuery.brand = { $in: brands };
    }

    // Apply category filter if available
    if (categories && categories.length > 0) {
        baseQuery.category = { $in: categories };
    }

    // Apply rating filter if available
    if (ratings && ratings.length > 0) {
        baseQuery.rating = { $gte: Math.min(...ratings) };
    }

    // Execute the query to get filtered products
    const query = ProductModel.find(baseQuery);

    // Apply sorting if provided
    if (sort) {
        switch (sort) {
            case 'brandAsc':
                query.sort({ brand: 1 });
                break;
            case 'brandDesc':
                query.sort({ brand: -1 });
                break;
            case 'priceAsc':
                query.sort({ price: 1 });
                break;
            case 'priceDesc':
                query.sort({ price: -1 });
                break;
            case 'customerRating':
                query.sort({ rating: -1 });
                break;
            case 'deals':
                query.sort({ isDiscounted: -1 });
                break;
            default:
                break;
        }
    }

    // Apply skip and limit for pagination
    const filteredAndSortedProducts = await query
        .skip((+page - 1) * +pageSize)
        .limit(+pageSize);

    // Execute a separate count query to get the total count of filtered products
    const totalFilteredProducts = await ProductModel.countDocuments(baseQuery);

    return { totalFilteredProducts, filteredAndSortedProducts };
};