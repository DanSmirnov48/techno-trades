import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../queryKeys";
import { INewProduct, IUpdateProduct } from "@/types";
import { PriceRange } from "@/hooks/store";
import { useProductStore } from "@/hooks/store";
import {
    getProducts,
    getArchivedProducts,
    getPaginatedProducts,
    getFilteredProducts,
    getProuctById,
    getProuctBySlug,
    createProduct,
    updateProduct,
    archiveProduct,
    restoreProduct,
    setProductDiscount,
} from "../../backend-api/products";

// ============================================================
// PRODUCT QUERIES
// ============================================================
export const useGetProducts = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_PRODUCTS],
        queryFn: () => getProducts(),
    });
};

export const useGetArchivedProducts = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_ARCHIVED_PRODUCTS],
        queryFn: () => getArchivedProducts(),
    });
};

export const useGetPaginatedProducts = (page: number, pageSize: number) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_PRODUCTS, page, pageSize],
        queryFn: () => getPaginatedProducts(page, pageSize),
    });
};

export const useGetFilteredProducts = () => {
    const setFilteredProducts = useProductStore(
        (state) => state.setFilteredProducts
    );
    const setTotalProducts = useProductStore((state) => state.setTotalProducts);

    return useMutation({
        mutationFn: ({
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
        }) =>
            getFilteredProducts({
                hideOutOfStock,
                prices,
                brands,
                categories,
                ratings,
                page,
                pageSize,
                sort,
            }),

        onSuccess: (data) => {
            const { totalProducts, products } = data.data;
            setTotalProducts(totalProducts);
            setFilteredProducts(products);
        },
    });
};

export const useGetProductById = (productId?: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_PRODUCT_BY_ID, productId],
        queryFn: () => getProuctById(productId),
        enabled: !!productId,
    });
};

export const useGetProductBySlug = (slug?: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_PRODUCT_BY_SLUG, slug],
        queryFn: () => getProuctBySlug(slug),
        enabled: !!slug,
    });
};

export const useCreateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (product: INewProduct) => createProduct(product),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_PRODUCTS],
            });
        },
    });
};

export const useUpdateProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (product: IUpdateProduct) => updateProduct(product),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_PRODUCTS],
            });
        },
    });
};

export const useArchiveProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: any) => archiveProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_PRODUCTS],
            });
        },
    });
};

export const useRestoreProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (product: { id: string }) => restoreProduct(product),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_ARCHIVED_PRODUCTS],
            });
        },
    });
};

export const useSetProductDiscount = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (product: {
            id: string;
            discountedPrice?: number;
            isDiscounted: boolean;
        }) => setProductDiscount(product),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_PRODUCTS],
            });
        },
    });
};
