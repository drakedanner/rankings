import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";
import { TIER_ORDER } from "@/lib/constants";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const tierParam = searchParams.get("tier");
  const networkParam = searchParams.get("network");
  const tagParam = searchParams.get("tag");
  const sort = searchParams.get("sort") ?? "tier,score";
  const order = searchParams.get("order") ?? "desc";

  const tiers = tierParam ? tierParam.split(",").map((t) => t.trim()).filter(Boolean) : [];
  const networks = networkParam ? networkParam.split(",").map((n) => n.trim()).filter(Boolean) : [];
  const tags = tagParam ? tagParam.split(",").map((t) => t.trim()).filter(Boolean) : [];

  const where: {
    tier?: { in: string[] };
    network?: { in: string[] };
    tags?: { hasSome: string[] };
  } = {};

  if (tiers.length > 0) where.tier = { in: tiers };
  if (networks.length > 0) where.network = { in: networks };
  if (tags.length > 0) where.tags = { hasSome: tags };

  const shows = await prisma.show.findMany({
    where: Object.keys(where).length ? where : undefined,
    orderBy: { score: order === "asc" ? "asc" : "desc" },
  });

  // Sort by tier order then score (Prisma can't do custom tier order)
  const tierRank = (t: string) => TIER_ORDER.indexOf(t as (typeof TIER_ORDER)[number]);
  const sorted =
    sort === "tier,score" || !sort
      ? [...shows].sort((a, b) => {
          const ta = tierRank(a.tier);
          const tb = tierRank(b.tier);
          if (ta !== tb) return ta - tb;
          return order === "asc" ? Number(a.score) - Number(b.score) : Number(b.score) - Number(a.score);
        })
      : shows;

  const payload = sorted.map((s) => ({
    id: s.id,
    name: s.name,
    season: s.season,
    network: s.network,
    tags: s.tags,
    score: Number(s.score),
    tier: s.tier,
    description: s.description,
    cover_url: s.cover_url,
    created_at: s.created_at,
    updated_at: s.updated_at,
  }));

  return Response.json(payload);
}
