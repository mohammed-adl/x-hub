import asyncHandler from "express-async-handler";
import { io } from "../../socket/index.js";
import { success, fail } from "../../lib/index.js";
import { authService } from "../../services/index.js";

const isProd = process.env.NODE_ENV === "production";

export const logOut = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const refreshToken = req.cookies.refreshToken;
  if (!refreshToken) fail("Refresh token not found", 401);
  await authService.logOut(userId, refreshToken);

  const path = isProd ? "/api/auth" : "/";

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: isProd,
    sameSite: "Strict",
    path,
  });
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
  const user = await authService.logOutAllSessions(userId);

  io.to(userId).emit("logout");

  res.clearCookie("refreshToken", {
    httpOnly: true,
    secure: isProd,
    sameSite: "Strict",
    path,
  });

  success(res, { tokenVersion: user.tokenVersion });
});
