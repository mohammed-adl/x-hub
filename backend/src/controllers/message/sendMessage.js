import asyncHandler from "express-async-handler";
import { prisma, success, fail, messageSelect } from "../../lib/index.js";

export const sendMessage = asyncHandler(async (req, res) => {
  const senderId = req.user.id;
  const partnerId = req.params.id;
  const { content } = req.body;

  const partner = await prisma.user.findUnique({
    where: { id: partnerId },
  });
  if (!partner) return fail(res, "Partner not found", 400);

  const newMessage = await prisma.message.create({
    data: {
      content,
      senderId,
      receiverId: partnerId,
    },
    select: messageSelect,
  });

  return success(res, { message: newMessage }, 201);
});
