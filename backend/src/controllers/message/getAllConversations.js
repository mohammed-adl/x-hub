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
      user1: true,
      user2: true,
    },
    orderBy: { updatedAt: "desc" },
  });

  const conversations = chats.map((chat) => {
    const isUser1 = chat.user1Id === userId;
    const partner = isUser1 ? chat.user2 : chat.user1;
    const lastMessage = chat.messages[0] || null;

    return {
      id: chat.id,
      partnerId: partner.id,
      partner: {
        id: partner.id,
        name: partner.name,
        profilePicture: partner.profilePicture,
      },
      lastMessage,
    };
  });

  return success(res, { conversations });
});
