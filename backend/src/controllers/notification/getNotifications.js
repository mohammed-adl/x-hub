import asyncHandler from "express-async-handler";
import { prisma, success } from "../../lib/index.js";
import { notificationSelect } from "../../lib/index.js";

export const getNotifications = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const limit = Number(req.query.limit) || 20;
  const cursor = req.query.cursor;

  const notifications = await prisma.notification.findMany({
    where: { toUserId: userId },
    orderBy: { createdAt: "desc" },
    take: limit,
    ...(cursor > 0 && { cursor: { id: cursor }, skip: 1 }),
    select: notificationSelect,
  });

  if (notifications.length === 0)
    return success(res, {
      notifications: [],
      message: "No notifications found",
    });

  const nextCursor =
    notifications.length === limit
      ? notifications[notifications.length - 1].id
      : null;

  return success(res, { notifications, nextCursor });
});
