/**
 * Fetches TV show image URLs from TVMaze (api.tvmaze.com) and updates each show's cover_url in the database.
 * No API key required. By default only fetches for shows missing cover_url. Use --force to refetch all.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TVMAZE_SEARCH = "https://api.tvmaze.com/search/shows";
const DELAY_MS = 300;
const FORCE = process.argv.includes("--force");

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function searchTvmazeShow(name: string): Promise<{ imageUrl: string | null } | null> {
  const url = new URL(TVMAZE_SEARCH);
  url.searchParams.set("q", name);

  const res = await fetch(url.toString(), {
    headers: { Accept: "application/json", "User-Agent": "personal-site-covers-fetch/1.0" },
  });
  if (!res.ok) {
    console.warn(`TVMaze search failed for "${name}": ${res.status}`);
    return null;
  }

  const data = (await res.json()) as Array<{ show?: { image?: { medium?: string; original?: string } } }>;
  const first = data[0]?.show;
  if (!first?.image) return null;
  const imageUrl = first.image.original ?? first.image.medium ?? null;
  return imageUrl ? { imageUrl } : null;
}

async function main() {
  const shows = await prisma.show.findMany({
    where: FORCE ? undefined : { cover_url: null },
    orderBy: { name: "asc" },
  });
  if (shows.length === 0) {
    console.log("No shows need cover URLs. Run with --force to refetch all.");
    return;
  }
  console.log(`Found ${shows.length} shows to fetch from TVMaze...`);

  let updated = 0;
  let skipped = 0;

  for (const show of shows) {
    await sleep(DELAY_MS);
    const result = await searchTvmazeShow(show.name);
    if (!result?.imageUrl) {
      console.log(`  Skip (no match): ${show.name}`);
      skipped++;
      continue;
    }

    await prisma.show.update({
      where: { id: show.id },
      data: { cover_url: result.imageUrl },
    });
    console.log(`  OK: ${show.name}`);
    updated++;
  }

  console.log(`Done. Updated ${updated}, skipped ${skipped}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
