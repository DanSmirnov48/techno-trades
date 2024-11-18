import { INewUser, UserImage } from "@/types";
import axios from "axios";

// ============================================================
// USER
// ============================================================

export async function createUserAccount(user: INewUser) {
    try {
        const account = await axios.post(`/api/users/signup`, user)
        return account
    } catch (error: any) {
        if (error.response) {
            return { error: error.response.data, status: error.response.status };
        } else if (error.request) {
            return { error: 'No response from the server', status: 500 };
        } else {
            return { error: 'An unexpected error occurred', status: 500 };
        }
    }
}

export async function verifyAccount(user: { code: string; }) {
    try {
        const session = await axios.post(`/api/users/verify-account`, user);
        return session;
    } catch (error: any) {
        if (error.response) {
            return { error: error.response.data, status: error.response.status };
        } else if (error.request) {
            return { error: 'No response from the server', status: 500 };
        } else {
            return { error: 'An unexpected error occurred', status: 500 };
        }
    }
}

export async function signInAccount(user: { email: string; password: string }) {
    try {
        const session = await axios.post(`/api/users/login`, user);
        return session;
    } catch (error: any) {
        if (error.response) {
            return { error: error.response.data, status: error.response.status };
        } else if (error.request) {
            return { error: 'No response from the server', status: 500 };
        } else {
            return { error: 'An unexpected error occurred', status: 500 };
        }
    }
}

export async function sendLoginOtp(user: { email: string }) {
    try {
        const session = await axios.post(`/api/users/send-login-otp`, user);
        return session;
    } catch (error: any) {
        if (error.response) {
            return { error: error.response.data, status: error.response.status };
        } else if (error.request) {
            return { error: 'No response from the server', status: 500 };
        } else {
            return { error: 'An unexpected error occurred', status: 500 };
        }
    }
}

export async function logingWithOtp({ otp }: { otp: string }) {
    try {
        const response = await axios.post(`/api/users/login-with-otp`, otp);
        return response;
    } catch (error: any) {
        if (error.response) {
            return { error: error.response.data, status: error.response.status };
        } else if (error.request) {
            return { error: 'No response from the server', status: 500 };
        } else {
            return { error: 'An unexpected error occurred', status: 500 };
        }
    }
}

export async function getUserSession() {
    try {
        const response = await axios.get('/api/users/validate');
        return response;
    } catch (error: any) {
        if (error.response.data === 'Unauthorized' && error.response.status === 401) {
            console.log('Unauthorized')
        }
        return undefined
    }
}

export async function signOutAccount() {
    try {
        const response = await axios.get('/api/users/logout')
        return response
    } catch (error) {
        console.log(error);
    }
}

export async function updateMyAccount(user: { firstName: string; lastName: string; photo?: UserImage }) {
    try {
        const response = await axios.patch(`/api/users/update-me`, user);
        return response;
    } catch (error: any) {
        if (error.response) {
            return { error: error.response.data, status: error.response.status };
        } else if (error.request) {
            return { error: 'No response from the server', status: 500 };
        } else {
            return { error: 'An unexpected error occurred', status: 500 };
        }
    }
}

export async function requestEmailChangeVerificationCode({ email }: { email: string }) {
    try {
        const response = await axios.get(`/api/users/request-email-change-verification-code`, {
            params: { email }
        });
        return response;
    } catch (error: any) {
        if (error.response) {
            return { error: error.response.data, status: error.response.status };
        } else if (error.request) {
            return { error: 'No response from the server', status: 500 };
        } else {
            return { error: 'An unexpected error occurred', status: 500 };
        }
    }
}

export async function requestForgotPasswordVerificationCode(email: { email: string }) {
    try {
        const response = await axios.post(`/api/users/forgot-password`, email);
        return response;
    } catch (error: any) {
        if (error.response) {
            return { error: error.response.data, status: error.response.status };
        } else if (error.request) {
            return { error: 'No response from the server', status: 500 };
        } else {
            return { error: 'An unexpected error occurred', status: 500 };
        }
    }
}

export async function verifyPasswordResetVerificationDoe(code: { code: string }) {
    try {
        const response = await axios.post(`/api/users/verify-password-reset-code`, code);
        return response;
    } catch (error: any) {
        if (error.response) {
            return { error: error.response.data, status: error.response.status };
        } else if (error.request) {
            return { error: 'No response from the server', status: 500 };
        } else {
            return { error: 'An unexpected error occurred', status: 500 };
        }
    }
}

export async function resetForgottenPassword(user: { password: string; confirmPassword: string, email: string, code: string }) {
    try {
        const response = await axios.patch(`/api/users/reset-forgotten-password`, user);
        return response;
    } catch (error: any) {
        if (error.response) {
            return { error: error.response.data, status: error.response.status };
        } else if (error.request) {
            return { error: 'No response from the server', status: 500 };
        } else {
            return { error: 'An unexpected error occurred', status: 500 };
        }
    }
}

export async function updateMyEmail(user: { code: string; newEmail: string }) {
    try {
        const response = await axios.post(`/api/users/update-user-email`, user);
        return response;
    } catch (error: any) {
        if (error.response) {
            return { error: error.response.data, status: error.response.status };
        } else if (error.request) {
            return { error: 'No response from the server', status: 500 };
        } else {
            return { error: 'An unexpected error occurred', status: 500 };
        }
    }
}

export async function updateMyPassword(user: { password: string; passwordConfirm: string; passwordCurrent: string }) {
    try {
        const response = await axios.patch(`/api/users/update-my-password`, user);
        return response;
    } catch (error: any) {
        if (error.response) {
            return { error: error.response.data, status: error.response.status };
        } else if (error.request) {
            return { error: 'No response from the server', status: 500 };
        } else {
            return { error: 'An unexpected error occurred', status: 500 };
        }
    }
}

export async function deactivateMyAccount() {
    try {
        const response = await axios.delete(`/api/users/deactivate-me`);
        console.log(response)
        return response;
    } catch (error: any) {
        if (error.response) {
            return { error: error.response.data, status: error.response.status };
        } else if (error.request) {
            return { error: 'No response from the server', status: 500 };
        } else {
            return { error: 'An unexpected error occurred', status: 500 };
        }
    }
}

export async function getUserById(userId: string) {
    try {
        const response = await axios.get(`/api/users/${userId}`);
        return response;
    } catch (error: any) {
        if (error.response) {
            return { error: error.response.data, status: error.response.status };
        } else if (error.request) {
            return { error: 'No response from the server', status: 500 };
        } else {
            return { error: 'An unexpected error occurred', status: 500 };
        }
    }
}

export async function getAllUsers() {
    try {
        const response = await axios.get(`/api/users`);
        return response;
    } catch (error: any) {
        if (error.response) {
            return { error: error.response.data, status: error.response.status };
        } else if (error.request) {
            return { error: 'No response from the server', status: 500 };
        } else {
            return { error: 'An unexpected error occurred', status: 500 };
        }
    }
}