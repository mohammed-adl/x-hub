import asyncHandler from "express-async-handler";
import { prisma, tweetSelect, success, fail } from "../../lib/index.js";

export const updateTweet = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const tweetId = req.params.id;
  const content = req.body.content;

  const tweet = await prisma.tweet.findUnique({
    where: {
      id: tweetId,
    },
  });

  if (!tweet) return fail("Tweet not found", 404);
  if (tweet.authorId !== userId) return fail("Unauthorized", 403);

  const updatedTweet = await prisma.tweet.update({
    where: { id: tweetId },
    data: { content },
    select: tweetSelect,
  });

  return success(res, { tweet: updatedTweet });
});
