import asyncHandler from "express-async-handler";
import { prisma, userSelect, success } from "../../lib/index.js";
import { attachFullUrls } from "../../utils/index.js";

async function findExactUsername(query) {
  return await prisma.xUser.findFirst({
    where: { username: { equals: query, mode: "insensitive" } },
    select: userSelect,
  });
}

async function findPublicExactName(query, excludeIds = []) {
  return await prisma.xUser.findMany({
    where: {
      name: { equals: query, mode: "insensitive" },
      NOT: { id: { in: excludeIds } },
    },
    select: userSelect,
    take: 3,
  });
}

async function findExactNameInNetwork(query, userId, excludeIds = []) {
  return await prisma.xUser.findMany({
    where: {
      name: { equals: query, mode: "insensitive" },
      OR: [
        { followers: { some: { id: userId } } },
        { following: { some: { id: userId } } },
      ],
      NOT: { id: { in: excludeIds } },
    },
    select: userSelect,
    take: 10,
  });
}

async function findSimilarNames(queryParts, userId, excludeIds = []) {
  return await prisma.xUser.findMany({
    where: {
      AND: [
        {
          OR: [
            { followers: { some: { id: userId } } },
            { following: { some: { id: userId } } },
          ],
        },
        ...queryParts.map((part) => ({
          name: { contains: part, mode: "insensitive" },
        })),
      ],
      NOT: { id: { in: excludeIds } },
    },
    select: userSelect,
    take: 15,
  });
}

export const searchUsers = asyncHandler(async (req, res) => {
  const query = req.query.q;
  const parts = query.trim().split(/\s+/);
  const users = [];

  const usernameMatch = await findExactUsername(query);
  if (usernameMatch) users.push(usernameMatch);

  const publicMatches = await findPublicExactName(
    query,
    users.map((u) => u.id)
  );
  if (publicMatches.length) users.push(...publicMatches);

  const exactNetworkMatches = await findExactNameInNetwork(
    query,
    req.user.id,
    users.map((u) => u.id)
  );
  if (exactNetworkMatches.length) users.push(...exactNetworkMatches);

  const similarMatches = await findSimilarNames(
    parts,
    req.user.id,
    users.map((u) => u.id)
  );
  if (similarMatches.length) users.push(...similarMatches);

  const usersWithFullUrls = attachFullUrls(users);

  success(res, { user: usersWithFullUrls });
});
