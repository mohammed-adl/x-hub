import { reqApi } from "../lib";

export async function handleGetAllConvos() {
  return await reqApi("/messages");
}

export async function handleGetChat({ limit, cursor, partnerId }) {
  return await reqApi(`/messages/${partnerId}?limit=${limit}&cursor=${cursor}`);
}

export async function handleSendMessage(partnerId, content) {
  return await reqApi(`/messages/${partnerId}`, {
    method: "POST",
    body: { content },
  });
}
