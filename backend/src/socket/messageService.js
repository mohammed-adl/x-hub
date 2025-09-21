export function handleMessages(socket) {
  socket.on("typing", ({ chatId, partnerId }) => {
    if (!partnerId) return;
    socket.to(partnerId).emit("partnerTyping", { chatId });
  });

  socket.on("stopTyping", ({ chatId, partnerId }) => {
    if (!partnerId) return;
    socket.to(partnerId).emit("partnerStopTyping", { chatId });
  });
}
