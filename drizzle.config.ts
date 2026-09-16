import { config } from "dotenv";
import type { Config } from "drizzle-kit";

// Load .env.local first (Next.js convention), then .env
config({ path: ".env.local" });
config({ path: ".env" });

export default {
  schema: "./src/db/schema.ts",
  out: "./drizzle",
  dialect: "postgresql",
  dbCredentials: {
    url: process.env.DATABASE_URL!,
  },
} satisfies Config;
