import asyncHandler from "express-async-handler";
import { prisma, fail } from "../../lib/index.js";

export const deleteTweet = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const tweetId = req.params.id;

  const tweet = await prisma.tweet.findUnique({
    where: { id: tweetId },
  });

  if (!tweet) fail("Tweet not found", 400);
  if (tweet.authorId !== userId) fail("Unauthorized", 403);

  await prisma.tweet.delete({
    where: {
      id: tweetId,
    },
  });

  res.status(204).end();
});
