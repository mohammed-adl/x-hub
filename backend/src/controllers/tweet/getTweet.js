import asyncHandler from "express-async-handler";
import { prisma, tweetSelect, success, fail } from "../../lib/index.js";
import { getFileUrl, getFileUrlFromMulter } from "../../utils/index.js";

export const getTweet = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const tweetId = req.params.id;

  const tweet = await prisma.xTweet.findUnique({
    where: { id: tweetId },
    select: {
      likes: { where: { userId }, select: { id: true } },
      ...tweetSelect,
    },
  });

  if (!tweet) return fail("Tweet not found", 404);

  const userRetweet = await prisma.xTweet.findFirst({
    where: {
      authorId: userId,
      originalTweetId: tweetId,
    },
    select: { id: true },
  });

  const formatted = {
    ...tweet,
    isLiked: tweet.likes.length > 0,
    isRetweeted: !!userRetweet,
    user: {
      ...tweet.user,
      profilePicture: tweet.user?.profilePicture
        ? getFileUrl(tweet.user.profilePicture)
        : null,
      coverImage: tweet.user?.coverImage
        ? getFileUrl(tweet.user.coverImage)
        : null,
    },
    tweetMedia: tweet.tweetMedia?.map((m) => ({
      ...m,
      path: getFileUrl(m.path),
    })),
  };

  delete formatted.likes;
  delete tweet.likes;

  success(res, { tweet: formatted });
});
