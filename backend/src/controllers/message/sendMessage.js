import asyncHandler from "express-async-handler";
import { prisma, success, fail, messageSelect } from "../../lib/index.js";
import { socketService } from "../../services/index.js";

export const sendMessage = asyncHandler(async (req, res) => {
  const senderId = req.user.id;
  const receiverId = req.params.id;
  const { content } = req.body;

  const receiver = await prisma.user.findUnique({ where: { id: receiverId } });
  if (!receiver) return fail(res, "Receiver not found", 400);

  const result = await prisma.$transaction(async (prisma) => {
    let chat = await prisma.chat.findFirst({
      where: {
        OR: [
          { user1Id: senderId, user2Id: receiverId },
          { user1Id: receiverId, user2Id: senderId },
        ],
      },
    });

    if (!chat) {
      chat = await prisma.chat.create({
        data: { user1Id: senderId, user2Id: receiverId },
      });
    }

    const message = await prisma.message.create({
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

  await socketService.alertMessage(senderId, receiverId, result.message);

  return success(res, { message: result.message }, 201);
});
