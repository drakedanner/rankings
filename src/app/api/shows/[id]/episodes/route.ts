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

  const episodes = await prisma.episode.findMany({
    where: { showId: id },
    orderBy: [{ season: "asc" }, { number: "asc" }],
  });

  return Response.json(
    episodes.map((ep) => ({
      id: ep.id,
      name: ep.name,
      season: ep.season,
      number: ep.number,
      airdate: ep.airdate?.toISOString().slice(0, 10) ?? null,
      summary: ep.summary,
      runtime: ep.runtime,
      image_url: ep.image_url,
      rating: ep.rating != null ? Number(ep.rating) : null,
    }))
  );
}
