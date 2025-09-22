import { io } from "../socket/index.js";
import { prisma, notificationSelect, userSelect } from "../lib/index.js";

const socketService = {
  async createNotification(type, fromUserId, toUserId, tweetId = null) {
    return await prisma.notification.create({
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
    await prisma.user.update({
      where: { id: userId },
      data: { hasNotifications: true },
    });

    io.to(userId).emit("newNotification", payload);

    console.log("Emitted newNotification to user:", userId);
  },

  async alertMessage(chatId, receiverId, message) {
    io.to(receiverId).emit("newMessage", {
      chatId,
      message,
    });
  },
};

export default socketService;
