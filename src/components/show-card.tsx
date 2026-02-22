"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { TagPill } from "./tag-pill";
import { PlaceholderCover } from "./placeholder-cover";
import type { Show } from "./show-row";

export type Depth = "skim" | "peruse" | "deep";

type ShowCardProps = {
  show: Show;
  rank: number | null;
  depth: Depth;
};

function truncate(str: string, maxLength: number): string {
  if (str.length <= maxLength) return str;
  return str.slice(0, maxLength).trim() + "…";
}

export function ShowCard({ show, rank, depth }: ShowCardProps) {
  const [reportExpanded, setReportExpanded] = useState(false);

  const archetypeBold = show.tags[0] ?? show.name;
  const archetypeRest = show.description
    ? " — " + truncate(show.description, 120)
    : "";

  const showStatBlock = depth === "peruse" || depth === "deep";
  const showDescriptionTruncated = depth === "peruse" && show.description;
  const showDescriptionFull = depth === "deep" && show.description;

  const imageSizes =
    "(max-width: 1023px) 80px, (min-width: 1536px) 16.67vw, (min-width: 1024px) 33.33vw, 100vw";

  return (
    <Link
      href={`/shows/${show.id}`}
      className="block"
      aria-label={`${show.name}, link to show page`}
    >
      <article className="flex overflow-hidden rounded-sm bg-background lg:flex-col">
      {/* Image: horizontal strip on mobile, cropped top block on desktop */}
      <div className="group relative w-20 shrink-0 aspect-[3/4] bg-card lg:w-full lg:aspect-[3/4] lg:min-h-0">
        {show.cover_url ? (
          <Image
            src={show.cover_url}
            alt=""
            fill
            className="object-cover"
            sizes={imageSizes}
            unoptimized
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center p-2 lg:p-4">
            <PlaceholderCover name={show.name} tier={show.tier} />
          </div>
        )}
        {/* Desktop-only hover overlay: absolute rank = position in full list (1 = best), not score */}
        <div
          className="pointer-events-none absolute inset-0 flex items-center justify-center bg-neutral-800/60 opacity-0 transition-opacity duration-200 lg:group-hover:opacity-100"
          aria-hidden
        >
          <span className="font-mono text-5xl font-bold tabular-nums text-white lg:text-6xl">
            {rank != null ? `${rank}` : "—"}
          </span>
        </div>
        <div className="absolute bottom-1 left-1 flex items-center gap-1 lg:bottom-1.5 lg:left-1.5 lg:gap-1.5">
          <span
            className="flex h-6 w-6 items-center justify-center rounded-full bg-header-bar font-mono text-[10px] font-bold tabular-nums text-white lg:h-7 lg:w-7 lg:text-xs"
            aria-label={rank != null ? `Rank ${rank} in full list` : "Unranked"}
            title={rank != null ? `Position ${rank} in full ranking` : undefined}
          >
            {rank != null ? `${rank}` : "—"}
          </span>
          <span className="rounded bg-header-bar/95 px-1 py-0.5 text-[10px] font-medium uppercase tracking-wider text-white backdrop-blur-sm lg:px-1.5 lg:py-0.5 lg:text-xs">
            Tier {show.tier}
          </span>
        </div>
      </div>

      {/* Content: compact for grid density */}
      <div className="flex min-w-0 flex-1 flex-col gap-1.5 p-2 lg:gap-2 lg:p-3">
        <h2 className="font-serif text-sm font-bold leading-tight text-foreground lg:text-base">
          {show.name}
        </h2>
        <p className="text-[10px] text-secondary lg:text-xs">
          {[show.network, show.season ? `S${show.season}` : null]
            .filter(Boolean)
            .join(" · ") || "—"}
        </p>
        <p className="line-clamp-2 text-xs leading-snug text-foreground lg:line-clamp-none">
          <span className="font-bold">{archetypeBold}</span>
          {archetypeRest && (
            <span className="text-secondary">{archetypeRest}</span>
          )}
        </p>
        <div className="flex flex-wrap gap-1">
          {show.tags.slice(0, 3).map((tag) => (
            <TagPill key={tag} tag={tag} />
          ))}
          {show.tags.length > 3 && (
            <span className="text-[10px] text-stat-label">+{show.tags.length - 3}</span>
          )}
        </div>

        {showStatBlock && (
          <div className="grid grid-cols-2 gap-2 pt-1 lg:grid-cols-4 lg:gap-3 lg:pt-2">
            <div>
              <div className="font-mono text-lg font-bold tabular-nums text-foreground lg:text-xl">
                {show.score}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-stat-label lg:text-xs">
                Score
              </div>
            </div>
            <div>
              <div className="font-serif text-base font-bold text-foreground lg:text-lg">
                {show.tier}
              </div>
              <div className="text-[10px] uppercase tracking-wider text-stat-label lg:text-xs">
                Tier
              </div>
            </div>
            {show.tvmaze_rating != null && (
              <div>
                <div className="font-mono text-lg font-bold tabular-nums text-foreground lg:text-xl">
                  {show.tvmaze_rating.toFixed(1)}
                </div>
                <div className="text-[10px] uppercase tracking-wider text-stat-label lg:text-xs">
                  TVMaze
                </div>
              </div>
            )}
          </div>
        )}

        {showDescriptionTruncated && show.description && (
          <p className="line-clamp-2 pt-0.5 text-xs leading-relaxed text-foreground lg:line-clamp-none lg:pt-1 lg:text-sm">
            {truncate(show.description, 300)}
          </p>
        )}

        {showDescriptionFull && (
          <div className="pt-1 lg:pt-2">
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setReportExpanded((prev) => !prev);
              }}
              className="flex w-full items-center justify-between gap-2 text-left text-[10px] font-medium uppercase tracking-wider text-stat-label hover:text-foreground lg:text-xs"
            >
              <span>Scouting Report</span>
              <span className="shrink-0" aria-hidden>
                {reportExpanded ? "↑" : "↓"}
              </span>
            </button>
            <div
              className={`grid transition-[grid-template-rows] duration-200 ease-out ${
                reportExpanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
              }`}
            >
              <div className="overflow-hidden">
                <div className="pt-1.5 text-xs text-foreground leading-relaxed lg:pt-2 lg:text-sm">
                  {show.description}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </article>
    </Link>
  );
}
