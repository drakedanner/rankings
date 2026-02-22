import { prisma } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const spots = await prisma.spot.findMany({
    orderBy: { created_at: "asc" },
  });
  const payload = spots.map((s) => ({
    id: s.id,
    name: s.name,
    tagline: s.tagline,
    neighborhood: s.neighborhood,
    city: s.city,
    latitude: s.latitude,
    longitude: s.longitude,
  }));
  return Response.json(payload);
}
