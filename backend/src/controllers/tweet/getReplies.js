import asyncHandler from "express-async-handler";
import { prisma, tweetSelect, success } from "../../lib/index.js";
import { getFileUrl } from "../../utils/index.js";

export const getReplies = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const limit = Number(req.query.limit) || 20;
  const { cursor } = req.query;
  const tweetId = req.params.id;

  const replies = await prisma.tweet.findMany({
    where: { parentTweetId: tweetId },
    select: {
      ...tweetSelect,
      likes: {
        where: { userId },
        select: { id: true },
      },
    },
    take: limit,
    orderBy: { id: "desc" },
    ...(cursor > 0 && { cursor: { id: cursor }, skip: 1 }),
  });

  if (replies.length === 0) {
    return success(res, { replies: [], message: "You have no replies yet" });
  }

  const retweets = await prisma.tweet.findMany({
    where: {
      authorId: userId,
      originalTweetId: { in: replies.map((r) => r.id) },
    },
    select: { originalTweetId: true },
  });

  const formatted = replies.map((reply) => {
    const isRetweeted = retweets.find((r) => r.originalTweetId === reply.id);

    const formattedReply = {
      ...reply,
      isLiked: reply.likes.length > 0,
      isRetweeted: !!isRetweeted,
      user: {
        ...reply.user,
        profilePicture: reply.user?.profilePicture
          ? getFileUrl(reply.user.profilePicture)
          : null,
        coverImage: reply.user?.coverImage
          ? getFileUrl(reply.user.coverImage)
          : null,
      },
      tweetMedia:
        reply.tweetMedia?.map((media) => ({
          ...media,
          path: getFileUrl(media.path),
        })) || [],
    };

    delete formattedReply.likes;
    return formattedReply;
  });

  const nextCursor =
    replies.length === limit ? replies[replies.length - 1].id : null;

  success(res, { replies: formatted, nextCursor });
});
