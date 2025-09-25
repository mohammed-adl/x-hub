import asyncHandler from "express-async-handler";
import { prisma, success, fail, messageSelect } from "../../lib/index.js";
import { socketService } from "../../services/index.js";
import { attachChatUrls } from "../../utils/fileUrl.js";

export const sendMessage = asyncHandler(async (req, res) => {
  const senderId = req.user.id;
  const chatId = req.params.chatId;
  const { content, partnerId: receiverId } = req.body;

  const receiver = await prisma.xUser.findUnique({ where: { id: receiverId } });
  if (!receiver) return fail(res, "Receiver not found", 400);

  const result = await prisma.$transaction(async (prisma) => {
    let chat = await prisma.xChat.findFirst({
      where: {
        id: chatId,
      },
    });

    if (!chat) {
      chat = await prisma.xChat.create({
        data: { user1Id: senderId, user2Id: receiverId },
      });
    }

    await prisma.xChat.update({
      where: { id: chat.id },
      data: { updatedAt: new Date() },
    });

    const message = await prisma.xMessage.create({
      data: {
        content,
        senderId,
        receiverId,
        chatId: chat.id,
      },
      select: messageSelect,
    });

    return { chat, message };
  });

  const messageWithUrls = attachChatUrls([result.message])[0];

  await socketService.alertMessage(result.chat.id, receiverId, messageWithUrls);

  return success(res, { chat: result.chat, message: messageWithUrls }, 201);
});
