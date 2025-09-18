import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

import { socket } from "../socket";
import { handleRefreshToken } from "../fetchers";
const isProd = import.meta.env.MODE === "production";

const authService = {
  setToken(token) {
    localStorage.setItem("token", token);
    return token;
  },

  clearSession() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    Cookies.remove("refreshTokenId");
    socket.disconnect();
  },

  logout() {
    this.clearSession();
    window.location.href = "/";
  },

  async validateAccessToken() {
    const token = localStorage.getItem("token");
    if (!token) {
      this.logout();
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
      this.logout();
    }
  },

  async callRefreshToken() {
    try {
      const data = await handleRefreshToken();
      return data;
    } catch (err) {
      this.logout();
    }
  },

  setTokens(data) {
    const accessToken = data.token;
    const refreshTokenId = data.refreshTokenId;
    localStorage.setItem("token", accessToken);
    Cookies.set("refreshTokenId", refreshTokenId, {
      path: "/",
      sameSite: "Strict",
      secure: isProd,
      expires: 7,
    });
    return { accessToken, refreshTokenId };
  },
};

export default authService;
