#!/usr/bin/env node
/**
 * Run before prod:db. Ensures DATABASE_URL is set and is a postgres URI.
 * Supabase: use the Connect panel or Project Settings → Database → Connection string (URI).
 */
const url = process.env.DATABASE_URL;
if (!url || typeof url !== "string") {
  console.error("DATABASE_URL is not set. Run:");
  console.error("  export DATABASE_URL='postgresql://...'");
  console.error("Get the URI from Supabase: dashboard → your project → Connect (top bar) or Project Settings → Database.");
  process.exit(1);
}
if (!url.startsWith("postgresql://") && !url.startsWith("postgres://")) {
  console.error("DATABASE_URL must be a Postgres URI starting with postgresql:// or postgres://");
  console.error("You may have used the Supabase project URL (https://...). Use the database Connection string (URI) instead.");
  console.error("Supabase: project → Connect, or Project Settings → Database → Connection string → URI.");
  process.exit(1);
}
