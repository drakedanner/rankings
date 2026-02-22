# Deploy to production

**Never put real credentials in this file or in chat.** Use env vars only.

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
