import asyncHandler from "express-async-handler";
import { prisma, success } from "../../lib/index.js";
import { messageSelect } from "../../lib/select.js";

export const getAllConversations = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const chatters = await prisma.message.findMany({
    where: { OR: [{ senderId: userId }, { receiverId: userId }] },
    select: { senderId: true, receiverId: true },
  });

  const partnerIds = [
    ...new Set(
      chatters.map((msg) =>
        msg.senderId === userId ? msg.receiverId : msg.senderId
      )
    ),
  ];

  const conversations = [];
  for (const partnerId of partnerIds) {
    const lastMessage = await prisma.message.findFirst({
      where: {
        OR: [
          { senderId: userId, receiverId: partnerId },
          { senderId: partnerId, receiverId: userId },
        ],
      },
      orderBy: { createdAt: "desc" },
      select: messageSelect,
    });

    conversations.push({
      partnerId,
      lastMessage,
    });
  }

  return success(res, { conversations });
});
