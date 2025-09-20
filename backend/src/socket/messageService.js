import { prisma } from "../lib/index.js";

export function handleMessages(io, socket) {
  socket.on("typing", ({ receiverId, chatId }) => {
    socket.to(receiverId).emit("typing", { chatId });
  });

  socket.on("stopTyping", ({ receiverId, chatId }) => {
    socket.to(receiverId).emit("stopTyping", { chatId });
  });
}
