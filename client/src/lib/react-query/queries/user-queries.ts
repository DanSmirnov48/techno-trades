import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { QUERY_KEYS } from "../queryKeys";
import { INewUser, UserImage } from "@/types";
import {
    updateMyAccount,
    requestEmailChangeVerificationCode,
    updateMyEmail,
    updateMyPassword,
    deactivateMyAccount,
    getUserById,
    getAllUsers,
} from "../../backend-api/users";

// ============================================================
// AUTH QUERIES
// ============================================================
export const useUpdateMyAccount = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (user: {
            firstName: string;
            lastName: string;
            photo?: UserImage;
        }) => updateMyAccount(user),
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

export const useRequestEmailChangeVerificationCode = () => {
    return useMutation({
        mutationFn: ({ email }: { email: string }) =>
            requestEmailChangeVerificationCode({ email }),
    });
};

export const useUpdateMyEmail = () => {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: (user: { code: string; newEmail: string }) =>
            updateMyEmail(user),
        onError: (error) => {
            console.log(error);
        },
        onSuccess: (response) => {
            if (response.status === 200) {
                //@ts-ignore
                const userId = response.data.data.user._id as string;
                if (userId) {
                    queryClient.invalidateQueries({
                        queryKey: [QUERY_KEYS.GET_USER_BY_ID, userId],
                    });
                }
            } else if (response.status === 400) {
                console.log(response);
            }
        },
    });
};

export const useUpdateMyPassword = () => {
    return useMutation({
        mutationFn: (user: {
            password: string;
            passwordConfirm: string;
            passwordCurrent: string;
        }) => updateMyPassword(user),
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

export const useGetAllUsers = () => {
    return useQuery({
        queryKey: [QUERY_KEYS.GET_ALL_USER],
        queryFn: () => getAllUsers(),
    });
};
