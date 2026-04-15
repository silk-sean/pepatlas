import "dotenv/config";
import { defineConfig } from "prisma/config";

// prisma.config.ts is loaded by `prisma generate` (no DB connection needed)
// and `prisma db push` (needs DB). We read DATABASE_URL directly from
// process.env so that `generate` in a build container without the env var
// still works — it just skips the datasource URL.
export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  datasource: {
    url: process.env.DATABASE_URL ?? "postgresql://placeholder@localhost:5432/placeholder",
  },
});
