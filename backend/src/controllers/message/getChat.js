import asyncHandler from "express-async-handler";
import { prisma, success, fail, messageSelect } from "../../lib/index.js";

export const getChat = asyncHandler(async (req, res) => {
  const chatId = req.params.chatId;
  const limit = Number(req.query.limit) || 20;
  const cursor = Number(req.query.cursor || 0);

  const chat = await prisma.chat.findFirst({
    where: {
      id: chatId,
    },
    include: {
      messages: {
        take: limit,
        orderBy: { createdAt: "desc" },
        ...(cursor && { cursor: { id: cursor }, skip: 1 }),
        select: messageSelect,
      },
    },
  });

  if (!chat) return success(res, { chat: [], nextCursor: null });

  const messages = chat.messages;
  const nextCursor =
    messages.length === limit ? messages[messages.length - 1].id : null;

  return success(res, { chat: messages, nextCursor });
});
