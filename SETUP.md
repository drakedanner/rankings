# Setup guide (hand-holding)

## What’s already done

- Next.js (App Router) + TypeScript + Tailwind
- Prisma with a `Show` model matching the spec
- Seed script + sample CSV at `prisma/data/shows.csv`
- Scripts: `npm run dev`, `npm run db:generate`, `npm run db:push`, `npm run db:seed`, `npm run db:studio`

---

## Quick start (Docker)

Uses the same Postgres-in-Docker setup so everyone gets the same local DB.

### 1. Configure secrets (required first)

Credentials live only in `.env`, which is gitignored and never committed.

```bash
cp .env.example .env
```

Edit `.env` and set a strong `POSTGRES_PASSWORD` (and match it in `DATABASE_URL`). Keep `POSTGRES_USER` and `POSTGRES_DB` as in the example unless you change them everywhere. If you already had a `.env` with only `DATABASE_URL`, add the `POSTGRES_USER`, `POSTGRES_PASSWORD`, and `POSTGRES_DB` lines from `.env.example` so Docker can use them.

### 2. Start Postgres

From the project root:

```bash
docker compose up -d
```

Postgres 16 runs on port 5432 using the user/password/db from `.env`. Data is stored in a Docker volume so it survives restarts.

### 3. Create tables and seed data

```bash
npm run db:push
npm run db:seed
```

### 4. Run the app

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

**Optional:** `npm run db:studio` opens Prisma Studio to browse or edit the database.

**Stop Postgres when you’re done:** `docker compose down` (add `-v` only if you want to wipe the DB volume).

---

## Other local options

**Homebrew** — `brew install postgresql@16`, `brew services start postgresql@16`, then `createdb shows`. Use:
`DATABASE_URL="postgresql://YOUR_MAC_USERNAME@localhost:5432/shows"`

**Postgres.app** — [postgresapp.com](https://postgresapp.com), then `createdb shows`. Same URL style as Homebrew.

---

## Production later

When you deploy, create a project on [Neon](https://neon.tech) or [Supabase](https://supabase.com), set `DATABASE_URL` in your host’s env (e.g. Vercel), run `db:push` (and seed or migrate) against that URL. No app code changes.

---

## Node version

Node 20.12.2 works with Prisma 5 (this project). Prisma 7 needs 20.19+; upgrade with `npm install prisma@latest @prisma/client@latest` when you upgrade Node.
