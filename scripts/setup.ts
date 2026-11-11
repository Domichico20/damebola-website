import { randomBytes } from "crypto";
import { execSync } from "child_process";
import { existsSync, mkdirSync, writeFileSync } from "fs";

const envPath = ".env";

if (!existsSync(envPath)) {
  const password = randomBytes(18).toString("base64url");
  writeFileSync(
    envPath,
    [
      'DATABASE_URL="file:../data/damebola.db"',
      `AUTH_SECRET="${randomBytes(32).toString("hex")}"`,
      `IP_HASH_SALT="${randomBytes(16).toString("hex")}"`,
      'ADMIN_EMAIL="Info@DameBolaApp.com"',
      `ADMIN_PASSWORD="${password}"`,
      'ADMIN_NAME="Administrador"',
      'SMTP_HOST=""',
      'SMTP_PORT="587"',
      'SMTP_USER=""',
      'SMTP_PASS=""',
      'SMTP_FROM="DameBola <Info@DameBolaApp.com>"',
      'NOTIFY_EMAIL="Info@DameBolaApp.com"',
      'EMAIL_MARKETING_WEBHOOK=""',
      'EMAIL_MARKETING_TOKEN=""',
      'NEXT_PUBLIC_SITE_URL="http://localhost:3000"',
      'NEXT_PUBLIC_GA_ID=""',
      'GOOGLE_SITE_VERIFICATION=""',
      "",
    ].join("\n"),
  );
  console.log("Created .env");
  console.log("ADMIN_EMAIL=Info@DameBolaApp.com");
  console.log(`ADMIN_PASSWORD=${password}`);
}

mkdirSync("data/private/uploads", { recursive: true });
execSync("npx prisma migrate deploy", { stdio: "inherit" });
execSync("npx tsx prisma/seed.ts", { stdio: "inherit" });
