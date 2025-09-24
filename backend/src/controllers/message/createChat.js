import asyncHandler from "express-async-handler";
import { prisma, success, fail, userSelect } from "../../lib/index.js";
import { attachFullUrls } from "../../utils/fileUrl.js";

export const createChat = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const partnerUsername = req.body.username;

  const partner = await prisma.user.findUnique({
    where: { username: partnerUsername },
    select: userSelect,
  });

  if (!partner) return fail(res, "Partner not found", 400);

  const existingChat = await prisma.chat.findFirst({
    where: {
      OR: [
        { user1Id: userId, user2Id: partner.id },
        { user1Id: partner.id, user2Id: userId },
      ],
    },
  });

  const partnerWithUrl = attachFullUrls(partner);

  if (existingChat) {
    return success(res, { chat: existingChat, partner: partnerWithUrl });
  }

  const chat = await prisma.chat.create({
    data: {
      user1Id: userId,
      user2Id: partner.id,
    },
  });

  return success(res, { chat, partner: partnerWithUrl });
});
