import { authApi } from './requests';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { INITIAL_USER, useUserContext } from '@/context/AuthContext';
import {
    IUserResponse,
    AuthResponse,
    ErrorResponse,
    LoginData,
    LoginResponse,
    RegisterData,
    RegisterResponse,
    VerifyAccountData,
    EmailData
} from './types';

// React Query Hooks
export const useRegisterUser = () => {
    return useMutation<AuthResponse<RegisterResponse>, AuthResponse<ErrorResponse>, RegisterData>({
        mutationFn: authApi.register,
        onSuccess: (response) => {
            console.log({ response });
        },
        onError: (error) => {
            console.error('Validation error:', error);
        }
    });
};

export const useVerifyAccountUser = () => {
    return useMutation<AuthResponse<IUserResponse>, AuthResponse<ErrorResponse>, VerifyAccountData>({
        mutationFn: authApi.verifyAccount,
        onSuccess: (response) => {
            console.log({ response });
        },
        onError: (error) => {
            console.error('Validation error:', error);
        }
    });
};

export const useResendVerificationEmail = () => {
    return useMutation<AuthResponse<{ otp: string }>, AuthResponse<ErrorResponse>, EmailData>({
        mutationFn: authApi.resendVerificationEmail,
        onSuccess: (response) => {
            console.log({ response });
        },
        onError: (error) => {
            console.error('Validation error:', error);
        }
    });
};

export const useLoginUser = () => {
    const queryClient = useQueryClient();
    const { setUser, setIsAuthenticated, setIsAdmin } = useUserContext();

    return useMutation<AuthResponse<LoginResponse>, AuthResponse<ErrorResponse>, LoginData>({
        mutationFn: authApi.login,
        onSuccess: (response) => {
            if (response.status === 'success' && response.data) {
                const user = response.data.user
                setUser(user);
                setIsAuthenticated(true);
                setIsAdmin(user.role === 'admin');

                // Invalidate and refetch user session
                queryClient.invalidateQueries({ queryKey: ['user-session'] });
            }
        },
        onError: (error) => {
            console.error('Login error:', error);
        }
    });
};

export const useLogoutUser = () => {
    const queryClient = useQueryClient();
    const { setUser, setIsAuthenticated } = useUserContext();

    return useMutation<AuthResponse<null>, AuthResponse<ErrorResponse>>({
        mutationFn: authApi.logout,
        onSuccess: (response) => {
            if (response.status === 'success') {
                setIsAuthenticated(false);
                setUser(INITIAL_USER);
            }
        },
        onError: (error) => {
            console.error('Login error:', error);
        }
    });
};