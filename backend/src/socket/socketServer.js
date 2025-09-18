import { Server } from "socket.io";
import { socketAuthMiddleware } from "./socketAuth.js";
// import { registerSocketHandlers } from "./socketHandlers.js";

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

  // io.on("connection", (socket) => {
  //   registerSocketHandlers(socket);
  // });

  return io;
}
