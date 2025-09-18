import asyncHandler from "express-async-handler";
import { prisma, sessionSelect, success, fail } from "../../lib/index.js";

export const getSessionsLogs = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const refreshToken = req.cookies?.refreshToken;

  if (!refreshToken) return fail(res, "Refresh token not found", 401);

  const sessions = await prisma.refreshToken.findMany({
    where: {
      userId,
      expiresAt: { gt: new Date() },
    },
    select: sessionSelect,
  });

  if (sessions.length === 0) return fail(res, "No active sessions found", 404);

  const safeSessions = sessions.map(({ token, ...rest }) => rest);

  return success(res, { sessions: safeSessions });
});
