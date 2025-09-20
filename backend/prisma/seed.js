import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Your account
  const mido = await prisma.user.upsert({
    where: { username: "holymido" },
    update: {},
    create: {
      id: "5f90861c-92b6-4a92-8c10-2823799e758a", // keep your ID stable
      username: "holymido",
      name: "mido",
      email: "mido@example.com",
      password: "hashedpassword123", // ⚠️ should be hashed in real app
      bio: "Intern dentist",
      profilePicture:
        "http://localhost:3000/uploads/profilePictures/7369296466466045952.jpg",
      coverImage:
        "http://localhost:3000/uploads/coverImages/7368870296641601536.png",
      isVerified: false,
      isProtected: false,
      sentWelcome: true,
    },
  });

  // Chat partners
  const alice = await prisma.user.upsert({
    where: { username: "alice" },
    update: {},
    create: {
      username: "alice",
      name: "Alice",
      email: "alice@example.com",
      password: "hashedpassword123",
      profilePicture: "https://i.pravatar.cc/150?u=alice",
    },
  });

  const bob = await prisma.user.upsert({
    where: { username: "bob" },
    update: {},
    create: {
      username: "bob",
      name: "Bob",
      email: "bob@example.com",
      password: "hashedpassword123",
      profilePicture: "https://i.pravatar.cc/150?u=bob",
    },
  });

  // Seed messages (Mido <-> Alice)
  await prisma.message.createMany({
    data: [
      {
        content: "Hey Alice 👋 how’s your day?",
        senderId: mido.id,
        receiverId: alice.id,
      },
      {
        content: "Hi Mido! Pretty good, how about you?",
        senderId: alice.id,
        receiverId: mido.id,
      },
    ],
  });

  // Seed messages (Mido <-> Bob)
  await prisma.message.createMany({
    data: [
      {
        content: "Yo Mido, did you finish that project?",
        senderId: bob.id,
        receiverId: mido.id,
      },
      {
        content: "Almost done, Bob 😅. I’ll send it later.",
        senderId: mido.id,
        receiverId: bob.id,
      },
    ],
  });

  console.log("✅ Seed complete: Mido engaged in conversations");
}

main()
  .then(() => prisma.$disconnect())
  .catch((e) => {
    console.error(e);
    prisma.$disconnect();
    process.exit(1);
  });
