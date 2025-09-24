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
      return decoded.exp < currentTime;
    } catch (err) {
      console.log(err);
    }
  },

  callRefreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem("refreshToken");
      if (!refreshToken) {
        authService.logout();
        return;
      }
      const data = await handleRefreshToken(refreshToken);
      return data;
    } catch (err) {
      authService.logout();
      throw err;
    }
  },
};

export default authService;
