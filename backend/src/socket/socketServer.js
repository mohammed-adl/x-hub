import { Server } from "socket.io";
import { handleConnection } from "./socketHandlers.js";
import { socketAuthMiddleware } from "./socketAuth.js";

const ORIGIN = process.env.ORIGIN || "http://localhost:5173";

export let io = null;

export function setupSocket(server) {
  io = new Server(server, {
    cors: {
      origin: ORIGIN,
      methods: ["GET", "POST"],
      credentials: true,
    },
  });

  io.use(socketAuthMiddleware);

  io.on("connection", (socket) => {
    console.log(`User ${socket.userId} connected to room ${socket.userId}`);
    handleConnection(socket);
  });

  return io;
}
