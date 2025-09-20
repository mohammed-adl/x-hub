import asyncHandler from "express-async-handler";
import { prisma, success, fail, messageSelect } from "../../lib/index.js";

export const getChat = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { partnerId } = req.params;
  const limit = Number(req.query.limit) || 20;
  const cursor = req.query.cursor;

  const partner = await prisma.user.findUnique({ where: { id: partnerId } });
  if (!partner) return fail(res, "Receiver not found", 400);

  const chat = await prisma.chat.findFirst({
    where: {
      OR: [
        { user1Id: userId, user2Id: partnerId },
        { user1Id: partnerId, user2Id: userId },
      ],
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
