import axios from "axios";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const BASE_URL = import.meta.env.VITE_BACKEND_URI;

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const token = Cookies.get("token");

    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000;

      if (decodedToken.exp < currentTime) {
        Cookies.remove("token");
        Cookies.remove("authData");
        window.location.href = "/login";
      } else {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      Cookies.remove("token");
      Cookies.remove("authData");
      window.location.href = "/login";
    }

    return Promise.reject(error);
  }
);

export default api;
