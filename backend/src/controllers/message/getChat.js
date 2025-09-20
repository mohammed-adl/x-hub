import asyncHandler from "express-async-handler";
import { prisma, success, fail } from "../../lib/index.js";

export const getChat = asyncHandler(async (req, res) => {
  const senderId = req.user.id;
  const { receiverId } = req.body;
  const limit = req.query.limit || 20;
  const cursor = req.query.cursor;

  const receiver = await prisma.user.findUnique({
    where: { id: receiverId },
  });
  if (!receiver) return fail(res, "Receiver not found", 400);

  const conversation = await prisma.message.findMany({
    where: {
      OR: [
        { senderId, receiverId },
        { senderId: receiverId, receiverId: senderId },
      ],
    },
    take: limit,
    orderBy: { id: "desc" },
    ...(cursor > 0 && { cursor: { id: cursor }, skip: 1 }),
    select: messageSelect,
  });

  const nextCursor =
    conversation.length === limit
      ? conversation[conversation.length - 1].id
      : null;

  return success(res, { conversation, nextCursor });
});
