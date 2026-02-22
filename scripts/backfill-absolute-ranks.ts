/**
 * Backfills absolute_rank on Show rows per production year.
 * Uses a canonical ranked list per year. Run after seed.
 * Usage: pnpm run ranks:backfill   (runs for all years that have a list)
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** Ordered list of show names (best first). Rank 1 = index 0. Per production year. */
const RANKED_BY_YEAR: Record<number, readonly string[]> = {
  2025: [
    "Task",
    "The Pitt",
    "The Rehearsal",
    "Black Rabbit",
    "The Lowdown",
    "South Park",
    "Plur1bus",
    "Adolescence",
    "The Studio",
    "Severance",
    "White Lotus",
    "The Chair Company",
    "Beast And Me",
    "Tatsuki Fujimoto 17-26",
    "Yellowjackets",
    "Your Honor",
    "Squid Game",
    "Wednesday",
    "The Last of Us",
    "Wayward",
    "The Night Agent",
    "Hells Kitchen",
    "Stranger Things",
    "Andor",
    "Love is Blind",
    "Squid Game: The Challenge",
    "Righteous Gemstones",
    "The Penguin",
    "Silo",
    "Dept Q",
    "The Morning Show",
    "Running Point",
    "Alls Fair",
  ],
  2026: [
    "A Knight of the Seven Kingdoms",
    "The Pitt",
    "The Traitors (w/ Alan Cumming)",
  ],
};

/** List name -> name as stored in DB (for variants). Applied when matching. */
const NAME_OVERRIDE: Record<string, string> = {
  "The Rehearsal": "The Rehersal",
  "Beast And Me": "The Beast in Me",
  "Adolescence": "Adolesence",
};

async function backfillYear(year: number) {
  const list = RANKED_BY_YEAR[year];
  if (!list || list.length === 0) return;

  const shows = await prisma.show.findMany({
    where: { year },
    select: { id: true, name: true },
  });
  const byName = new Map(shows.map((s) => [s.name, s]));

  let updated = 0;
  for (let i = 0; i < list.length; i++) {
    const rank = i + 1;
    const listName = list[i];
    const dbName = NAME_OVERRIDE[listName] ?? listName;
    const show = byName.get(dbName);
    if (!show) {
      console.warn(`  [${year}] No show found for rank ${rank}: "${listName}" (DB name: "${dbName}")`);
      continue;
    }
    await prisma.show.update({
      where: { id: show.id },
      data: { absolute_rank: rank },
    });
    console.log(`  [${year}] ${rank}. ${show.name}`);
    updated++;
  }
  console.log(`  [${year}] Updated absolute_rank for ${updated} shows.\n`);
}

async function main() {
  const years = Object.keys(RANKED_BY_YEAR)
    .map(Number)
    .sort((a, b) => a - b);

  for (const year of years) {
    await backfillYear(year);
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
