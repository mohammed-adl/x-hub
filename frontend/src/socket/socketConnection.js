import { socket } from "./socketServer.js";
import { authService } from "../services";

export const initSocketConnection = () => {
  const token = localStorage.getItem("token");
  socket.auth.token = token;
  socket.connect();

  const refreshTokenId = localStorage.getItem("refreshTokenId");
  socket.emit("registerToken", refreshTokenId);

  socket.on("logoutSession", (tokenId) => {
    if (refreshTokenId === tokenId) authService.logout();
  });

  socket.on("logout", () => authService.logout());
};

export const disconnectSocket = () => {
  socket.off("logoutSession");
  socket.off("logout");
  socket.disconnect();
};
