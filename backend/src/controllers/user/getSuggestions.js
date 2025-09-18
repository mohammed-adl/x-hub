import asyncHandler from "express-async-handler";
import { prisma, success, userSelect } from "../../lib/index.js";
import { getRandomItems, attachFullUrls } from "../../utils/index.js";

const SUGGESTION_LIMIT = 3;

async function getFollowingIds(userId) {
  const following = await prisma.follows.findMany({
    where: { followerId: userId },
    select: { followingId: true },
  });
  return following.map((user) => user.followingId);
}

async function getMutualFollowingSuggestions(userId, followingIds) {
  const mutualFollowing = await prisma.follows.groupBy({
    by: ["followingId"],
    where: {
      followerId: { in: followingIds },
      followingId: { notIn: [...followingIds, userId] },
    },
    _count: { followerId: true },
    orderBy: { _count: { followerId: "desc" } },
    take: 10,
  });

  const mutualFollowingIds = mutualFollowing.map((user) => user.followingId);

  if (mutualFollowingIds.length < SUGGESTION_LIMIT) return [];

  const mutualSuggestions = await prisma.user.findMany({
    where: { id: { in: mutualFollowingIds } },
    select: userSelect,
  });

  return attachFullUrls(getRandomItems(mutualSuggestions, SUGGESTION_LIMIT));
}

async function getNewFollowersSuggestions(userId, followingIds) {
  const newFollowers = await prisma.follows.findMany({
    where: {
      followingId: userId,
      followerId: { notIn: [...followingIds, userId] },
    },
    select: { followerId: true },
    orderBy: { createdAt: "desc" },
    take: SUGGESTION_LIMIT,
  });

  const newFollowersIds = newFollowers.map((user) => user.followerId);
  if (newFollowersIds.length < SUGGESTION_LIMIT) return [];

  const users = await prisma.user.findMany({
    where: { id: { in: newFollowersIds } },
    select: userSelect,
  });

  return attachFullUrls(users);
}

async function getPopularUsersSuggestions(userId, followingIds) {
  const popularUsers = await prisma.follows.groupBy({
    by: ["followingId"],
    _count: { followerId: true },
    orderBy: { _count: { followerId: "desc" } },
    take: 10,
  });

  const topUserIds = popularUsers.map((u) => u.followingId);

  const topUsers = await prisma.user.findMany({
    where: {
      AND: [
        { id: { in: topUserIds } },
        { id: { notIn: [...followingIds, userId] } },
      ],
    },
    select: userSelect,
  });

  return attachFullUrls(getRandomItems(topUsers, SUGGESTION_LIMIT));
}

export const getSuggestions = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const followingIds = await getFollowingIds(userId);

  let suggestions = [];

  if (followingIds.length >= SUGGESTION_LIMIT) {
    suggestions = await getMutualFollowingSuggestions(userId, followingIds);
  }

  if (!suggestions || suggestions.length < SUGGESTION_LIMIT) {
    suggestions = await getNewFollowersSuggestions(userId, followingIds);
  }

  if (!suggestions || suggestions.length < SUGGESTION_LIMIT) {
    suggestions = await getPopularUsersSuggestions(userId, followingIds);
  }

  return success(res, { suggestions });
});
