import asyncHandler from "express-async-handler";
import { prisma, tweetSelect, success, fail } from "../../lib/index.js";
import { getFileUrl } from "../../utils/index.js";

export const getTweets = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const limit = Number(req.query.limit) || 20;
  const cursor = req.query.cursor;
  const username = req.params.username;

  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });

  if (!user) return fail("User not found", 404);

  const tweets = await prisma.tweet.findMany({
    where: { authorId: user.id },
    select: {
      ...tweetSelect,
      likes: {
        where: { userId },
        select: { id: true },
      },
      retweets: {
        where: { authorId: userId },
        select: { id: true },
      },
    },
    take: limit,
    orderBy: { id: "desc" },
    ...(cursor > 0 && { cursor: { id: cursor }, skip: 1 }),
  });

  if (tweets.length === 0) return fail("No tweets found");

  const formatted = tweets.map((tweet) => ({
    ...tweet,
    isLiked: tweet.likes.length > 0,
    isRetweeted: tweet.retweets.length > 0,
    user: {
      ...tweet.user,
      profilePicture: tweet.user?.profilePicture
        ? getFileUrl(tweet.user.profilePicture)
        : null,
      coverImage: tweet.user?.coverImage
        ? getFileUrl(tweet.user.coverImage)
        : null,
    },
    tweetMedia:
      tweet.tweetMedia?.map((media) => ({
        ...media,
        path: getFileUrl(media.path),
      })) || [],
  }));

  formatted.forEach((tweet) => {
    delete tweet.likes;
    delete tweet.retweets;
  });

  const nextCursor =
    tweets.length === limit ? tweets[tweets.length - 1].id : null;

  success(res, { tweets: formatted, nextCursor });
});
