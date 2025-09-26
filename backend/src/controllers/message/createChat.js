import asyncHandler from "express-async-handler";
import { prisma, success, fail, userSelect } from "../../lib/index.js";
import { attachFullUrls } from "../../utils/fileUrl.js";

export const createChat = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const partnerUsername = req.body.username;

  const partner = await prisma.xUser.findUnique({
    where: { username: partnerUsername },
    select: userSelect,
  });

  if (!partner) return fail(res, "Partner not found", 400);

  const [user1Id, user2Id] = [userId, partner.id].sort();

  const existingChat = await prisma.xChat.findFirst({
    where: { user1Id, user2Id },
  });

  const partnerWithUrl = attachFullUrls(partner);

  if (existingChat) {
    return success(res, { chat: existingChat, partner: partnerWithUrl });
  }

  const chat = await prisma.xChat.create({
    data: { user1Id, user2Id },
  });

  return success(res, { chat, partner: partnerWithUrl });
});
