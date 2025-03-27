import api from "./api";
import { LoginRequest, RegisterRequest, AuthResponse } from "@/types/auth";
import Cookies from "js-cookie";

const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
};

export const login = async (data: LoginRequest): Promise<string> => {
  try {
    const response = await api.post<AuthResponse>(AUTH_ENDPOINTS.LOGIN, data);
    const { token } = response.data;

    // Store token in cookies
    Cookies.set("token", token, { expires: 7 }); // 7 days expiry

    return token;
  } catch (error) {
    console.error("Login error:", error);
    throw error;
  }
};

export const register = async (data: RegisterRequest): Promise<string> => {
  try {
    const response = await api.post<AuthResponse>(
      AUTH_ENDPOINTS.REGISTER,
      data
    );
    const { token } = response.data;

    // Store token in cookies
    Cookies.set("token", token, { expires: 7 }); // 7 days expiry

    return token;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const logout = (): void => {
  Cookies.remove("token");
};

export const isAuthenticated = (): boolean => {
  return !!Cookies.get("token");
};
