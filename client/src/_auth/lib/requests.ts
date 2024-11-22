import axios, { AxiosError } from 'axios';
import {
    IUserResponse,
    AuthResponse,
    ErrorResponse,
    LoginData,
    LoginResponse,
    RegisterData,
    RegisterResponse,
    VerifyAccountData,
    EmailData,
} from './types';

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
export const authApi = {
    register: async (data: RegisterData): Promise<AuthResponse<RegisterResponse>> => {
        try {
            const response = await api.post<AuthResponse<RegisterResponse>>('/register', data);
            // console.log({ response })
            return response.data;
        } catch (error) {
            return handleAuthError(error) as AuthResponse<RegisterResponse>;
        }
    },
    verifyAccount: async (data: VerifyAccountData): Promise<AuthResponse<IUserResponse>> => {
        try {
            const response = await api.post<AuthResponse<IUserResponse>>('/verify-email', data);
            // console.log({ response })
            return response.data;
        } catch (error) {
            return handleAuthError(error) as AuthResponse<IUserResponse>;
        }
    },
    login: async (data: LoginData): Promise<AuthResponse<LoginResponse>> => {
        try {
            const response = await api.post<AuthResponse<LoginResponse>>('/login', data);
            // console.log({ response })
            return response.data;
        } catch (error) {
            return handleAuthError(error) as AuthResponse<LoginResponse>;
        }
    },
    logout: async (): Promise<AuthResponse<null>> => {
        try {
            const response = await api.get<AuthResponse<null>>('/logout');
            // console.log({ response })
            return response.data;
        } catch (error) {
            return handleAuthError(error) as AuthResponse<null>;
        }
    },
    resendVerificationEmail: async (data: EmailData): Promise<AuthResponse<{ otp: string }>> => {
        try {
            const response = await api.post<AuthResponse<{ otp: string }>>('/resend-verification-email', data);
            // console.log({ response })
            return response.data;
        } catch (error) {
            return handleAuthError(error) as AuthResponse<{ otp: string }>;
        }
    }
};