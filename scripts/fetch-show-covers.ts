/**
 * Fetches TV show image URLs from TVMaze (api.tvmaze.com) and updates each show's cover_url in the database.
 * No API key required. By default only fetches for shows missing cover_url. Use --force to refetch all.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TVMAZE_SEARCH = "https://api.tvmaze.com/search/shows";
const TVMAZE_SHOW = "https://api.tvmaze.com/shows";
const DELAY_MS = 300;
const CONCURRENCY = 4;
const FORCE = process.argv.includes("--force");

/** Display name -> TVMaze show ID when search returns wrong show (e.g. UK vs US). */
const TVMAZE_ID_OVERRIDE: Record<string, number> = {
  "The Traitors (w/ Alan Cumming)": 58177, // The Traitors US (Peacock)
};

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type TvmazeSearchHit = {
  show?: {
    id?: number;
    image?: { medium?: string; original?: string };
    rating?: { average?: number | null } | null;
  };
};

type TvmazeResult = { imageUrl: string | null; tvmazeId: number; tvmazeRating: number | null } | null;

async function getTvmazeShowById(id: number): Promise<TvmazeResult> {
  const res = await fetch(`${TVMAZE_SHOW}/${id}`, {
    headers: { Accept: "application/json", "User-Agent": "personal-site-covers-fetch/1.0" },
  });
  if (!res.ok) return null;
  const show = (await res.json()) as {
    id?: number;
    image?: { medium?: string; original?: string };
    rating?: { average?: number | null } | null;
  };
  const imageUrl = show.image?.original ?? show.image?.medium ?? null;
  const tvmazeRating =
    show.rating?.average != null && Number.isFinite(show.rating.average) ? show.rating.average : null;
  if (imageUrl && show.id != null) {
    return { imageUrl, tvmazeId: show.id, tvmazeRating };
  }
  return null;
}

async function searchTvmazeShow(name: string): Promise<TvmazeResult> {
  const url = new URL(TVMAZE_SEARCH);
  url.searchParams.set("q", name);

  const res = await fetch(url.toString(), {
    headers: { Accept: "application/json", "User-Agent": "personal-site-covers-fetch/1.0" },
  });
  if (!res.ok) {
    console.warn(`TVMaze search failed for "${name}": ${res.status}`);
    return null;
  }

  const data = (await res.json()) as TvmazeSearchHit[];
  const first = data[0]?.show;
  if (!first?.image) return null;
  const imageUrl = first.image.original ?? first.image.medium ?? null;
  const tvmazeId = first.id;
  const tvmazeRating =
    first.rating?.average != null && Number.isFinite(first.rating.average)
      ? first.rating.average
      : null;
  if (imageUrl && tvmazeId != null) {
    return { imageUrl, tvmazeId, tvmazeRating };
  }
  return null;
}

async function main() {
  const shows = await prisma.show.findMany({
    where: FORCE ? undefined : { OR: [{ cover_url: null }, { tvmaze_id: null }, { tvmaze_rating: null }] },
    orderBy: { name: "asc" },
  });
  if (shows.length === 0) {
    console.log("No shows need cover URLs. Run with --force to refetch all.");
    return;
  }
  console.log(`Found ${shows.length} shows to fetch from TVMaze...`);

  let updated = 0;
  let skipped = 0;

  async function processShow(
    show: (typeof shows)[0]
  ): Promise<"updated" | "skipped"> {
    const overrideId = TVMAZE_ID_OVERRIDE[show.name];
    const result = overrideId
      ? await getTvmazeShowById(overrideId)
      : await searchTvmazeShow(show.name);
    if (!result?.imageUrl) {
      console.log(`  Skip (no match): ${show.name}`);
      return "skipped";
    }
    await prisma.show.update({
      where: { id: show.id },
      data: {
        cover_url: result.imageUrl,
        tvmaze_id: result.tvmazeId,
        tvmaze_rating: result.tvmazeRating,
      },
    });
    console.log(`  OK: ${show.name}`);
    return "updated";
  }

  for (let i = 0; i < shows.length; i += CONCURRENCY) {
    const chunk = shows.slice(i, i + CONCURRENCY);
    const results = await Promise.all(chunk.map(processShow));
    updated += results.filter((r) => r === "updated").length;
    skipped += results.filter((r) => r === "skipped").length;
    if (i + CONCURRENCY < shows.length) {
      await sleep(DELAY_MS);
    }
  }

  console.log(`Done. Updated ${updated}, skipped ${skipped}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
