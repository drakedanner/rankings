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
