import { prisma } from "../lib/index.js";

export async function generateUniqueUsername(name) {
  const base =
    name
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "")
      .replace(/[^a-z0-9]/g, "") || "user";

  let username;
  let exists = true;

  while (exists) {
    const suffix = Math.floor(1000 + Math.random() * 9000);
    username = `${base}${suffix}`;

    const existingUser = await prisma.xUser.findUnique({
      where: { username },
      select: { id: true },
    });

    exists = Boolean(existingUser);
  }

  return username;
}
