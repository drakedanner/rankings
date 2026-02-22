/**
 * Fetches episode lists from TVMaze (api.tvmaze.com) for each show that has a tvmaze_id,
 * and upserts them into the Episode table. Run after covers:fetch so tvmaze_id is set.
 * Use --force to refetch episodes for all shows with tvmaze_id.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const TVMAZE_EPISODES = "https://api.tvmaze.com/shows";
const DELAY_MS = 300;
const CONCURRENCY = 4;
const FORCE = process.argv.includes("--force");

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

type TvmazeEpisode = {
  id: number;
  name: string;
  season: number;
  number: number;
  airdate?: string | null;
  summary?: string | null;
  runtime?: number | null;
  image?: { medium?: string; original?: string } | null;
  rating?: { average?: number | null } | null;
};

async function fetchTvmazeEpisodes(tvmazeId: number): Promise<TvmazeEpisode[]> {
  const url = `${TVMAZE_EPISODES}/${tvmazeId}/episodes`;
  const res = await fetch(url, {
    headers: { Accept: "application/json", "User-Agent": "personal-site-episodes-fetch/1.0" },
  });
  if (!res.ok) {
    throw new Error(`TVMaze episodes failed for show ${tvmazeId}: ${res.status}`);
  }
  return res.json() as Promise<TvmazeEpisode[]>;
}

function parseAirdate(airdate: string | null | undefined): Date | null {
  if (!airdate) return null;
  const d = new Date(airdate);
  return isNaN(d.getTime()) ? null : d;
}

async function main() {
  const shows = await prisma.show.findMany({
    where: { tvmaze_id: { not: null } },
    orderBy: { name: "asc" },
  });
  if (shows.length === 0) {
    console.log("No shows with tvmaze_id. Run covers:fetch first (or with --force).");
    return;
  }

  let showsToProcess: (typeof shows)[number][];
  if (!FORCE) {
    const withEpisodes = await prisma.episode.groupBy({
      by: ["showId"],
      _count: { showId: true },
    });
    const showIdsWithEpisodes = new Set(withEpisodes.map((e) => e.showId));
    showsToProcess = shows.filter((s) => !showIdsWithEpisodes.has(s.id));
    if (showsToProcess.length === 0) {
      console.log("All shows with tvmaze_id already have episodes. Use --force to refetch.");
      return;
    }
  } else {
    showsToProcess = shows;
  }

  console.log(`Fetching episodes for ${showsToProcess.length} shows...`);

  let totalUpserted = 0;

  async function processShow(
    show: (typeof shows)[0]
  ): Promise<number> {
    const tvmazeId = show.tvmaze_id!;
    let episodes: TvmazeEpisode[];
    try {
      episodes = await fetchTvmazeEpisodes(tvmazeId);
    } catch (e) {
      console.warn(`  Skip ${show.name}:`, (e as Error).message);
      return 0;
    }

    const upserts = episodes.map((ep) => {
      const airdate = parseAirdate(ep.airdate);
      const imageUrl = ep.image?.original ?? ep.image?.medium ?? null;
      const rating =
        ep.rating?.average != null && Number.isFinite(ep.rating.average)
          ? ep.rating.average
          : null;
      return prisma.episode.upsert({
        where: { tvmaze_episode_id: ep.id },
        create: {
          showId: show.id,
          tvmaze_episode_id: ep.id,
          name: ep.name,
          season: ep.season,
          number: ep.number,
          airdate,
          summary: ep.summary ?? null,
          runtime: ep.runtime ?? null,
          image_url: imageUrl,
          rating,
        },
        update: {
          name: ep.name,
          season: ep.season,
          number: ep.number,
          airdate,
          summary: ep.summary ?? null,
          runtime: ep.runtime ?? null,
          image_url: imageUrl,
          rating,
        },
      });
    });

    await prisma.$transaction(upserts);
    console.log(`  ${show.name}: ${episodes.length} episodes`);
    return episodes.length;
  }

  for (let i = 0; i < showsToProcess.length; i += CONCURRENCY) {
    const chunk = showsToProcess.slice(i, i + CONCURRENCY);
    const counts = await Promise.all(chunk.map(processShow));
    totalUpserted += counts.reduce((a, b) => a + b, 0);
    if (i + CONCURRENCY < showsToProcess.length) {
      await sleep(DELAY_MS);
    }
  }

  console.log(`Done. Upserted ${totalUpserted} episodes.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
