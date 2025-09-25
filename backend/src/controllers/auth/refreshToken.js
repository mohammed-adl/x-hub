import asyncHandler from "express-async-handler";
import bcrypt from "bcrypt";

import { prisma, success, fail } from "../../lib/index.js";
import { authService } from "../../services/index.js";

export const refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.body.refreshToken;

  if (!refreshToken) fail("Refresh token not found", 401);

  const payload = await authService.verifyRefreshToken(refreshToken);

  const tokens = await prisma.xRefreshToken.findMany({
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

  await prisma.xRefreshToken.delete({
    where: { id: validToken.id },
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

  success(res, {
    token: newAccessToken,
    refreshToken: newRefreshToken,
    refreshTokenId,
  });
});
