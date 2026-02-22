import { TIER_COLORS, type Tier } from "@/lib/constants";

export function PlaceholderCover({ name, tier }: { name: string; tier: string }) {
  const style = TIER_COLORS[tier as Tier] ?? "bg-zinc-200 text-zinc-700";
  return (
    <div
      className={`flex aspect-[2/3] min-h-[120px] items-center justify-center rounded-lg ${style} p-3 text-center text-sm font-medium`}
    >
      {name}
    </div>
  );
}
