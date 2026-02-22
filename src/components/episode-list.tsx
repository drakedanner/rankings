"use client";

import { useEffect, useState } from "react";

export type Episode = {
  id: string;
  name: string;
  season: number;
  number: number;
  airdate: string | null;
  summary: string | null;
  runtime: number | null;
  image_url: string | null;
  rating: number | null;
};

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, " ").replace(/\s+/g, " ").trim();
}

export function EpisodeList({ showId }: { showId: string }) {
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const res = await fetch(`/api/shows/${showId}/episodes`);
        if (!res.ok) {
          if (res.status === 404) {
            setEpisodes([]);
            return;
          }
          throw new Error("Failed to load episodes");
        }
        const data = await res.json();
        if (!cancelled) setEpisodes(data);
      } catch (e) {
        if (!cancelled) setError((e as Error).message);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, [showId]);

  if (loading) {
    return (
      <p className="text-sm text-secondary">Loading episodes…</p>
    );
  }
  if (error) {
    return (
      <p className="text-sm text-secondary">Could not load episodes: {error}</p>
    );
  }
  if (episodes.length === 0) {
    return (
      <p className="text-sm text-secondary">
        No episodes for this season yet, or episode data has not been synced. Run{" "}
        <code className="rounded bg-[var(--secondary)]/20 px-1 py-0.5 font-mono text-xs">
          npm run episodes:fetch
        </code>{" "}
        to sync from TVMaze.
      </p>
    );
  }

  const bySeason = episodes.reduce<Record<number, Episode[]>>((acc, ep) => {
    if (!acc[ep.season]) acc[ep.season] = [];
    acc[ep.season].push(ep);
    return acc;
  }, {});
  const seasons = Object.keys(bySeason)
    .map(Number)
    .sort((a, b) => a - b);

  return (
    <div className="space-y-6">
      {seasons.map((seasonNum) => (
        <div key={seasonNum}>
          <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-stat-label">
            Season {seasonNum}
          </h3>
          <ul className="space-y-3">
            {bySeason[seasonNum].map((ep) => (
              <EpisodeItem key={ep.id} episode={ep} stripHtml={stripHtml} />
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function EpisodeItem({
  episode: ep,
  stripHtml,
}: {
  episode: Episode;
  stripHtml: (html: string) => string;
}) {
  return (
    <li className="rounded-sm border border-[var(--secondary)]/20 bg-card/50 p-3 text-sm">
      <div className="flex flex-wrap items-baseline gap-2">
        <span className="font-mono text-xs tabular-nums text-secondary">
          S{ep.season}E{String(ep.number).padStart(2, "0")}
        </span>
        <span className="font-medium text-foreground">{ep.name}</span>
        {ep.airdate && (
          <span className="text-xs text-secondary">{ep.airdate}</span>
        )}
        {ep.runtime != null && (
          <span className="text-xs text-secondary">{ep.runtime} min</span>
        )}
      </div>
      {ep.rating != null && (
        <div className="mt-1 flex items-baseline gap-1.5">
          <span className="text-[10px] uppercase tracking-wider text-stat-label">
            Score
          </span>
          <span className="font-mono text-sm font-semibold tabular-nums text-foreground">
            {ep.rating.toFixed(1)}
          </span>
        </div>
      )}
      {ep.summary && (
        <p className="mt-1.5 line-clamp-2 text-secondary">
          {stripHtml(ep.summary)}
        </p>
      )}
    </li>
  );
}
