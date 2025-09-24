import { jwtDecode } from "jwt-decode";

import { socket } from "../socket";
import { handleRefreshToken } from "../fetchers";
const isProd = import.meta.env.MODE === "production";

const authService = {
  setTokens(body) {
    localStorage.setItem("token", body.token);
    localStorage.setItem("refreshToken", body.refreshToken);
    localStorage.setItem("refreshTokenId", body.refreshTokenId);
    return { body };
  },

  clearSession() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("refreshTokenId");
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
