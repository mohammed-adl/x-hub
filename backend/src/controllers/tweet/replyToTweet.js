import asyncHandler from "express-async-handler";
import { prisma, tweetSelect, success, fail } from "../../lib/index.js";
import { generateFlakeId } from "../../utils/index.js";
import { socketService } from "../../services/index.js";

export const replytoTweet = asyncHandler(async (req, res) => {
  const tweetId = req.params.id;
  const userId = req.user.id;
  const body = req.body;

  const parentTweet = await prisma.tweet.findUnique({
    where: { id: tweetId },
    select: { authorId: true },
  });

  if (!parentTweet) fail("Tweet not found", 404);

  const reply = await prisma.tweet.create({
    data: {
      id: generateFlakeId(),
      content: req.body.content,
      authorId: userId,
      parentTweetId: tweetId,
    },
    select: tweetSelect,
  });

  if (userId !== parentTweet.authorId) {
    const notification = await prisma.notification.create({
      data: {
        type: "REPLY",
        fromUserId: userId,
        toUserId: parentTweet.authorId,
        tweetId,
      },
    });
    socketService.notifyUser(parentTweet.authorId, notification);
  }

  success(res, { reply }, 201);
});
