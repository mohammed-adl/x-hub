export function generateAvatar(name) {
  return `https://api.dicebear.com/7.x/initials/svg?seed=${
    name || "default"
  }&radius=50`;
}

// export function generateAvatar(username) {
//   return `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(
//     username || "default"
//   )}&radius=50&size=128`;
// }
