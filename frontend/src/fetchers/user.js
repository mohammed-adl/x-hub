import { reqApi } from "../lib/index.js";

export async function handleGetUser(username) {
  return await reqApi(`/users/${username}`);
}

export function handleToggleFollow(username) {
  return reqApi(`/users/${username}/follow`, {
    method: "POST",
  });
}

export async function handleGetTweets({ limit, cursor, username }) {
  return await reqApi(
    `/users/${username}/tweets?limit=${limit}&cursor=${cursor}`
  );
}

export async function handleEditProfile(formData) {
  return await reqApi(`/users`, {
    method: "PUT",
    body: formData,
  });
}

export async function handleGetFollowing({ username, limit, cursor }) {
  return await reqApi(
    `/users/${username}/following?limit=${limit}&cursor=${cursor}`
  );
}

export async function handleGetFollowers({ username, limit, cursor }) {
  return await reqApi(
    `/users/${username}/followers?limit=${limit}&cursor=${cursor}`
  );
}

export async function handleGetSessionsLogs(refreshToken) {
  return await reqApi(`/users/${refreshToken}/sessions`);
}

export async function handleGetSuggestions() {
  return await reqApi(`/users/suggestions`);
}
