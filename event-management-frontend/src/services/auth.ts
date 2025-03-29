import api from "./api";
import {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
  User,
} from "@/types/auth";
import Cookies from "js-cookie";

const AUTH_ENDPOINTS = {
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  CURRENT_USER: "/users/me",
};

// Helper function to fetch current user and save userId to cookie
const fetchAndSaveCurrentUser = async (): Promise<void> => {
  try {
    const response = await api.get<User>(AUTH_ENDPOINTS.CURRENT_USER);
    const user = response.data;

    if (user && user.id) {
      // Store user ID in cookies
      Cookies.set("userId", user.id.toString(), { expires: 7 }); // 7 days expiry
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
};

export const login = async (data: LoginRequest): Promise<string> => {
  try {
    const response = await api.post<AuthResponse>(AUTH_ENDPOINTS.LOGIN, data);
    const { token } = response.data;

    // Store token in cookies
    Cookies.set("token", token, { expires: 7 }); // 7 days expiry

    // After login success, fetch user data to get the ID
    await fetchAndSaveCurrentUser();

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

    // After registration success, fetch user data to get the ID
    await fetchAndSaveCurrentUser();

    return token;
  } catch (error) {
    console.error("Registration error:", error);
    throw error;
  }
};

export const logout = (): void => {
  Cookies.remove("token");
  Cookies.remove("userId");
};

export const isAuthenticated = (): boolean => {
  return !!Cookies.get("token");
};
