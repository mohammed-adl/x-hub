import asyncHandler from "express-async-handler";
import { success, prisma, userSelect } from "../../lib/index.js";
import { attachFullUrls } from "../../utils/index.js";

export const markMessagesAsVisited = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const user = await prisma.xUser.update({
    where: { id: userId },
    data: { hasUnreadMessages: false },
    select: userSelect,
  });

  const userWithFullUrls = attachFullUrls(user);

  return success(res, { user: userWithFullUrls }, 200);
});
