# Deploy to production

**Never put real credentials in this file or in chat.** Use env vars only.

---

## First-time: get data on prod (Supabase + Vercel)

If you already have Supabase and Vercel set up but prod shows no data, do these two things.

**1. Get the Postgres connection string from Supabase**

- Open [Supabase Dashboard](https://supabase.com/dashboard) and select your project.
- Either:
  - Click **Connect** in the top bar → under "Connection string" choose **URI** and copy it, or
  - Go to **Project Settings** (gear in sidebar) → **Database** → **Connection string** → **URI** and copy it.
- The string must start with `postgresql://` or `postgres://`. Replace `[YOUR-PASSWORD]` with your database password (reset it on that same Database page if needed).
- Do **not** use the project URL (`https://xxx.supabase.co`) — that is not the database URI.

**2. Put that URI in Vercel and fill the prod DB**

- **Vercel:** Project → **Settings** → **Environment Variables** → add `DATABASE_URL` with the `postgresql://...` value (Production). Save, then **Redeploy**.
- **Your terminal** (paste the real URI only in the terminal, never in this file or in chat):

```bash
export DATABASE_URL='postgresql://postgres.[ref]:YOUR_PASSWORD@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true'
pnpm run prod:db
unset DATABASE_URL
```

If you see "DATABASE_URL must be a Postgres URI..." or "the URL must start with postgresql://", you used the wrong value — get the **URI** from Supabase’s Connect panel or Database settings, not the `https://` URL.

After that, your prod site will show spots, shows, and episodes.

---

## Deploy the app

Push to the branch your host uses (e.g. `main`):

```bash
git add -A && git status && git commit -m "Deploy" && git push origin main
```

(Vercel/Netlify will build and deploy. Or run `pnpm exec vercel --prod` if you use the CLI.)

---

## Production database (when needed)

Only when you need to update **production** data or schema. Get `DATABASE_URL` from your host (e.g. Vercel → Settings → Environment Variables). **Paste it only in your terminal**, not here.

**Step 1 — point at prod (same terminal session):**

```bash
export DATABASE_URL='<paste prod connection string in terminal only>'
```

**Step 2 — run the one prod-DB command:**

```bash
cd /Users/drakedanner/personal-site && pnpm run prod:db
```

**Step 3 — clear the secret from your session:**

```bash
unset DATABASE_URL
```

`prod:db` runs: schema push → seed → ranks backfill → covers fetch → episodes fetch. Add `--force` to the underlying scripts if you need a full refresh (e.g. `pnpm run covers:fetch -- --force`).

---

## Security

- Secrets only in `.env` (local) or host env (prod). Never commit.
- After prod DB work, `unset DATABASE_URL` or close the terminal.
