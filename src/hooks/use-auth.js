import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import api from "@/lib/api";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export function useAuth() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const loginMutation = useMutation({
    mutationFn: async (credentials) => {
      try {
        const response = await api.post("/users/login", credentials);

        if (response.data.token) {
          Cookies.set("authData", JSON.stringify(response.data), {
            expires: 1,
          });
          Cookies.set("token", response.data.token, { expires: 1 });
          return response.data;
        }

        throw new Error("Token not found in response");
      } catch (error) {
        throw error.response?.data?.message || "Login failed";
      }
    },
    onSuccess: (data) => {
      queryClient.setQueryData(["user"], data.data);
      navigate("/dashboard");
    },
  });

  const logout = () => {
    Cookies.remove("token");
    Cookies.remove("authData");
    queryClient.clear();
    navigate("/login");
  };

  const getCurrentUser = () => {
    const authDataString = Cookies.get("authData");
    if (authDataString) {
      try {
        const authData = JSON.parse(authDataString);
        return authData.data;
      } catch {
        logout();
        return null;
      }
    }
    return null;
  };

  const getToken = () => {
    return Cookies.get("token");
  };

  const isTokenValid = () => {
    const token = getToken();
    if (token) {
      try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        return decodedToken.exp > currentTime;
      } catch {
        return false;
      }
    }
    return false;
  };

  return {
    login: loginMutation.mutate,
    isLoggingIn: loginMutation.isPending,
    loginError: loginMutation.error,
    logout,
    getCurrentUser,
    getToken,
    isTokenValid,
    isAuthenticated: isTokenValid(),
  };
}
