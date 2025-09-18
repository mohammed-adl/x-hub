import { reqApi } from "../lib/index.js";

export async function handleSearchUsers(query) {
  return await reqApi(`/search?q=${query}`);
}
