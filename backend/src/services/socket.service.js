import { io } from "../socket/index.js";
import { prisma, notificationSelect } from "../lib/index.js";

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
};

export default socketService;
