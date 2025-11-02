export function generateAvatar(name) {
  return `https://api.dicebear.com/7.x/initials/svg?seed=${
    name || "default"
  }&radius=50`;
}
