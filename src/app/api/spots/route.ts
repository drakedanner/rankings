import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const spots = await prisma.spot.findMany({
    orderBy: { name: "asc" },
  });
  const payload = spots.map((s) => ({
    id: s.id,
    name: s.name,
    tagline: s.tagline,
    neighborhood: s.neighborhood,
    city: s.city,
  }));
  return Response.json(payload);
}
