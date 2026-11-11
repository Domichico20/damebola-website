import { randomBytes } from "node:crypto";
import { existsSync, mkdirSync, writeFileSync } from "node:fs";

if (!existsSync(".env")) {
  const password = randomBytes(18).toString("base64url");
  writeFileSync(
    ".env",
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
  console.log(`ADMIN_PASSWORD=${password}`);
} else {
  console.log("env exists");
}
mkdirSync("data/private/uploads", { recursive: true });
