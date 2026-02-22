/**
 * Backfills absolute_rank on Show rows using the canonical ranked list.
 * Run after applying the add_absolute_rank migration. Uses a name override map
 * so DB names that differ from the list (e.g. "The Rehersal") still match.
 */

import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** Ordered list of 33 show names (rank 1 = index 0). */
const RANKED_SHOW_NAMES = [
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
] as const;

/** List name -> name as stored in DB (for variants). */
const NAME_OVERRIDE: Record<string, string> = {
  "The Rehearsal": "The Rehersal",
  "Beast And Me": "The Beast in Me",
  "Adolescence": "Adolesence",
};

async function main() {
  const shows = await prisma.show.findMany({ select: { id: true, name: true } });
  const byName = new Map(shows.map((s) => [s.name, s]));

  let updated = 0;
  for (let i = 0; i < RANKED_SHOW_NAMES.length; i++) {
    const rank = i + 1;
    const listName = RANKED_SHOW_NAMES[i];
    const dbName = NAME_OVERRIDE[listName] ?? listName;
    const show = byName.get(dbName);
    if (!show) {
      console.warn(`  No show found for rank ${rank}: "${listName}" (DB name: "${dbName}")`);
      continue;
    }
    await prisma.show.update({
      where: { id: show.id },
      data: { absolute_rank: rank },
    });
    console.log(`  ${rank}. ${show.name}`);
    updated++;
  }

  console.log(`\nUpdated absolute_rank for ${updated} shows.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
