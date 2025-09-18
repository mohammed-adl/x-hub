import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";

import { prisma, success, fail } from "../../lib/index.js";
import { REFRESH_TOKEN_MAX_AGE } from "../../config/constants.js";
import { authService } from "../../services/index.js";

const isProd = process.env.NODE_ENV === "production";

export const refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) fail("Refresh token not found", 401);

  const payload = await authService.verifyRefreshToken(refreshToken);

  const tokens = await prisma.refreshToken.findMany({
    where: {
      userId: payload.id,
      expiresAt: { gt: new Date() },
    },
  });

  let validToken = null;
  for (const token of tokens) {
    const isValid = await bcrypt.compare(refreshToken, token.token);
    if (isValid) {
      validToken = token;
      break;
    }
  }
  if (!validToken) fail("Invalid refresh token", 401);

  await prisma.refreshToken.delete({
    where: { id: validToken.id },
  });

  const user = await prisma.user.findUnique({
    where: { id: payload.id },
  });

  const newAccessToken = authService.generateAccessToken({
    id: payload.id,
  });

  const newRefreshToken = authService.generateRefreshToken({
    id: payload.id,
  });

  const refreshTokenId = await authService.saveRefreshToken(
    payload.id,
    newRefreshToken,
    req
  );

  const path = isProd ? "/api/auth" : "/";

  res.cookie("refreshToken", newRefreshToken, {
    httpOnly: true,
    secure: isProd,
    sameSite: "Strict",
    maxAge: REFRESH_TOKEN_MAX_AGE,
    path,
  });

  success(res, { token: newAccessToken, refreshTokenId });
});
