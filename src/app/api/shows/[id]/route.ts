import { NextRequest } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const show = await prisma.show.findUnique({
    where: { id },
  });
  if (!show) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
  return Response.json({
    id: show.id,
    name: show.name,
    season: show.season,
    network: show.network,
    tags: show.tags,
    score: Number(show.score),
    tier: show.tier,
    description: show.description,
    cover_url: show.cover_url,
    tvmaze_rating: show.tvmaze_rating != null ? Number(show.tvmaze_rating) : null,
    created_at: show.created_at,
    updated_at: show.updated_at,
  });
}
