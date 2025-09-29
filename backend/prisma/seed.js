import { PrismaClient } from "@prisma/client";
import FlakeId from "flake-idgen";

const prisma = new PrismaClient();
const flake = new FlakeId();

function generateFlakeId() {
  const idBuffer = flake.next();
  const id = BigInt("0x" + idBuffer.toString("hex")).toString();
  return id;
}

// Realistic tweet content for different user types
const tweetTemplates = [
  // Tech tweets
  "Just shipped a new feature 🚀 The feeling when your code works on the first try is unmatched",
  "Hot take: TypeScript > JavaScript. Fight me in the comments 😤",
  "Debugging for 3 hours only to find a missing semicolon... classic Monday",
  "React 19 is looking incredible! Can't wait to try out the new features",
  "Anyone else think dark mode should be the default everywhere? 🌙",
  "Coffee count today: 6 ☕ Productivity: through the roof 📈",
  "That moment when you finally understand async/await... mind = blown 🤯",

  // Design tweets
  "Clean typography can make or break a design ✨",
  "Color theory is not just theory - it's magic in practice 🎨",
  "Figma just announced some amazing new features! Design game is strong",
  "White space is not wasted space. It's breathing room for your design",
  "The best UI is invisible - users shouldn't have to think about it",
  "Accessibility isn't optional. It's essential. Period. ♿",

  // Startup/Business tweets
  "Building a startup is 1% inspiration, 99% coffee and determination ☕",
  "Failed fast, learned faster. Onto the next iteration! 💪",
  "Customer feedback > personal opinions. Always listen to your users",
  "Raised our seed round! 🎉 Excited to build the future with amazing investors",
  "Team lunch today reminded me why culture matters more than perks 🍕",
  "Pivot or persevere? Sometimes the hardest decisions lead to the best outcomes",

  // Data Science tweets
  "Data doesn't lie, but it can be misleading if you're not careful 📊",
  "Spent all day cleaning data. 80% of data science is just data janitor work",
  "Machine learning model accuracy: 99.9% 📈 Me: *suspicious squinting*",
  "Python pandas just saved me 3 hours of manual work. I love this language 🐍",
  "Correlation ≠ Causation. Say it louder for the people in the back!",

  // Crypto tweets
  "HODL life chose me 💎🙌 Diamond hands forever",
  "DeFi is eating traditional finance one protocol at a time",
  "Just deployed my first smart contract on mainnet! Nerve-wracking but exciting",
  "Bear market = building time. Stay focused on fundamentals 📈",
  "Not financial advice: but that dip looks tasty 👀",

  // Fitness tweets
  "Rest days are not lazy days. Recovery is part of the process 💪",
  "PR day! Finally hit that deadlift goal I've been chasing for months 🏋️‍♀️",
  "Consistency > perfection. Show up every day, even when you don't feel like it",
  "Your only competition is who you were yesterday",
  "Mind-muscle connection is real. Focus on form, not just weight",

  // Photography tweets
  "Golden hour hits different when you're chasing the perfect shot 📸",
  "Sometimes the best photos happen when you least expect them",
  "Gear doesn't make the photographer, but good gear sure helps ✨",
  "Street photography taught me to see beauty in ordinary moments",
  "Film vs digital debate is so 2010. Use what inspires you to create",

  // Food/Cooking tweets
  "Fresh pasta made from scratch hits different than store-bought 🍝",
  "Mise en place is life. Organization in the kitchen = peace of mind",
  "Salt, fat, acid, heat - the four pillars of good cooking 👩‍🍳",
  "Local farmers market haul today was incredible! Supporting local growers",
  "Knife skills are everything. A sharp knife is a safe knife",

  // Gaming tweets
  "Unity 2023 LTS is here and it's looking solid for indie development 🎮",
  "Player feedback from our alpha test is pure gold. Back to the drawing board!",
  "8 hours of debugging physics collision... but hey, the player can now jump properly",
  "Indie game development: 10% coding, 90% wondering if anyone will play it",
  "Steam wishlist milestone reached! 🎉 Thank you to everyone who believed in us",

  // Marketing tweets
  "Content that converts: authentic, valuable, and human. Not salesy BS 📈",
  "A/B tested our email subject lines. 2 words changed = 40% higher open rates",
  "Social media marketing rule #1: Be social. Stop treating it like a billboard",
  "Brand storytelling isn't just marketing fluff. Stories create connections",
  "Customer retention > customer acquisition. Keep your existing customers happy",

  // Travel tweets
  "WiFi password acquisition skills: Level Expert ✈️📶",
  "48 countries down, 147 to go. The world is beautifully diverse 🌍",
  "Travel tip: Always pack one day's clothes in your carry-on. Trust me on this",
  "Local street food > fancy restaurants. Every. Single. Time. 🍜",
  "Home is wherever my laptop and good coffee meet",

  // AI/Research tweets
  "Large language models are incredible, but we're still just scratching the surface 🤖",
  "AI safety research isn't fear-mongering. It's responsible development",
  "Published our latest paper on transformer architectures! Peer review here we come",
  "The gap between AI hype and AI reality is where the real work happens",
  "Machine learning democratization is happening faster than anyone predicted",
];

// Some inspirational/general tweets
const generalTweets = [
  "Monday motivation: You're exactly where you need to be 💫",
  "Small wins compound into big victories. Celebrate every step forward",
  "Imposter syndrome is just fear wearing a fancy name. You belong here",
  "Learning in public is scary but rewarding. Share your journey",
  "Take breaks. Your brain needs downtime to process and grow",
  "Comparison is the thief of joy. Focus on your own path",
  "Ask better questions, get better answers",
  "Your future self will thank you for the work you do today",
  "Progress > perfection. Always",
  "What if everything you're going through is preparing you for what you asked for?",
];

// Photo paths for tweet media (without folder prefix)
const tweetPhotos = [
  "tweet-1_nwse9m",
  "tweet-2_lpvo0d",
  "tweet-3_i7gtfh",
  "tweet-4_oac3fy",
  "tweet-5_ih90i7",
];

function getRandomPhoto() {
  return tweetPhotos[Math.floor(Math.random() * tweetPhotos.length)];
}

async function seedTweets() {
  console.log("🐦 Starting tweet seeding...");

  // Get all users to assign tweets to
  const users = await prisma.xUser.findMany({
    select: { id: true, username: true, bio: true },
  });

  if (users.length === 0) {
    console.log("❌ No users found! Run user seeding first.");
    return;
  }

  console.log(`Found ${users.length} users to create tweets for`);

  // Combine all tweet templates
  const allTweets = [...tweetTemplates, ...generalTweets];

  const createdTweets = [];

  // Create 3-5 tweets per user
  for (const user of users) {
    const numTweets = Math.floor(Math.random() * 3) + 3; // 3-5 tweets

    for (let i = 0; i < numTweets; i++) {
      try {
        // Get random tweet content
        const randomTweet =
          allTweets[Math.floor(Math.random() * allTweets.length)];

        // Generate random created date (last 30 days)
        const daysAgo = Math.floor(Math.random() * 30);
        const hoursAgo = Math.floor(Math.random() * 24);
        const createdAt = new Date();
        createdAt.setDate(createdAt.getDate() - daysAgo);
        createdAt.setHours(createdAt.getHours() - hoursAgo);

        // 30% chance of having a photo
        const hasPhoto = Math.random() < 0.3;

        const tweet = await prisma.xTweet.create({
          data: {
            id: generateFlakeId(),
            content: randomTweet,
            authorId: user.id,
            createdAt: createdAt,
            // Create media if hasPhoto is true
            ...(hasPhoto && {
              tweetMedia: {
                create: {
                  path: getRandomPhoto(),
                  type: "IMAGE",
                },
              },
            }),
          },
        });

        createdTweets.push(tweet);
      } catch (error) {
        console.error(
          `❌ Error creating tweet for ${user.username}:`,
          error.message
        );
      }
    }

    console.log(`✅ Created tweets for @${user.username}`);
  }

  console.log(`🎉 Created ${createdTweets.length} tweets successfully!`);
  return createdTweets;
}

async function main() {
  try {
    // Delete existing tweets first
    console.log("🗑️  Deleting existing tweets...");

    const seededUsers = await prisma.xUser.findMany({
      where: {
        email: {
          in: [
            "alex.chen@techmail.com",
            "mike.rodriguez@startup.io",
            "jenny.liu@datacompany.com",
            "david.kim@cryptomail.com",
            "emma.thompson@fitnesshub.com",
            "james.wilson@photoworks.com",
            "maria.garcia@culinaryarts.com",
            "ryan.oconnor@indiegames.com",
            "lisa.park@marketingpro.com",
            "sam.anderson@travelworld.com",
            "priya.patel@airesearch.edu",
          ],
        },
      },
      select: { id: true },
    });

    const userIds = seededUsers.map((u) => u.id);

    await prisma.xTweet.deleteMany({
      where: {
        authorId: { in: userIds },
      },
    });

    console.log("✅ Deleted old tweets\n");

    await seedTweets();
    console.log("✨ Tweet seeding completed!");
  } catch (error) {
    console.error("💥 Tweet seeding failed:", error);
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

export { seedTweets };
