import { IProduct, ProductModel } from "../models/products";

interface PriceRange {
    min: number;
    max: number;
}

interface FilterProductsParams {
    hideOutOfStock?: boolean;
    prices?: PriceRange[];
    brands?: string[];
    categories?: string[];
    ratings?: number[];
    page?: number;
    pageSize?: number;
}

export const filterProducts = async ({
    hideOutOfStock,
    prices,
    brands,
    categories,
    ratings,
    page = 1,
    pageSize = 10,
}: FilterProductsParams): Promise<{ totalFilteredProducts: number; filteredProducts: IProduct[] }> => {
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
    const filteredProducts = await ProductModel.find(baseQuery)
        .skip((+page - 1) * +pageSize)
        .limit(+pageSize);

    // Execute a separate count query to get the total count of filtered products
    const totalFilteredProducts = await ProductModel.countDocuments(baseQuery);

    return { totalFilteredProducts, filteredProducts };
};