import { socket } from "./socketServer.js";
import Cookies from "js-cookie";
import { authService } from "../services";

export const initSocketConnection = () => {
  const token = localStorage.getItem("token");
  socket.auth.token = token;
  socket.connect();

  const refreshTokenId = Cookies.get("refreshTokenId");
  socket.emit("registerToken", refreshTokenId);

  socket.on("logoutSession", (tokenId) => {
    if (Cookies.get("refreshTokenId") === tokenId) authService.logout();
  });

  socket.on("logout", () => authService.logout());
};

export const disconnectSocket = () => {
  socket.off("logoutSession");
  socket.off("logout");
  socket.disconnect();
};
