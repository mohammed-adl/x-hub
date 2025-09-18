import { reqApi } from "../lib/index.js";

export async function handleGetNotifications({ limit, cursor }) {
  return await reqApi(`/notifications?limit=${limit}&cursor=${cursor}`);
}

export async function handleMarkAsViewed(notificationId) {
  return await reqApi(`/notifications/${notificationId}`, {
    method: "POST",
  });
}

export async function handleMarkAsVisited() {
  return await reqApi(`/notifications/visit`, { method: "POST" });
}
