import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Example users
  const users = [
    {
      username: "johndoe",
      name: "John Doe",
      email: "john@example.com",
      password: "hashedpassword123", // ⚠️ store hashed in real app
      bio: "Just a regular guy who loves coding.",
      profilePicture: "https://i.pravatar.cc/150?img=1",
      coverImage: "https://picsum.photos/800/200?random=1",
      isVerified: true,
    },
    {
      username: "janedoe",
      name: "Jane Doe",
      email: "jane@example.com",
      password: "hashedpassword456",
      bio: "Frontend dev & coffee lover.",
      profilePicture: "https://i.pravatar.cc/150?img=2",
      coverImage: "https://picsum.photos/800/200?random=2",
      isProtected: true,
    },
    {
      username: "techguy",
      name: "Mike Smith",
      email: "mike@example.com",
      password: "hashedpassword789",
      bio: "Building cool stuff with JS.",
      profilePicture: "https://i.pravatar.cc/150?img=3",
      coverImage: "https://picsum.photos/800/200?random=3",
    },
  ];

  for (const user of users) {
    await prisma.xUser.create({ data: user });
  }

  console.log("✅ Seeded users successfully!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
