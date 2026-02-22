import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { TIER_ORDER } from "@/lib/constants";

export const dynamic = "force-dynamic";

const DEFAULT_YEAR = 2025;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const yearParam = searchParams.get("year");
  const year = yearParam ? Math.min(2100, Math.max(2000, parseInt(yearParam, 10) || DEFAULT_YEAR)) : DEFAULT_YEAR;

  const tierParam = searchParams.get("tier");
  const networkParam = searchParams.get("network");
  const tagParam = searchParams.get("tag");
  const sort = searchParams.get("sort") ?? "absolute_rank";
  const orderParam = searchParams.get("order") ?? "asc";
  const order = sort === "absolute_rank" ? "asc" : orderParam;

  const tiers = tierParam ? tierParam.split(",").map((t) => t.trim()).filter(Boolean) : [];
  const networks = networkParam ? networkParam.split(",").map((n) => n.trim()).filter(Boolean) : [];
  const tags = tagParam ? tagParam.split(",").map((t) => t.trim()).filter(Boolean) : [];

  const where: {
    year: number;
    tier?: { in: string[] };
    network?: { in: string[] };
    tags?: { hasSome: string[] };
  } = { year };

  if (tiers.length > 0) where.tier = { in: tiers };
  if (networks.length > 0) where.network = { in: networks };
  if (tags.length > 0) where.tags = { hasSome: tags };

  const orderBy =
    sort === "absolute_rank"
      ? { absolute_rank: "asc" as const }
      : { score: order === "asc" ? ("asc" as const) : ("desc" as const) };

  const shows = await prisma.show.findMany({
    where,
    orderBy,
  });

  const tierRank = (t: string) => TIER_ORDER.indexOf(t as (typeof TIER_ORDER)[number]);
  let sorted = shows;
  if (sort === "absolute_rank") {
    sorted = [...shows].sort((a, b) => {
      const ra = a.absolute_rank ?? 1e9;
      const rb = b.absolute_rank ?? 1e9;
      return ra - rb;
    });
  } else if (sort === "tier,score" || !sort) {
    sorted = [...shows].sort((a, b) => {
      const ta = tierRank(a.tier);
      const tb = tierRank(b.tier);
      if (ta !== tb) return ta - tb;
      return order === "asc" ? Number(a.score) - Number(b.score) : Number(b.score) - Number(a.score);
    });
  }

  // absolute_rank = position in the full canonical list (1 = best, 2 = second, …). Used for
  // display order and the rank badge. score = quality rating 0–10, shown as "SCORE" in the UI.
  const payload = sorted.map((s) => ({
    id: s.id,
    name: s.name,
    season: s.season,
    network: s.network,
    tags: s.tags,
    score: Number(s.score),
    tier: s.tier,
    year: s.year,
    absolute_rank: s.absolute_rank,
    description: s.description,
    cover_url: s.cover_url,
    tvmaze_rating: s.tvmaze_rating != null ? Number(s.tvmaze_rating) : null,
    created_at: s.created_at,
    updated_at: s.updated_at,
  }));

  return Response.json(payload);
}
