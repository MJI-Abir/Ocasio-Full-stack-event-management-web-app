import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  login as apiLogin,
  register as apiRegister,
  logout as apiLogout,
  isAuthenticated,
} from "@/services/auth";
import { LoginRequest, RegisterRequest } from "@/types/auth";
import { AxiosError } from "axios";

export default function useAuth() {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [authenticated, setAuthenticated] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    setAuthenticated(isAuthenticated());
  }, []);

  const login = async (data: LoginRequest) => {
    setLoading(true);
    setError(null);
    try {
      await apiLogin(data);
      setAuthenticated(true);
      router.push("/");
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(
        axiosError.response?.data?.message ??
          "Login failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  const register = async (data: RegisterRequest) => {
    setLoading(true);
    setError(null);
    try {
      await apiRegister(data);
      setAuthenticated(true);
      router.push("/");
    } catch (err: unknown) {
      const axiosError = err as AxiosError<{ message?: string }>;
      setError(
        axiosError.response?.data?.message ??
          "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    apiLogout();
    setAuthenticated(false);
    router.push("/login");
  };

  return {
    login,
    register,
    logout,
    loading,
    error,
    authenticated,
  };
}
