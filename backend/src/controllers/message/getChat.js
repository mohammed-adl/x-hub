import asyncHandler from "express-async-handler";
import { prisma, success, fail, messageSelect } from "../../lib/index.js";

export const getChat = asyncHandler(async (req, res) => {
  const senderId = req.user.id;
  const { partnerId } = req.params;
  const limit = Number(req.query.limit) || 20;
  const cursor = Number(req.query.cursor) || undefined;

  const partner = await prisma.user.findUnique({
    where: { id: partnerId },
  });
  if (!partner) return fail(res, "Receiver not found", 400);

  const chat = await prisma.message.findMany({
    where: {
      OR: [
        { senderId, receiverId: partnerId },
        { senderId: partnerId, receiverId: senderId },
      ],
    },
    take: limit,
    orderBy: { id: "desc" },
    ...(cursor > 0 && { cursor: { id: cursor }, skip: 1 }),
    select: messageSelect,
  });

  const nextCursor = chat.length === limit ? chat[chat.length - 1].id : null;

  return success(res, { chat, nextCursor });
});
