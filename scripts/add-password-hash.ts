import "dotenv/config";
import { drizzle } from "drizzle-orm/mysql2";
import { sql } from "drizzle-orm";

const db = drizzle(process.env.DATABASE_URL!);

// Add passwordHash column if it doesn't exist yet
// MySQL doesn't support IF NOT EXISTS on ADD COLUMN before 8.0,
// so we catch the duplicate column error gracefully.
try {
  await db.execute(sql`ALTER TABLE \`users\` ADD COLUMN \`passwordHash\` TEXT`);
  console.log("✔ passwordHash column added");
} catch (err: any) {
  if (err?.cause?.errno === 1060) {
    console.log("✔ passwordHash column already exists — skipping");
  } else {
    throw err;
  }
}

// Also register migration 0003 as applied so drizzle doesn't try to re-run it
try {
  await db.execute(
    sql`INSERT IGNORE INTO \`__drizzle_migrations\` (\`hash\`, \`created_at\`)
        VALUES ('0003_freezing_blade', UNIX_TIMESTAMP() * 1000)`
  );
  console.log("✔ Migration 0003 marked as applied");
} catch {
  // table may not exist or different schema — that's fine
}

console.log("Done!");
process.exit(0);
