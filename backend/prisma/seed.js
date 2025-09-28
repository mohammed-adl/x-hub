import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// The specific user ID you want to create messages for
const TARGET_USER_ID = "e53ec851-9e7d-4f75-8020-636ba9ea6580";

// Realistic message templates for conversations
const messageTemplates = {
  greetings: [
    "Hey! 👋",
    "Hi there!",
    "What's up? 😊",
    "Hello! How are you?",
    "Hey, how's your day going?",
    "Yo! 🔥",
  ],
  responses: [
    "Good morning! ☀️",
    "Not much, just working on some projects",
    "Pretty good! Thanks for asking 😊",
    "Busy day but can't complain",
    "All good here! How about you?",
    "Just the usual, you know how it is",
  ],
  tech_talk: [
    "Did you see the new React update?",
    "That bug fix you suggested worked perfectly! 🙌",
    "Working on a new feature, it's pretty exciting",
    "Code review when you have time?",
    "Thanks for the help with that API issue",
    "The deployment went smoothly 🚀",
  ],
  casual: [
    "Coffee later? ☕",
    "How was your weekend?",
    "Check out this meme 😂",
    "Lunch plans today?",
    "Did you watch that show I recommended?",
    "Weather's been crazy lately",
    "Thanks for the recommendation!",
    "Haha that's hilarious 😭",
    "Absolutely! Let's do it",
    "Sounds like a plan 👍",
  ],
  work_related: [
    "Meeting moved to 3 PM",
    "Can you review this when you get a chance?",
    "Great presentation today! 👏",
    "I'll send over the docs shortly",
    "Perfect, that makes sense",
    "Let me know if you need anything else",
  ],
  reactions: [
    "😂😂😂",
    "That's awesome! 🔥",
    "No way! Really?",
    "Amazing work! 👏",
    "Love it! 💯",
    "This is so cool!",
    "Exactly what I was thinking",
    "You're the best! 🙏",
  ],
};

function getRandomMessages(category, count = 1) {
  const messages = messageTemplates[category];
  const result = [];
  for (let i = 0; i < count; i++) {
    result.push(messages[Math.floor(Math.random() * messages.length)]);
  }
  return result;
}

async function createConversation(targetUserId, otherUserId, chatId) {
  const messages = [];

  // Create a realistic conversation flow
  const conversationPatterns = [
    // Pattern 1: Quick greeting exchange
    {
      messages: [
        { sender: otherUserId, content: getRandomMessages("greetings")[0] },
        { sender: targetUserId, content: getRandomMessages("responses")[0] },
        { sender: otherUserId, content: getRandomMessages("casual")[0] },
        { sender: targetUserId, content: getRandomMessages("reactions")[0] },
      ],
    },
    // Pattern 2: Work discussion
    {
      messages: [
        { sender: otherUserId, content: getRandomMessages("tech_talk")[0] },
        { sender: targetUserId, content: getRandomMessages("responses")[0] },
        { sender: targetUserId, content: getRandomMessages("tech_talk")[0] },
        { sender: otherUserId, content: getRandomMessages("reactions")[0] },
        { sender: otherUserId, content: getRandomMessages("work_related")[0] },
      ],
    },
    // Pattern 3: Casual chat
    {
      messages: [
        { sender: targetUserId, content: getRandomMessages("greetings")[0] },
        { sender: otherUserId, content: getRandomMessages("casual")[0] },
        { sender: targetUserId, content: getRandomMessages("casual")[0] },
        { sender: otherUserId, content: getRandomMessages("reactions")[0] },
      ],
    },
  ];

  const selectedPattern =
    conversationPatterns[
      Math.floor(Math.random() * conversationPatterns.length)
    ];

  // Create messages with realistic timestamps
  for (let i = 0; i < selectedPattern.messages.length; i++) {
    const msgData = selectedPattern.messages[i];

    // Messages spread over last few days, with gaps between them
    const daysAgo = Math.floor(Math.random() * 5); // Last 5 days
    const hoursAgo = Math.floor(Math.random() * 24);
    const minutesAgo = Math.floor(Math.random() * 60);

    const createdAt = new Date();
    createdAt.setDate(createdAt.getDate() - daysAgo);
    createdAt.setHours(createdAt.getHours() - hoursAgo);
    createdAt.setMinutes(createdAt.getMinutes() - minutesAgo + i * 5); // Small gaps between messages

    const message = await prisma.xMessage.create({
      data: {
        content: msgData.content,
        senderId: msgData.sender,
        receiverId:
          msgData.sender === targetUserId ? otherUserId : targetUserId,
        chatId: chatId,
        isRead: Math.random() > 0.3, // 70% chance read, 30% unread
        createdAt: createdAt,
      },
    });

    messages.push(message);
  }

  return messages;
}

async function seedMessages() {
  console.log("💬 Starting messages seeding...");

  // Check if target user exists
  const targetUser = await prisma.xUser.findUnique({
    where: { id: TARGET_USER_ID },
    select: { id: true, username: true },
  });

  if (!targetUser) {
    console.log(`❌ Target user with ID ${TARGET_USER_ID} not found!`);
    return;
  }

  console.log(`🎯 Creating messages for user: ${targetUser.username}`);

  // Get other users to create conversations with
  const otherUsers = await prisma.xUser.findMany({
    where: {
      id: { not: TARGET_USER_ID },
    },
    select: { id: true, username: true },
    take: 5, // Create conversations with 5 different users
  });

  if (otherUsers.length === 0) {
    console.log("❌ No other users found to create conversations with!");
    return;
  }

  const createdChats = [];
  const createdMessages = [];

  // Create chats and messages with each user
  for (let i = 0; i < Math.min(otherUsers.length, 4); i++) {
    // Max 4 conversations
    const otherUser = otherUsers[i];

    try {
      // Create chat (ensure user1Id < user2Id for consistency)
      const user1Id =
        TARGET_USER_ID < otherUser.id ? TARGET_USER_ID : otherUser.id;
      const user2Id =
        TARGET_USER_ID < otherUser.id ? otherUser.id : TARGET_USER_ID;

      const chat = await prisma.xChat.create({
        data: {
          user1Id: user1Id,
          user2Id: user2Id,
        },
      });

      createdChats.push({
        id: chat.id,
        users: [targetUser.username, otherUser.username],
      });

      console.log(
        `✅ Created chat between ${targetUser.username} and ${otherUser.username}`
      );

      // Create conversation messages
      const messages = await createConversation(
        TARGET_USER_ID,
        otherUser.id,
        chat.id
      );
      createdMessages.push(...messages);

      console.log(
        `📝 Created ${messages.length} messages in this conversation`
      );

      // Update chat's updatedAt to most recent message
      if (messages.length > 0) {
        const latestMessage = messages[messages.length - 1];
        await prisma.xChat.update({
          where: { id: chat.id },
          data: { updatedAt: latestMessage.createdAt },
        });
      }
    } catch (error) {
      if (error.code === "P2002") {
        console.log(
          `⚠️  Chat between ${targetUser.username} and ${otherUser.username} already exists`
        );
      } else {
        console.error(
          `❌ Error creating chat with ${otherUser.username}:`,
          error.message
        );
      }
    }
  }

  console.log(
    `🎉 Created ${createdChats.length} chats with ${createdMessages.length} total messages!`
  );

  // Show summary
  const unreadMessages = createdMessages.filter(
    (m) => !m.isRead && m.receiverId === TARGET_USER_ID
  );

  console.log("\n📊 Messages Summary:");
  console.log(`💬 Total chats: ${createdChats.length}`);
  console.log(`📝 Total messages: ${createdMessages.length}`);
  console.log(`🔴 Unread messages for target user: ${unreadMessages.length}`);

  createdChats.forEach((chat) => {
    const chatMessages = createdMessages.filter((m) => m.chatId === chat.id);
    console.log(
      `   ${chat.users.join(" ↔️ ")}: ${chatMessages.length} messages`
    );
  });

  return { chats: createdChats, messages: createdMessages };
}

async function main() {
  try {
    await seedMessages();
    console.log("✨ Messages seeding completed!");
  } catch (error) {
    console.error("💥 Messages seeding failed:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

// Run the seeding
main().catch((error) => {
  console.error(error);
  process.exit(1);
});

export { seedMessages };
