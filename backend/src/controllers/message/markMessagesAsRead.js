import asyncHandler from "express-async-handler";
import { prisma } from "../../lib/index.js";

export const markMessagesAsRead = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const chatId = req.params.chatId;

  await prisma.xMessage.updateMany({
    where: {
      chatId: chatId,
      receiverId: userId,
      isRead: false,
    },
    data: {
      isRead: true,
    },
  });

  return res.status(204).end();
});
