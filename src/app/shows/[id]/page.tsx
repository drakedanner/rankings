import Image from "next/image";
import { notFound } from "next/navigation";
import { EpisodeList } from "@/components/episode-list";
import { Nav } from "@/components/nav";
import { PlaceholderCover } from "@/components/placeholder-cover";
import { TagPill } from "@/components/tag-pill";
import { TierBadge } from "@/components/tier-badge";
import { prisma } from "@/lib/db";

type Props = { params: Promise<{ id: string }> };

export default async function ShowPage({ params }: Props) {
  const { id } = await params;
  const show = await prisma.show.findUnique({
    where: { id },
  });
  if (!show) {
    notFound();
  }

  const score = Number(show.score);
  const tvmazeRating = show.tvmaze_rating != null ? Number(show.tvmaze_rating) : null;

  return (
    <div className="min-h-screen bg-background">
      <Nav currentPath={`/shows/${id}`} />
      <main className="mx-auto max-w-4xl px-3 py-4 sm:px-4">
        <div className="flex flex-col gap-6 lg:flex-row lg:gap-8">
          {/* Cover */}
          <div className="relative h-auto w-full shrink-0 overflow-hidden rounded-sm bg-card aspect-[3/4] max-w-xs">
            {show.cover_url ? (
              <Image
                src={show.cover_url}
                alt=""
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 320px"
                unoptimized
              />
            ) : (
              <div className="absolute inset-0 flex items-center justify-center p-4">
                <PlaceholderCover name={show.name} tier={show.tier} />
              </div>
            )}
          </div>

          {/* Info block */}
          <div className="min-w-0 flex-1 space-y-4">
            <h1 className="font-serif text-2xl font-bold text-foreground sm:text-3xl">
              {show.name}
            </h1>
            <p className="text-sm text-secondary">
              {[show.network, show.season ? `S${show.season}` : null]
                .filter(Boolean)
                .join(" · ") || "—"}
            </p>
            <div className="flex flex-wrap items-center gap-2">
              <TierBadge tier={show.tier} />
              <span className="font-mono text-lg font-bold tabular-nums text-foreground">
                {score}
              </span>
              <span className="text-xs uppercase tracking-wider text-stat-label">Score</span>
              {tvmazeRating != null && (
                <>
                  <span className="font-mono text-lg font-bold tabular-nums text-foreground">
                    {tvmazeRating.toFixed(1)}
                  </span>
                  <span className="text-xs uppercase tracking-wider text-stat-label">
                    TVMaze
                  </span>
                </>
              )}
            </div>
            <div className="flex flex-wrap gap-1.5">
              {show.tags.map((tag) => (
                <TagPill key={tag} tag={tag} />
              ))}
            </div>
            {show.description && (
              <div className="pt-2">
                <h2 className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-stat-label">
                  Scouting Report
                </h2>
                <p className="text-sm leading-relaxed text-foreground">{show.description}</p>
              </div>
            )}
          </div>
        </div>

        <section className="mt-10 border-t border-[var(--secondary)]/20 pt-8">
          <h2 className="mb-4 font-serif text-lg font-bold text-foreground">
            Episodes
          </h2>
          <EpisodeList showId={id} />
        </section>
      </main>
    </div>
  );
}
