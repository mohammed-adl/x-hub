import asyncHandler from "express-async-handler";
import { prisma, fail } from "../../lib/index.js";

export const markAsViewed = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const notificationId = req.params.id;

  const notification = await prisma.xNotification.findUnique({
    where: { id: notificationId },
    select: { toUserId: true },
  });

  if (!notification) fail("Notification not found", 404);

  if (notification.toUserId !== userId)
    fail("You can't mark this notification as viewed", 403);

  await prisma.xNotification.update({
    where: { id: notificationId },
    data: { isViewed: true },
  });

  return res.status(204).end();
});
