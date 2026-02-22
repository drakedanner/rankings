"use client";

import { useEffect, useState, useCallback } from "react";
import { Nav } from "@/components/nav";
import { FilterSidebar, type Depth } from "@/components/filter-sidebar";
import { ShowCard } from "@/components/show-card";
import { type Show } from "@/components/show-row";
import { TIER_ORDER } from "@/lib/constants";

function buildQuery(
  year: number,
  filters: {
    tiers: string[];
    networks: string[];
    tags: string[];
  }
) {
  const params = new URLSearchParams();
  params.set("year", String(year));
  if (filters.tiers.length) params.set("tier", filters.tiers.join(","));
  if (filters.networks.length) params.set("network", filters.networks.join(","));
  if (filters.tags.length) params.set("tag", filters.tags.join(","));
  params.set("sort", "absolute_rank");
  params.set("order", "asc");
  return params.toString();
}

export function YearRankings({
  year,
  currentPath,
}: {
  year: number;
  currentPath: string;
}) {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [depth, setDepth] = useState<Depth>("peruse");
  const [filterOptions, setFilterOptions] = useState<{
    networks: string[];
    tags: string[];
  }>({ networks: [], tags: [] });
  const [filters, setFilters] = useState({
    tiers: [] as string[],
    networks: [] as string[],
    tags: [] as string[],
  });
  const [filtersOpen, setFiltersOpen] = useState(false);

  const fetchShows = useCallback(
    async (queryString: string, filtersApplied: boolean) => {
      setLoading(true);
      try {
        const res = await fetch(`/api/shows?${queryString}`, { cache: "no-store" });
        if (!res.ok) throw new Error("Failed to fetch");
        const data = await res.json();
        const byAbsoluteRank = (a: Show, b: Show) =>
          (a.absolute_rank ?? 1e9) - (b.absolute_rank ?? 1e9);
        setShows((data as Show[]).slice().sort(byAbsoluteRank));
        if (!filtersApplied) {
          const networks = [...new Set((data as Show[]).map((s) => s.network).filter(Boolean))].sort();
          const tags = [...new Set((data as Show[]).flatMap((s) => s.tags))].sort();
          setFilterOptions({ networks, tags });
        }
      } catch (e) {
        console.error(e);
        setShows([]);
      } finally {
        setLoading(false);
      }
    },
    [year]
  );

  useEffect(() => {
    const q = buildQuery(year, filters);
    const filtersApplied =
      filters.tiers.length > 0 || filters.networks.length > 0 || filters.tags.length > 0;
    fetchShows(q, filtersApplied);
  }, [year, filters, fetchShows]);

  const onTierToggle = (tier: string) => {
    setFilters((prev) => ({
      ...prev,
      tiers: prev.tiers.includes(tier) ? prev.tiers.filter((t) => t !== tier) : [...prev.tiers, tier],
    }));
  };
  const onNetworkToggle = (network: string) => {
    setFilters((prev) => ({
      ...prev,
      networks: prev.networks.includes(network)
        ? prev.networks.filter((n) => n !== network)
        : [...prev.networks, network],
    }));
  };
  const onTagToggle = (tag: string) => {
    setFilters((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag) ? prev.tags.filter((t) => t !== tag) : [...prev.tags, tag],
    }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Nav currentPath={currentPath} />
      <div className="flex">
        <FilterSidebar
          depth={depth}
          onDepthChange={setDepth}
          selectedTiers={filters.tiers}
          selectedNetworks={filters.networks}
          selectedTags={filters.tags}
          tierOptions={TIER_ORDER}
          networkOptions={filterOptions.networks}
          tagOptions={filterOptions.tags}
          onTierToggle={onTierToggle}
          onNetworkToggle={onNetworkToggle}
          onTagToggle={onTagToggle}
          onClear={() => setFilters({ tiers: [], networks: [], tags: [] })}
          drawerOpen={filtersOpen}
          onDrawerClose={() => setFiltersOpen(false)}
        />
        <main className="min-w-0 flex-1 px-3 py-4 sm:px-4">
          <button
            type="button"
            onClick={() => setFiltersOpen(true)}
            className="mb-3 rounded bg-card px-3 py-2 text-sm font-medium text-foreground hover:bg-[var(--secondary)]/20 lg:hidden"
          >
            Filters
          </button>
          {loading ? (
            <p className="text-sm text-secondary">Loading…</p>
          ) : shows.length === 0 ? (
            <p className="text-sm text-secondary">No shows match the filters.</p>
          ) : (
            <div className="grid grid-cols-1 gap-2 lg:grid-cols-3 2xl:grid-cols-6">
              {shows.map((show) => (
                <ShowCard
                  key={show.id}
                  show={show}
                  rank={show.absolute_rank ?? null}
                  depth={depth}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
