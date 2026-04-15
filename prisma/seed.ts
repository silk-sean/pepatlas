import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";

const connectionString = process.env.DATABASE_URL;
if (!connectionString) throw new Error("DATABASE_URL not set");
const adapter = new PrismaPg({ connectionString });
const db = new PrismaClient({ adapter });

const FORUM_CATEGORIES = [
  { slug: "beginner-questions", name: "Beginner Questions", description: "New to peptides? Start here.", sortOrder: 0 },
  { slug: "protocol-discussions", name: "Protocol Discussions", description: "Share and discuss protocols.", sortOrder: 1 },
  { slug: "personal-logs", name: "Personal Logs & Journals", description: "Track your journey.", sortOrder: 2 },
  { slug: "bloodwork-metrics", name: "Bloodwork & Metrics", description: "Lab results and biomarkers.", sortOrder: 3 },
  { slug: "optimization", name: "Optimization Strategies", description: "Advanced wellness strategies.", sortOrder: 4 },
  { slug: "general", name: "General Discussion", description: "Off-topic and community chat.", sortOrder: 5 },
];

async function main() {
  for (const cat of FORUM_CATEGORIES) {
    await db.forumCategory.upsert({
      where: { slug: cat.slug },
      update: { name: cat.name, description: cat.description, sortOrder: cat.sortOrder },
      create: cat,
    });
  }
  console.log(`Seeded ${FORUM_CATEGORIES.length} forum categories.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
