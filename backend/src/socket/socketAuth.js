import { validateBodyToken } from "../middlewares/index.js";

export function socketAuthMiddleware(socket, next) {
  const { token } = socket.handshake.auth;
  if (!token) return next(new Error("Unauthorized"));

  try {
    const userId = validateBodyToken(token);
    if (!userId) return next(new Error("Unauthorized"));
    socket.userId = userId;
    socket.join(userId);
    next();
  } catch (err) {
    next(new Error("Unauthorized"));
  }
}
