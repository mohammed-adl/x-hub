import asyncHandler from "express-async-handler";
import { prisma, success, fail, messageSelect } from "../../lib/index.js";

import { socketService } from "../../services/index.js";

export const sendMessage = asyncHandler(async (req, res) => {
  const senderId = req.user.id;
  const receiverId = req.params.id;
  const { content } = req.body;

  const receiver = await prisma.user.findUnique({
    where: { id: receiverId },
  });
  if (!receiver) return fail(res, "Receiver not found", 400);

  const message = await prisma.message.create({
    data: {
      content,
      senderId,
      receiverId,
    },
    select: messageSelect,
  });

  await socketService.alertMessage(senderId, receiverId, message);

  return success(res, { message }, 201);
});
