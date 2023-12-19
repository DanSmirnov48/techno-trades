import { INewUser } from "@/types";
import axios, { AxiosError, AxiosResponse } from "axios";

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
export async function signOutAccount() {
  try {
    const res = await axios.get('/api/users/logout')
    console.log(res)
    return res
  } catch (error) {
    console.log(error);
  }
}

export async function getCurrentUser() {
  try {
    const { data } = await axios.get('/api/users/me')
    return data
  } catch (error) {
    console.log(error);
  }
}
