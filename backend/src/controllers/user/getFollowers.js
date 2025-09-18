import asyncHandler from "express-async-handler";
import { prisma, followerSelect, success, fail } from "../../lib/index.js";
import { attachFullUrls } from "../../utils/index.js";

export const getFollowers = asyncHandler(async (req, res) => {
  const { username } = req.params;
  const { limit = 20, cursor } = req.query;
  const userId = req.user.id;

  const user = await prisma.user.findUnique({
    where: { username },
    select: { id: true },
  });

  if (!user) return fail(res, "User not found", 404);

  const followers = await prisma.follows.findMany({
    where: { followingId: user.id },
    take: parseInt(limit),
    ...(cursor > 0 && {
      skip: 1,
      cursor: { id: cursor },
    }),
    orderBy: {
      createdAt: "desc",
    },
    select: followerSelect,
  });

  let formatted = followers.map((user) => user.follower);
  formatted = attachFullUrls(formatted);

  const followersIds = formatted.map((user) => user.id);

  const existingFollows = await prisma.follows.findMany({
    where: {
      followerId: userId,
      followingId: { in: followersIds },
    },
    select: { followingId: true },
  });

  const followersData = formatted.map((user) => ({
    ...user,
    isFollowing: existingFollows.some((f) => f.followingId === user.id),
  }));

  const nextCursor =
    followers.length > 0 ? followers[followers.length - 1].id : null;

  return success(res, { followers: followersData, nextCursor });
});
