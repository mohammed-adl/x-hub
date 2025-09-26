import asyncHandler from "express-async-handler";
import { prisma, success, messageSelect } from "../../lib/index.js";
import { attachChatUrls } from "../../utils/fileUrl.js";

export const getChat = asyncHandler(async (req, res) => {
  const chatId = req.params.chatId;
  const limit = Number(req.query.limit) || 20;
  const cursor = Number(req.query.cursor || 0);

  const chat = await prisma.xChat.findFirst({
    where: { id: chatId },
    include: {
      messages: {
        take: limit,
        orderBy: { createdAt: "desc" },
        ...(cursor && { cursor: { id: cursor }, skip: 1 }),
        select: messageSelect,
      },
    },
  });

  if (!chat) return success(res, { messages: [], nextCursor: null });

  const messagesWithUrls = attachChatUrls(chat.messages);

  const nextCursor =
    messagesWithUrls.length === limit
      ? messagesWithUrls[messagesWithUrls.length - 1].id
      : null;

  console.log(messagesWithUrls, nextCursor);

  return success(res, { messages: messagesWithUrls, nextCursor });
});
