import asyncHandler from "express-async-handler";
import { prisma, success, fail, messageSelect } from "../../lib/index.js";

export const sendMessage = asyncHandler(async (req, res) => {
  const senderId = req.user.id;
  const { receiverId, content } = req.body;

  const receiver = await prisma.user.findUnique({
    where: { id: receiverId },
  });
  if (!receiver) return fail(res, "Receiver not found", 400);

  const newMessage = await prisma.message.create({
    data: {
      content,
      senderId,
      receiverId,
    },
    select: messageSelect,
  });

  return success(res, { message: newMessage }, 201);
});
