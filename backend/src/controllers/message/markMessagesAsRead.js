import asyncHandler from "express-async-handler";
import { prisma } from "../../lib/index.js";

export const markMessagesAsRead = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const chatId = req.params.chatId;

  const chat = await prisma.xChat.findUnique({
    where: { id: chatId },
  });

  if (!chat) {
    return res.status(404).json({ message: "Chat not found" });
  }

  const isUser1 = chat.user1Id === userId;

  await prisma.xChat.update({
    where: { id: chatId },
    data: {
      [isUser1 ? "user1HasRead" : "user2HasRead"]: true,
    },
  });

  return res.status(204).end();
});
