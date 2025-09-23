import asyncHandler from "express-async-handler";

import { authService, socketService } from "../../services/index.js";
import { success, fail, prisma } from "../../lib/index.js";
import { attachFullUrls } from "../../utils/index.js";

const XAccountId = process.env.X_ACCOUNT_ID;
const isProd = process.env.NODE_ENV === "production";
const path = isProd ? "/api/auth" : "/";

export const logIn = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await authService.logIn(email, password);

  if (!user) return fail("Invalid credentials", 401);

  if (!user.sentWelcome) {
    socketService.createNotification("WELCOME", XAccountId, user.id);
    await prisma.user.update({
      where: { id: user.id },
      data: { sentWelcome: true, hasNotifications: true },
    });
  }

  const accessToken = authService.generateAccessToken({
    id: user.id,
  });

  const refreshToken = authService.generateRefreshToken({
    id: user.id,
  });

  await authService.saveRefreshToken(user.id, refreshToken, req);

  const userWithUrls = attachFullUrls(user);

  console.log("login", refreshTokenId);

  success(res, {
    token: accessToken,
    refreshToken,
    user: userWithUrls,
  });
});
