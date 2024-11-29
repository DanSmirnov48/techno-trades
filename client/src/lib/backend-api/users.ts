import axios from "axios";

// ============================================================
// USER
// ============================================================

export async function updateMyAccount(user: { firstName: string; lastName: string; photo?: string }) {
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