import asyncHandler from "express-async-handler";
import {
  prisma,
  tweetSelect,
  notificationSelect,
  success,
  fail,
} from "../../lib/index.js";
import { generateFlakeId } from "../../utils/index.js";
import { socketService } from "../../services/index.js";

export const toggleRetweet = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const tweetId = req.params.id;

  const originalTweet = await prisma.xTweet.findUnique({
    where: { id: tweetId },
    select: { authorId: true },
  });

  if (!originalTweet) return fail("Tweet not found", 404);

  const existingRetweet = await prisma.xTweet.findFirst({
    where: {
      originalTweetId: tweetId,
      authorId: userId,
    },
  });

  if (existingRetweet) {
    await prisma.xTweet.delete({
      where: { id: existingRetweet.id },
    });

    return success(res, { isRetweeted: false });
  }

  let retweet;

  await prisma.$transaction(async (tx) => {
    retweet = await tx.tweet.create({
      data: {
        id: generateFlakeId(),
        originalTweetId: tweetId,
        authorId: userId,
      },
      select: {
        tweetSelect,
      },
    });

    if (originalTweet.authorId !== userId) {
      const notificationExists = await tx.xNotification.findUnique({
        where: {
          fromUserId_tweetId_type: {
            fromUserId: userId,
            tweetId,
            type: "RETWEET",
          },
        },
      });

      if (!notificationExists) {
        const notificationCreated = await socketService.createNotification(
          "RETWEET",
          userId,
          originalTweet.authorId,
          tweetId
        );

        const notification = await tx.xNotification.findUnique({
          where: { id: notificationCreated.id },
          select: notificationSelect,
        });

        socketService.notifyUser(originalTweet.authorId, notification);
      }
    }
  });

  return success(res, { isRetweeted: true, retweet });
});
