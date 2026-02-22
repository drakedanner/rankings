"use client";

import { useState } from "react";
import Image from "next/image";
import { TierBadge } from "./tier-badge";
import { TagPill } from "./tag-pill";
import { PlaceholderCover } from "./placeholder-cover";

export type Show = {
  id: string;
  name: string;
  season: number;
  network: string;
  tags: string[];
  score: number;
  tier: string;
  absolute_rank?: number | null;
  description: string | null;
  cover_url: string | null;
  tvmaze_rating?: number | null;
};

export function ShowRow({ show, rank }: { show: Show; rank: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <>
      <tr
        onClick={() => setExpanded((e) => !e)}
        className="cursor-pointer border-b border-zinc-100 transition-colors hover:bg-zinc-50"
      >
        <td className="w-12 py-3 pl-4 text-right text-sm text-zinc-500 tabular-nums">{rank}</td>
        <td className="py-3 pr-2 font-medium text-zinc-900">{show.name}</td>
        <td className="py-3 pr-2 text-sm text-zinc-600 tabular-nums">{show.season || "—"}</td>
        <td className="py-3 pr-2 text-sm text-zinc-600">{show.network || "—"}</td>
        <td className="py-3 pr-2 text-sm tabular-nums text-zinc-700">{show.score}</td>
        <td className="py-3 pr-2">
          <TierBadge tier={show.tier} />
        </td>
        <td className="py-3 pl-2 pr-4">
          <div className="flex flex-wrap gap-1">
            {show.tags.slice(0, 4).map((tag) => (
              <TagPill key={tag} tag={tag} />
            ))}
            {show.tags.length > 4 && (
              <span className="text-xs text-zinc-400">+{show.tags.length - 4}</span>
            )}
          </div>
        </td>
      </tr>
      {expanded && (
        <tr className="border-b border-zinc-200 bg-zinc-50/80">
          <td colSpan={7} className="p-4">
            <div className="flex gap-6">
              <div className="w-32 shrink-0">
                {show.cover_url ? (
                  <div className="relative aspect-[2/3] overflow-hidden rounded-lg">
                    <Image
                      src={show.cover_url}
                      alt={show.name}
                      fill
                      className="object-cover"
                      sizes="128px"
                      unoptimized
                    />
                  </div>
                ) : (
                  <PlaceholderCover name={show.name} tier={show.tier} />
                )}
              </div>
              <div className="min-w-0 flex-1">
                {show.description && (
                  <p className="mb-3 text-sm leading-relaxed text-zinc-700">{show.description}</p>
                )}
                <div className="flex flex-wrap gap-1.5">
                  {show.tags.map((tag) => (
                    <TagPill key={tag} tag={tag} />
                  ))}
                </div>
              </div>
            </div>
          </td>
        </tr>
      )}
    </>
  );
}
