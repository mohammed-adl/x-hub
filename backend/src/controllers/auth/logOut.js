import asyncHandler from "express-async-handler";
import { io } from "../../socket/index.js";
import { success, fail } from "../../lib/index.js";
import { authService } from "../../services/index.js";

const isProd = process.env.NODE_ENV === "production";

export const logOut = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const refreshToken = req.body.refreshToken;
  if (!refreshToken) fail("Refresh token not found", 401);

  await authService.logOut(userId, refreshToken);

  res.status(204).end();
});

export const logOutSession = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const tokenId = req.params.id;

  const sessions = await authService.logOutSession(userId, tokenId);

  success(res, { sessions });
});

export const logOutAllSessions = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  await authService.logOutAllSessions(userId);

  io.to(userId).emit("logout");

  res.status(204).end();
});
