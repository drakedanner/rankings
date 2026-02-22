# Security

- **Never commit `.env`.** It holds database credentials and any future secrets. `.env` is in `.gitignore`; only `.env.example` (placeholders only) is committed.
- **Database:** User, password, and DB name are set in `.env`. Copy `.env.example` to `.env`, set a strong `POSTGRES_PASSWORD`, and keep `.env` local.
- **Production:** Set `DATABASE_URL` and any API keys in your host’s environment (e.g. Vercel env vars). Do not put production credentials in the repo or in `.env.example`.
