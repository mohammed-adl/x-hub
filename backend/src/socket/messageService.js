import { prisma, userSelect } from "../lib/index.js";

export async function handleMessages(io, socket) {
  const sender = await prisma.user.findUnique({
    where: { id: socket.userId },
    select: userSelect,
  });

  socket.on("newUserMessage", (receiverId, message) => {
    io.to(receiverId).emit("newMessage", {
      sender,
      message,
    });
  });
}
