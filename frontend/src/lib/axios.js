import axios from "axios";
import { ApiError } from "../utils";
import { authService } from "../services";
import { socket, initSocketConnection } from "../socket";

const API_URL =
  import.meta.env.NEXT_PUBLIC_API_URL || "http://localhost:3000/api/v1";

const api = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

export const refreshApi = axios.create({
  withCredentials: true,
  baseURL: API_URL,
});

let refreshing = null;

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    if (error.response?.status === 401 && !config._retry) {
      config._retry = true;

      if (!refreshing) {
        refreshing = (async () => {
          try {
            const body = await authService.callRefreshToken();
            authService.setTokens(body);
            if (socket?.connected) {
              socket.disconnect();
              initSocketConnection();
            }
          } catch (err) {
            authService.logout();
            throw err;
          } finally {
            refreshing = null;
          }
        })();
      }

      try {
        await refreshing;
        const token = localStorage.getItem("token");
        if (token) config.headers["Authorization"] = `Bearer ${token}`;
        return api(config);
      } catch (err) {
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export async function reqApi(url, options = {}) {
  const token = localStorage.getItem("token");

  const isMultipart = options.body instanceof FormData;

  const axiosConfig = {
    url,
    method: options.method || "get",
    headers: {
      ...(isMultipart ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    data: options.body || undefined,
    params: options.params || undefined,
    withCredentials: true,
  };

  try {
    const response = await api(axiosConfig);
    return response.data;
  } catch (err) {
    if (err.response) {
      throw new ApiError(err.response.data.message, err.response.status);
    }
    throw new ApiError("Something went wrong.", 500);
  }
}
