import asyncHandler from "express-async-handler";
import { prisma, followingSelect, success, fail } from "../../lib/index.js";
import { attachFullUrls } from "../../utils/index.js";

export const getFollowing = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const { limit = 20, cursor } = req.query;
  const userId = req.user.id;

  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });

  if (!user) return fail(res, "User not found", 404);

  const following = await prisma.follows.findMany({
    where: { followerId: user.id },
    take: parseInt(limit),
    ...(cursor > 0 && {
      skip: 1,
      cursor: { id: cursor },
    }),
    orderBy: {
      createdAt: "desc",
    },
    select: followingSelect,
  });

  let formatted = following.map((user) => user.following);
  formatted = attachFullUrls(formatted);

  const followingIds = formatted.map((user) => user.id);

  const existingFollows = await prisma.follows.findMany({
    where: {
      followerId: userId,
      followingId: { in: followingIds },
    },
    select: { followingId: true },
  });

  const followingData = formatted.map((user) => ({
    ...user,
    isFollowing: existingFollows.some((f) => f.followingId === user.id),
  }));

  const nextCursor =
    following.length > 0 ? following[following.length - 1].id : null;

  return success(res, { following: followingData, nextCursor });
});
