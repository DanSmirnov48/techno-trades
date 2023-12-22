import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "./queryKeys";
import { INewUser, IUser, UserImage } from "@/types";
import { createUserAccount, deactivateMyAccount, getUserById, signInAccount, signOutAccount, updateMyAccount, updateMyPassword, validateUserByJwt } from "../backend-api";

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