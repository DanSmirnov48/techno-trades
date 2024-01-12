import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "./queryKeys";
import { INewProduct, INewUser, IUpdateProduct, IUser, UserImage } from "@/types";
import { createProduct, createUserAccount, deactivateMyAccount, deleteProduct, getFilteredProducts, getPaginatedProducts, getProducts, getProuctById, getProuctBySlug, getUserById, setProductDiscount, signInAccount, signOutAccount, updateMyAccount, updateMyPassword, updateProduct, validateUserByJwt } from "../backend-api";
import { PriceRange } from "@/hooks/store";
import {useProductStore} from '@/hooks/store'

// ============================================================
// AUTH QUERIES
// ============================================================
export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user),
        onSuccess: (data) => { },
        onError: (data) => { },
    });
};

export const useSignInAccount = () => {
    return useMutation({
        mutationFn: (user: { email: string; password: string }) =>
            signInAccount(user),
        onSuccess: (data) => { },
        onError: (data) => { },
    });
};

export const useValidateUserByJwt = () => {
    return useMutation({
        mutationFn: (jwt: string) => validateUserByJwt(jwt),
        onSuccess: (data) => { },
        onError: (data) => { },
    });
};

export const useSignOutAccount = () => {
    return useMutation({
        mutationFn: signOutAccount,
    });
};

export const useUpdateMyAccount = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (user: { firstName: string; lastName: string; photo?: UserImage }) =>
            updateMyAccount(user),
        onError: (error) => { },
        onSuccess: (response) => {
            //@ts-ignore
            const userId = response.data.data.user._id as string;
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
            });
        },
    });
};

export const useUpdateMyPassword = () => {
    return useMutation({
        mutationFn: (user: { password: string; passwordConfirm: string; passwordCurrent: string }) =>
            updateMyPassword(user),
    });
};

export const useDeactivateMyAccount = () => {
    return useMutation({ mutationFn: () => deactivateMyAccount() });
};

export const useGetUserById = (userId: string) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
        queryFn: () => getUserById(userId),
        enabled: !!userId,
    });
};

// ============================================================
// PRODUCT QUERIES
// ============================================================
export const useGetProducts = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_PRODUCTS],
        queryFn: () => getProducts(),
    });
};

export const useGetPaginatedProducts = (page: number, pageSize: number) => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_PRODUCTS, page, pageSize],
        queryFn: () => getPaginatedProducts(page, pageSize),
    });
};

export const useGetFilteredProducts = () => {
    const setFilteredProducts = useProductStore((state) => state.setFilteredProducts);
    return useMutation({
        mutationFn: (
            { prices, brands, categories, ratings }:
                { prices?: PriceRange[], brands?: string[], categories?: string[], ratings?: number[] }
        ) =>
            getFilteredProducts({ prices, brands, categories, ratings }),

        onSuccess: (data) => {
            // const filteredProducts = data.data.products;
            // console.log(filteredProducts)
            setFilteredProducts(data.data.products);
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

export const useDeleteProduct = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (id: any) => deleteProduct(id),
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_PRODUCTS],
            });
        },
    });
};

export const useSetProductDiscount = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (product: { id: string; discountedPrice?: number; isDiscounted: boolean }) => setProductDiscount(product),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_PRODUCTS],
            });
        },
    });
};