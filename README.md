# Mess Portal

Production-ready MVP for mess operations with students, managers, and admin roles.

## Deploy (Vercel + Managed DB)
- Create a Postgres database (Railway/Neon/Supabase). Copy its URL as `DATABASE_URL` in Vercel env.
- Set `NEXTAUTH_URL` (Vercel domain) and `NEXTAUTH_SECRET`.
- Set `EMAIL_SERVER` and `EMAIL_FROM` (e.g., Resend or SMTP service).
- Push to GitHub. Import repo in Vercel. Set Build Command: `npm run build`, Install: `npm ci`.
- Run migrations via `npx prisma migrate deploy` (Vercel CLI or a one-off job).
- Seed optionally locally and import, or provide admin invite flow.

## Dev
```bash
copy env.example .env
npm i
npx prisma migrate dev --name init
npm run seed
npm run dev
```

## Scripts
- `npm run dev` – start dev server
- `npm run build` – build (includes prisma generate)
- `npm run start` – start prod server
- `npm run db:migrate` – prisma migrate dev
- `npm run seed` – seed demo data
- `npm run reconcile` – run reconciliation report for today
- `npm test` – tests

## Notes
- Local uses SQLite; production should use Postgres (update `schema.prisma` and `DATABASE_URL`).
- PWA available (manifest + service worker). Notifications can be added later.
- Exports: `/api/exports/{bookings|attendance|waste|inventory}`.
