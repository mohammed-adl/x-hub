import asyncHandler from "express-async-handler";
import { prisma, notificationSelect, success, fail } from "../../lib/index.js";
import { socketService } from "../../services/index.js";

export const toggleLike = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const tweetId = req.params.id;

  const tweet = await prisma.tweet.findUnique({
    where: { id: tweetId },
    select: { authorId: true },
  });

  if (!tweet) return fail("Tweet not found", 404);

  const alreadyLiked = await prisma.like.findUnique({
    where: {
      userId_tweetId: {
        userId,
        tweetId,
      },
    },
  });

  if (alreadyLiked) {
    await prisma.like.delete({
      where: {
        userId_tweetId: {
          userId,
          tweetId,
        },
      },
    });

    return success(res, { isLiked: false });
  }

  let notification;

  await prisma.$transaction(async (tx) => {
    await tx.xLike.create({
      data: {
        tweetId,
        userId,
      },
    });

    const notificationExists = await tx.xNotification.findUnique({
      where: {
        tweetId_type: {
          tweetId,
          type: "LIKE",
        },
      },
    });

    const isAuthor = tweet.authorId === userId;

    if (!notificationExists && !isAuthor) {
      notification = await socketService.createNotification(
        "LIKE",
        userId,
        tweet.authorId,
        tweetId
      );

      await tx.xNotification.update({
        where: { id: notification.id },
        data: { isSent: true },
      });
    } else if (notificationExists && !notificationExists.isSent && !isAuthor) {
      notification = await tx.notification.update({
        where: { id: notificationExists.id },
        data: {
          createdAt: new Date(),
          fromUserId: userId,
          isSent: true,
        },
        select: notificationSelect,
      });
    }
  });

  if (notification) {
    socketService.notifyUser(tweet.authorId, notification);
  }

  return success(res, { isLiked: true });
});
