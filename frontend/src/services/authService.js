import { jwtDecode } from "jwt-decode";

import { socket } from "../socket";
import { handleRefreshToken } from "../fetchers";
const isProd = import.meta.env.MODE === "production";

const authService = {
  setTokens(token, refreshToken) {
    localStorage.setItem("token", token);
    localStorage.setItem("refreshToken", refreshToken);
    return { token, refreshToken };
  },

  clearSession() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    socket.disconnect();
  },

  logout() {
    authService.clearSession();
    window.location.href = "/";
  },

  async validateAccessToken() {
    const token = localStorage.getItem("token");
    if (!token) {
      authService.logout();
      return;
    }

    try {
      const decoded = jwtDecode(token);
      const currentTime = new Date().getTime() / 1000;
      if (decoded.exp < currentTime) {
        return true;
      } else {
        return false;
      }
    } catch (err) {
      authService.logout();
    }
  },

  async callRefreshToken() {
    try {
      const body = await handleRefreshToken();
      return body;
    } catch (err) {
      authService.logout();
    }
  },
};

export default authService;
