import asyncHandler from "express-async-handler";
import { prisma, success, fail } from "../../lib/index.js";
import { socketService } from "../../services/index.js";

export const toggleFollow = asyncHandler(async (req, res, next) => {
  const userId = req.user.id;
  const username = req.params.username;

  const targetUser = await prisma.xUser.findUnique({
    where: { username },
  });
  if (!targetUser) fail("User not found", 404);

  const followingId = targetUser.id;
  if (userId === followingId) throw fail("You can't follow yourself", 400);

  let isFollowing;

  await prisma.$transaction(async (tx) => {
    const existing = await tx.xFollows.findUnique({
      where: { followerId_followingId: { followerId: userId, followingId } },
    });

    if (existing) {
      await tx.xFollows.delete({
        where: { followerId_followingId: { followerId: userId, followingId } },
      });
      isFollowing = false;
    } else {
      await tx.follows.create({
        data: { followerId: userId, followingId },
      });
      isFollowing = true;
    }
  });

  if (isFollowing) {
    const notificationExists = await prisma.xNotification.findFirst({
      where: {
        type: "FOLLOW",
        fromUserId: userId,
        toUserId: followingId,
      },
    });

    if (!notificationExists) {
      const notification = await socketService.createNotification(
        "FOLLOW",
        userId,
        followingId
      );
      socketService.notifyUser(followingId, notification);
    }
  }

  success(res, { isFollowing });
});
