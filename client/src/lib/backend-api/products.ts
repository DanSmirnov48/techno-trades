import { PriceRange } from "@/hooks/store";
import { INewProduct, IUpdateProduct, Product } from "@/types";
import axios from "axios";

// ============================================================
// PRODUCTS
// ============================================================

export async function getProducts() {
    try {
        const response = await axios.get(`/api/products`);
        return response;
    } catch (error) {
        console.log(error);
    }
}

export async function getArchivedProducts() {
    try {
        const response = await axios.get(`/api/products/archived-products`);
        return response;
    } catch (error) {
        console.log(error);
    }
}

export async function getPaginatedProducts(page: number, pageSize: number) {
    try {
        const response = await axios.get(`/api/products/pp`, {
            params: { page, pageSize },
        });
        return response;
    } catch (error) {
        console.log(error);
    }
}

export async function getFilteredProducts({
    hideOutOfStock,
    prices,
    brands,
    categories,
    ratings,
    page,
    pageSize,
    sort,
}: {
    hideOutOfStock?: boolean;
    prices?: PriceRange[];
    brands?: string[];
    categories?: string[];
    ratings?: number[];
    page: number;
    pageSize: number;
    sort?: string;
}) {
    try {
        const response = await axios.post(`/api/products/filter`, {
            hideOutOfStock,
            brands,
            categories,
            ratings,
            prices,
            page,
            pageSize,
            sort,
        });
        return response;
    } catch (error) {
        console.error("Error fetching products:", error);
        throw error;
    }
}

export async function getProuctById(productId?: string) {
    try {
        if (productId) {
            const { data } = await axios.get(`/api/products/${productId}/admin`);
            return data as Product;
        } else {
            console.log("no id prodcut Id provided");
        }
    } catch (error) {
        console.log(error);
    }
}

export async function getProuctBySlug(slug?: string) {
    try {
        if (slug) {
            const response = await axios.get(`/api/products/${slug}`);
            return response.data.data as Product;
        } else {
            console.log("no prodcut slug provided");
        }
    } catch (error) {
        console.log(error);
    }
}

export async function createProduct(product: INewProduct) {
    try {
        const { data } = await axios.post(`/api/products`, product);
        return data;
    } catch (error) {
        console.log(error);
    }
}

export async function updateProduct(product: IUpdateProduct) {
    try {
        const data = await axios.put(`/api/products/${product._id}`, product);
        console.log(data);
        return data;
    } catch (error) {
        console.log(error);
    }
}

export async function archiveProduct(id: any) {
    try {
        const { data } = await axios.delete(`/api/products/${id}`);
        return data;
    } catch (error) {
        console.log(error);
    }
}

export async function restoreProduct(product: { id: string }) {
    try {
        const { data } = await axios.patch(
            `/api/products/unarchive-product`,
            product
        );
        return data;
    } catch (error) {
        console.log(error);
    }
}

export async function setProductDiscount(product: {
    id: string;
    discountedPrice?: number;
    isDiscounted: boolean;
}) {
    try {
        const data = await axios.patch(
            `/api/products/${product.id}/update-discount`,
            product
        );
        console.log(data);
        return data;
    } catch (error) {
        console.log(error);
    }
}
