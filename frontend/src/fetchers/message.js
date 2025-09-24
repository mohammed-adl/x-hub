import { reqApi } from "../lib";

export async function handleGetAllConvos() {
  return await reqApi("/messages");
}

export async function handleGetChat({ limit, cursor, chatId }) {
  return await reqApi(`/messages/${chatId}?limit=${limit}&cursor=${cursor}`);
}

export async function handleCreateChat(username) {
  return await reqApi("/messages", {
    method: "POST",
    body: { username },
  });
}

export async function handleSendMessage(chatId, partnerId, content) {
  return await reqApi(`/messages/${chatId}`, {
    method: "POST",
    body: { content, partnerId },
  });
}
