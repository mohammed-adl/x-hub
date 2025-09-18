import { prisma } from "../lib/index.js";

export async function handleRegisterToken(refreshTokenId, socket) {
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

export function registerSocketHandlers(socket) {
  socket.on("registerToken", (tokenId) => handleRegisterToken(tokenId, socket));

  socket.on("disconnect", async () => {
    console.log(`User ${socket.userId} disconnected from socket ${socket.id}`);
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
