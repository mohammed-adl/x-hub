import { io } from "./index.js";
import { handleMessages } from "./messageService.js";
import { prisma } from "../lib/index.js";

export async function handleConnection(socket) {
  socket.on("registerToken", (tokenId) => registerToken(tokenId, socket));

  handleMessages(socket);

  socket.on("disconnect", async () => {
    console.log(
      `User ${socket.userId} disconnected from room ${socket.socketId}`
    );
    try {
      await prisma.refreshToken.updateMany({
        where: { socketId: socket.id },
        data: { socketId: null },
      });
    } catch (err) {
      console.error("Failed to clean up socket on disconnect:", err.message);
    }
  });
}

async function registerToken(refreshTokenId, socket) {
  if (!refreshTokenId) return;

  try {
    const session = await prisma.refreshToken.findFirst({
      where: {
        id: refreshTokenId,
        expiresAt: { gt: new Date() },
      },
    });

    if (session) {
      await prisma.refreshToken.update({
        where: { id: refreshTokenId },
        data: { socketId: socket.id },
      });
    }
  } catch (err) {
    console.error("Failed to register token:", err.message);
  }
}
