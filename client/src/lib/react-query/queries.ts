import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "./queryKeys";
import { INewUser, IUser } from "@/types";
import { createUserAccount, signInAccount, signOutAccount, validateUserByJwt } from "../backend-api";

// ============================================================
// AUTH QUERIES
// ============================================================
export const useCreateUserAccount = () => {
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user),
        onSuccess: (data) => {},
        onError:(data) => {},
    });
};

export const useSignInAccount = () => {
    return useMutation({
        mutationFn: (user: { email: string; password: string }) =>
            signInAccount(user),
        onSuccess: (data) => {},
        onError:(data) => {},
    });
};

export const useValidateUserByJwt = () => {
    return useMutation({
        mutationFn: (jwt: string) => validateUserByJwt(jwt),
        onSuccess: (data) => {},
        onError:(data) => {},
    });
};

export const useSignOutAccount = () => {
    return useMutation({
        mutationFn: signOutAccount,
    });
};