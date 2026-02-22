import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

const TIER_ORDER = ["S", "A", "B", "C", "D", "F", "Z"] as const;

function parseCsvRow(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const c = line[i];
    if (c === '"') {
      inQuotes = !inQuotes;
    } else if ((c === "," && !inQuotes) || (c === "\n" && !inQuotes)) {
      result.push(current.trim());
      current = "";
      if (c === "\n") break;
    } else {
      current += c;
    }
  }
  if (current.length > 0) result.push(current.trim());
  return result;
}

function findHeaderIndex(header: string[], names: string[]): number {
  const lower = header.map((h) => h.trim().toLowerCase());
  for (const name of names) {
    const i = lower.indexOf(name.toLowerCase());
    if (i !== -1) return i;
  }
  return -1;
}

/** Parse season as first number (handles "27", "27, 28", or empty -> 0) */
function parseSeason(val: string): number {
  const trimmed = val.trim();
  if (!trimmed) return 0;
  const num = parseInt(trimmed, 10);
  return isNaN(num) ? 0 : num;
}

/** Tags can be comma- or pipe-delimited, with or without quotes */
function parseTags(val: string): string[] {
  const normalized = val.replace(/\|/g, ",");
  return normalized
    .split(",")
    .map((t) => t.trim())
    .filter(Boolean);
}

async function main() {
  const csvPath = path.join(__dirname, "data", "shows.csv");
  if (!fs.existsSync(csvPath)) {
    console.error("Missing prisma/data/shows.csv");
    process.exit(1);
  }

  const content = fs.readFileSync(csvPath, "utf-8");
  const lines = content.split(/\r?\n/).filter((line) => line.trim());
  if (lines.length < 2) {
    console.error("CSV must have header + at least one row");
    process.exit(1);
  }

  const header = parseCsvRow(lines[0]);
  const nameIdx = findHeaderIndex(header, ["name", "show"]);
  const seasonIdx = findHeaderIndex(header, ["season"]);
  const networkIdx = findHeaderIndex(header, ["network"]);
  const tagsIdx = findHeaderIndex(header, ["tags"]);
  const scoreIdx = findHeaderIndex(header, ["score"]);
  const tierIdx = findHeaderIndex(header, ["tier"]);
  const yearIdx = findHeaderIndex(header, ["year"]);
  const categoryIdx = findHeaderIndex(header, ["category", "type"]);

  if (nameIdx === -1 || seasonIdx === -1 || networkIdx === -1 || tagsIdx === -1 || scoreIdx === -1 || tierIdx === -1) {
    console.error("CSV must have columns: name (or Show), season, network, tags, score, tier");
    process.exit(1);
  }

  let descriptions: Record<string, string> = {};
  const descriptionsPath = path.join(__dirname, "data", "descriptions.json");
  if (fs.existsSync(descriptionsPath)) {
    descriptions = JSON.parse(fs.readFileSync(descriptionsPath, "utf-8")) as Record<string, string>;
  }

  await prisma.show.deleteMany();

  let created = 0;
  for (let i = 1; i < lines.length; i++) {
    const values = parseCsvRow(lines[i]);
    const name = values[nameIdx]?.trim();
    const tier = values[tierIdx]?.trim();

    if (!name || !tier || !(TIER_ORDER as readonly string[]).includes(tier)) continue;

    const score = parseFloat(values[scoreIdx] ?? "");
    if (isNaN(score) || score < 0 || score > 10) continue;

    const season = parseSeason(values[seasonIdx] ?? "0");
    const network = values[networkIdx]?.trim() ?? "";
    const tags = parseTags(values[tagsIdx] ?? "");
    const description = descriptions[name]?.trim() || null;
    const yearVal = yearIdx >= 0 ? values[yearIdx]?.trim() : "";
    const year = yearVal ? Math.min(2100, Math.max(2000, parseInt(yearVal, 10) || 2025)) : 2025;
    const categoryVal = categoryIdx >= 0 ? values[categoryIdx]?.trim().toLowerCase() : "";
    const category = categoryVal === "movies" ? "movies" : "tv";

    await prisma.show.create({
      data: {
        name,
        season,
        network,
        tags,
        score,
        tier,
        year,
        category,
        description,
      },
    });
    created++;
  }

  console.log(`Seeded ${created} shows.`);

  // Boston spots (Where to eat)
  const bostonSpots = [
    { name: "Worden Hall", tagline: "deep dish pizza", neighborhood: null, latitude: 42.3376, longitude: -71.0494 },
    { name: "Grays Hall", tagline: "burger and wine bar", neighborhood: null, latitude: 42.3385, longitude: -71.05 },
    { name: "Sam La Grassas", tagline: "sandwiches", neighborhood: null, latitude: 42.3647, longitude: -71.0544 },
    { name: "Vino teca", tagline: "wine bar", neighborhood: "North End", latitude: 42.365, longitude: -71.055 },
    { name: "Crazy Good Kitchen", tagline: "comfort food", neighborhood: null, latitude: 42.35, longitude: -71.06 },
    { name: "Capital Burger", tagline: "burgers", neighborhood: null, latitude: 42.355, longitude: -71.058 },
    { name: "Small Victories", tagline: "cafe", neighborhood: null, latitude: 42.362, longitude: -71.052 },
  ];
  await prisma.spot.deleteMany();
  for (const s of bostonSpots) {
    await prisma.spot.create({
      data: {
        name: s.name,
        tagline: s.tagline,
        neighborhood: s.neighborhood ?? undefined,
        city: "Boston",
        latitude: s.latitude,
        longitude: s.longitude,
      },
    });
  }
  console.log(`Seeded ${bostonSpots.length} spots (Boston).`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
