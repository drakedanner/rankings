import { TIER_COLORS, type Tier } from "@/lib/constants";

export function TierBadge({ tier }: { tier: string }) {
  const style = TIER_COLORS[tier as Tier] ?? "bg-stat-label/30 text-foreground";
  return (
    <span
      className={`inline-flex items-center rounded px-2 py-0.5 text-xs font-semibold ${style}`}
      title={`Tier ${tier}`}
    >
      {tier}
    </span>
  );
}
