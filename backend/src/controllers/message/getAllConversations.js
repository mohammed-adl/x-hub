import asyncHandler from "express-async-handler";
import { prisma, success } from "../../lib/index.js";
import { messageSelect } from "../../lib/select.js";

export const getAllConversations = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const chats = await prisma.chat.findMany({
    where: {
      OR: [{ user1Id: userId }, { user2Id: userId }],
    },
    include: {
      messages: {
        take: 1,
        orderBy: { createdAt: "desc" },
        select: messageSelect,
      },
    },
  });

  const conversations = chats.map((chat) => {
    const partnerId = chat.user1Id === userId ? chat.user2Id : chat.user1Id;
    const lastMessage = chat.messages[0] || null;

    return { partnerId, lastMessage };
  });

  return success(res, { conversations });
});
