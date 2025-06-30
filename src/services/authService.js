import api from "@/lib/api";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

export const authService = {
  async login(credentials) {
    try {
      const response = await api.post("/users/login", credentials);
      
      if (response.data.token) {
        Cookies.set("token", response.data.token, { expires: 1 }); // 1 day
        return response.data;
      }
      
      throw new Error("Token not found in response");
    } catch (error) {
      throw error.response?.data?.message || "Login failed";
    }
  },
  
  logout() {
    Cookies.remove("token");
  },
  
  getCurrentUser() {
    const token = Cookies.get("token");
    if (token) {
      try {
        return jwtDecode(token);
      } catch (error) {
        this.logout();
        return null;
      }
    }
    return null;
  }
};