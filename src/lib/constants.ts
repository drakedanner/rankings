// Tier order for sorting (S best → Z worst)
export const TIER_ORDER = ["S", "A", "B", "C", "D", "F", "Z"] as const;
export type Tier = (typeof TIER_ORDER)[number];

export const TIER_COLORS: Record<Tier, string> = {
  S: "bg-amber-400 text-amber-950",
  A: "bg-violet-400 text-violet-950",
  B: "bg-blue-400 text-blue-950",
  C: "bg-emerald-400 text-emerald-950",
  D: "bg-orange-400 text-orange-950",
  F: "bg-red-400 text-red-950",
  Z: "bg-zinc-400 text-zinc-950",
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
