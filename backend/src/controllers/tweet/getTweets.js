import asyncHandler from "express-async-handler";
import { prisma, tweetSelect, success, fail } from "../../lib/index.js";
import { getFileUrl } from "../../utils/index.js";

export const getTweets = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const limit = Number(req.query.limit) || 20;
  const page = Number(req.query.page) || 0;
  const username = req.params.username;

  const user = await prisma.xUser.findUnique({
    where: { username },
    select: { id: true },
  });

  if (!user) return fail("User not found", 404);

  const tweets = await prisma.xTweet.findMany({
    where: {
      authorId: user.id,
      parentTweetId: null,
    },
    select: {
      ...tweetSelect,
      likes: { where: { userId }, select: { id: true } },
      retweets: { where: { authorId: userId }, select: { id: true } },
      originalTweet: { select: tweetSelect },
    },
    orderBy: { createdAt: "desc" },
    skip: page * limit,
    take: limit,
  });

  const formatted = tweets.map((tweet) => {
    const source = tweet.originalTweet || tweet;
    return {
      id: tweet.id,
      content: source.content,
      createdAt: tweet.createdAt,
      originalTweetId: tweet.originalTweetId,
      parentTweetId: tweet.parentTweetId,
      isLiked: tweet.likes.length > 0,
      isRetweeted: tweet.retweets.length > 0,
      user: {
        id: source.user.id,
        name: source.user.name,
        username: source.user.username,
        profilePicture: source.user.profilePicture
          ? getFileUrl(source.user.profilePicture)
          : null,
        coverImage: source.user.coverImage
          ? getFileUrl(source.user.coverImage)
          : null,
      },
      tweetMedia:
        source.tweetMedia?.map((media) => ({
          ...media,
          path: getFileUrl(media.path),
        })) || [],
      _count: {
        likes: source._count.likes,
        retweets: source._count.retweets,
        replies: source._count.replies,
      },
    };
  });

  const nextPage = tweets.length === limit ? page + 1 : null;

  success(res, { tweets: formatted, nextPage });
});
