import { reqApi, refreshApi } from "../lib";

export async function handleSignUp(formData) {
  return await reqApi("/auth/signup", {
    method: "POST",
    body: JSON.stringify(formData),
  });
}

export async function handleLogIn(formData) {
  return await reqApi("/auth/login", {
    method: "POST",
    body: JSON.stringify(formData),
  });
}

export async function handleLogOut(refreshToken) {
  return await reqApi("/auth/logout", {
    method: "DELETE",
    body: { refreshToken },
  });
}

export async function handleLogOutSession(id) {
  return await reqApi(`/auth/${id}/logout`, {
    method: "DELETE",
  });
}

export async function handleLogOutAllSessions() {
  return await reqApi("/auth/logout-all", {
    method: "DELETE",
  });
}

export async function handleSendPasscode(formData) {
  return await reqApi("/auth/reset-password", {
    method: "POST",
    body: JSON.stringify(formData),
  });
}

export async function handleVerifyPasscode(formData) {
  return await reqApi("/auth/reset-password/verify", {
    method: "POST",
    body: JSON.stringify(formData),
  });
}

export async function handleResetPassword(formData) {
  return await reqApi("/auth/reset-password/new", {
    method: "POST",
    body: JSON.stringify(formData),
  });
}

export async function handleRefreshToken(refreshToken) {
  const response = await refreshApi.post("/auth/refresh-token", {
    refreshToken: refreshToken,
  });
  return response.data;
}
