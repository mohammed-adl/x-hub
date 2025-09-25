import { io } from "../socket/index.js";
import { prisma, notificationSelect, userSelect } from "../lib/index.js";

const socketService = {
  async createNotification(type, fromUserId, toUserId, tweetId = null) {
    return await prisma.xNotification.create({
      data: {
        type,
        fromUserId,
        toUserId,
        tweetId,
      },
      select: notificationSelect,
    });
  },

  async notifyUser(userId, payload) {
    io.to(userId).emit("newNotification", payload);

    await prisma.xUser.update({
      where: { id: userId },
      data: { hasNotifications: true },
    });
  },

  async alertMessage(chatId, receiverId, message) {
    io.to(receiverId).emit("newMessage", {
      chatId,
      message,
    });
  },
};

export default socketService;
