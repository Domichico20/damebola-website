# DameBola website

Marketing site and private admin for DameBola, a Dominican ride-hailing brand. Spanish is the default language. English is available at `/en`.

The public site explains the service, collects driver pre-registrations, contact messages, and launch emails. It does not book rides. The mobile apps will do that later.

## What is intentionally honest

- App Store and Google Play buttons stay disabled until a real URL is saved in the admin settings.
- Safety features that are not built stay marked **Próximamente**.
- No commissions, minimum fares, payment methods, launch dates, or earnings are invented.
- Driver pre-registration is reviewed by a person. Nothing is approved automatically.
- Legal pages are drafts and say so.

## Local setup

Requirements: Node.js 22.

```bash
npm install
npx prisma migrate dev --name init
npm run setup
npm run dev
```

`npm run setup` creates `.env` if it is missing, applies migrations, and seeds the database. The first administrator password is printed once and stored in `.env` as `ADMIN_PASSWORD`. Sign in at [http://localhost:3000/admin/login](http://localhost:3000/admin/login) with `Info@DameBolaApp.com` and that password, then change it under Cuenta.

If `prisma migrate dev` has not created `prisma/migrations` yet, run that command before `npm run setup`. After the migration exists, `setup` uses `prisma migrate deploy`.

## Environment

See `.env.example`.

- `DATABASE_URL` points at SQLite for local use and a single VPS.
- `AUTH_SECRET` and `IP_HASH_SALT` must be long random values.
- Leave `SMTP_*` empty until the mailbox `Info@DameBolaApp.com` is verified. Forms still save. The dashboard shows them. Confirmation email is sent only when SMTP works.
- `EMAIL_MARKETING_WEBHOOK` is optional. If empty, no outside marketing service is called.
- `NEXT_PUBLIC_GA_ID` or the admin field loads Google Analytics only after the visitor accepts analytics cookies.
- `GOOGLE_SITE_VERIFICATION` is the Search Console meta token.

## Admin roles

- **Owner**: everything, including team accounts and turning off another person's two-factor authentication.
- **Admin**: applications, messages, content, help, safety labels, settings, exports, audit.
- **Support**: applications and messages. No exports, no site settings.

Two-factor authentication is optional and uses an authenticator app plus one-time recovery codes.

## Hosting

GreenGeeks shared hosting (cPanel / PHP) cannot run this Next.js server. Do not upload the project there and expect the forms or the admin panel to work.

Use one of these:

1. **A small Node VPS** (DigitalOcean, Hetzner, or a GreenGeeks VPS with Node 22). Copy the project, set `.env`, point `DATABASE_URL` at a persistent disk, run `npx prisma migrate deploy`, `npm run db:seed`, and `npm run build && npm start`. Put Caddy or Nginx in front for HTTPS and point `www.DameBolaApp.com` at it.
2. **Docker** on that VPS: `docker compose up -d --build`. The compose file keeps the SQLite database in a volume.
3. **Vercel** for the app plus a hosted Postgres or Turso database. Change `provider` in `prisma/schema.prisma` from `sqlite` to `postgresql`, set `DATABASE_URL`, and run a fresh migration. SQLite on serverless disk does not persist.

DNS for `DameBolaApp.com` and `www.DameBolaApp.com` should point at the host you choose. Serve the site only over HTTPS. The app sends an HSTS header.

## Mail and stores

Do not publish store links, a WhatsApp number, or social URLs until they are the official ones. Add them in **Ajustes**. Empty values stay unpublished.

Do not send bulk email from this app. Export subscribers and use an approved email tool when you are ready.

## Data

Driver documents live in `data/private/uploads`, outside `public`. Only a signed-in admin can download them, and each download is audited. The database file is `data/damebola.db`. Back both up. Neither is committed to git.
