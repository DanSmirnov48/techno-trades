import { IUser } from '@/types';
import axios, { AxiosError } from 'axios';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { INITIAL_USER, useUserContext } from '@/context/AuthContext';

// Types
type IUserResponse = Omit<IUser, 'password' | 'otp' | 'otpExpiry'>;

interface TokensResponse {
    access: string;
    refresh: string;
}

interface AuthResponse<T> {
    status: 'success' | 'failure';
    message: string;
    code?: string;
    data?: T;
}

interface LoginResponse {
    user: IUserResponse;
    tokens: TokensResponse;
}

interface RegisterResponse {
    user: IUserResponse;
    otp: string;
}

interface ErrorResponse {
    code: string;
    data?: Record<string, string>;
}

// Request types
interface RegisterData {
    firstName: string;
    lastName: string;
    email: string;
    password: string;
}

interface LoginData {
    email: string;
    password: string;
}

// // API client setup
const api = axios.create({
    baseURL: '/api/users',
    withCredentials: true,
});

// Custom error handler
const handleAuthError = (error: unknown) => {
    if (axios.isAxiosError(error)) {
        const err = error as AxiosError<AuthResponse<ErrorResponse>>;
        if (err.response?.data) {
            return err.response.data;
        }
        return { status: 'failure', message: error.message };
    }
    return { status: 'failure', message: 'An unexpected error occurred' };
};

// API functions
const authApi = {
    register: async (data: RegisterData): Promise<AuthResponse<RegisterResponse>> => {
        try {
            const response = await api.post<AuthResponse<RegisterResponse>>('/register', data);
            console.log({ response })
            return response.data;
        } catch (error) {
            return handleAuthError(error) as AuthResponse<RegisterResponse>;
        }
    },
    login: async (data: LoginData): Promise<AuthResponse<LoginResponse>> => {
        try {
            const response = await api.post<AuthResponse<LoginResponse>>('/login', data);
            console.log({ response })
            return response.data;
        } catch (error) {
            return handleAuthError(error) as AuthResponse<LoginResponse>;
        }
    }
};


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