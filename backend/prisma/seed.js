import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";

const prisma = new PrismaClient();

async function main() {
  const a = "5f90861c-92b6-4a92-8c10-2823799e758a";
  const b = "24ab6235-b5d9-413f-b3d1-72ad1a087b0a";

  const [user1Id, user2Id] = a < b ? [a, b] : [b, a];

  let chat = await prisma.chat.findUnique({
    where: {
      user1Id_user2Id: { user1Id, user2Id },
    },
  });

  if (!chat) {
    chat = await prisma.chat.create({
      data: {
        id: uuidv4(),
        user1Id,
        user2Id,
      },
    });
  }

  await prisma.message.createMany({
    data: [
      {
        id: uuidv4(),
        content: "Hey — this is the first test message",
        senderId: a,
        receiverId: b,
        chatId: chat.id,
      },
      {
        id: uuidv4(),
        content: "Reply: got your message",
        senderId: b,
        receiverId: a,
        chatId: chat.id,
      },
    ],
  });

  const messages = await prisma.message.findMany({
    where: { chatId: chat.id },
    orderBy: { createdAt: "asc" },
  });

  console.log(chat, messages);
}

main()
  .catch((e) => {
    console.error(e);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
