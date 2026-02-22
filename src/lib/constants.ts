// Consumption-first hierarchy: What to watch (TV, Movies) | Where to eat (Spots)
export const SPOTS_PATH = "/spots" as const;
export const CONSUMPTION_TOP_LEVEL = [
  { id: "what-to-watch", label: "What to watch", slugs: ["tv", "movies"] as const },
  { id: "where-to-eat", label: "Where to eat", slugs: ["spots"] as const },
] as const;

export const CATEGORIES_YEAR_SCOPED = ["tv", "movies"] as const;
export type CategoryYearScoped = (typeof CATEGORIES_YEAR_SCOPED)[number];

export const CATEGORY_LABELS: Record<string, string> = {
  tv: "TV",
  movies: "Movies",
  spots: "Spots",
  food: "Food",
};

export const DEFAULT_YEAR = 2025;
export const YEARS = [2025, 2026] as const;

// Tier order for sorting (S best → Z worst)
export const TIER_ORDER = ["S", "A", "B", "C", "D", "F", "Z"] as const;
export type Tier = (typeof TIER_ORDER)[number];

// Warm-friendly tier colors for Ringer palette (readable on #E8E4E0 card)
export const TIER_COLORS: Record<Tier, string> = {
  S: "bg-accent text-white",
  A: "bg-violet-300 text-violet-900",
  B: "bg-blue-300 text-blue-900",
  C: "bg-emerald-300 text-emerald-900",
  D: "bg-orange-300 text-orange-900",
  F: "bg-red-300 text-red-900",
  Z: "bg-stat-label/30 text-foreground",
};

// Fixed tag set (from spec); can be extended via CSV
export const TAG_OPTIONS = [
  "Feel Something",
  "May Cry",
  "Enjoyed",
  "LOL Writers",
  "IRL LOL",
  "Bravo Writers",
  "Don't Watch",
  "Expired",
  "Forgettable",
  "Zeitgeist",
] as const;
