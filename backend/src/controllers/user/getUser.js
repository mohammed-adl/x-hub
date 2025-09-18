import asyncHandler from "express-async-handler";
import { prisma, userSelect, success, fail } from "../../lib/index.js";
import { attachFullUrls } from "../../utils/index.js";

export const getUser = asyncHandler(async (req, res) => {
  const originUserId = req.user.id;
  const { username } = req.params;

  const user = await prisma.user.findUnique({
    where: { username },
    select: userSelect,
  });

  if (!user) return fail(res, "User not found", 404);

  const isFollowing = await prisma.follows.findUnique({
    where: {
      followerId_followingId: {
        followerId: originUserId,
        followingId: user.id,
      },
    },
  });

  const userWithUrls = attachFullUrls(user);

  return success(res, { user: userWithUrls, isFollowing: !!isFollowing });
});
