import { Request } from "express";
import { Document } from "mongoose";

interface PaginationResponse<T> {
    items?: T[];
    page: number;
    itemsCount: number;
    totalPages: number;
    itemsPerPage: number;
}

const paginateRecords = async <T extends Document>(req: Request, records: any[]): Promise<PaginationResponse<T>> => {
    // Paginate records
    const page = parseInt(req.query.page as string) || 1; // Default to page 1
    const limit = parseInt(req.query.limit as string) || 100; // Default to 100 items per page

    const skip = (page - 1) * limit;

    // Get total count of items
    const itemsCount = records.length;

    // Get paginated items
    const paginatedItems = records.slice(skip, skip + limit);
    const totalPages = Math.ceil(itemsCount / limit)
    return { items: paginatedItems, page, itemsCount, totalPages, itemsPerPage: limit }
}

export { paginateRecords }