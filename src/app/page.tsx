"use client";

import { useEffect, useState, useCallback } from "react";
import { Nav } from "@/components/nav";
import { FilterBar } from "@/components/filter-bar";
import { ShowRow, type Show } from "@/components/show-row";
import { TIER_ORDER } from "@/lib/constants";

function buildQuery(filters: {
  tiers: string[];
  networks: string[];
  tags: string[];
}) {
  const params = new URLSearchParams();
  if (filters.tiers.length) params.set("tier", filters.tiers.join(","));
  if (filters.networks.length) params.set("network", filters.networks.join(","));
  if (filters.tags.length) params.set("tag", filters.tags.join(","));
  params.set("sort", "tier,score");
  params.set("order", "desc");
  return params.toString();
}

export default function Home() {
  const [shows, setShows] = useState<Show[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterOptions, setFilterOptions] = useState<{
    networks: string[];
    tags: string[];
  }>({ networks: [], tags: [] });
  const [filters, setFilters] = useState({
    tiers: [] as string[],
    networks: [] as string[],
    tags: [] as string[],
  });

  const fetchShows = useCallback(async (queryString: string, filtersApplied: boolean) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/shows?${queryString}`);
      if (!res.ok) throw new Error("Failed to fetch");
      const data = await res.json();
      setShows(data);
      // Derive filter options from unfiltered response
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
  }, []);

  useEffect(() => {
    const q = buildQuery(filters);
    const filtersApplied = filters.tiers.length > 0 || filters.networks.length > 0 || filters.tags.length > 0;
    fetchShows(q, filtersApplied);
  }, [filters, fetchShows]);

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
    <div className="min-h-screen bg-[#FAFAF9]">
      <Nav currentPath="/" />
      <FilterBar
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
      />
      <main className="mx-auto max-w-5xl px-4 py-6 sm:px-6">
        {loading ? (
          <p className="text-sm text-zinc-500">Loading…</p>
        ) : shows.length === 0 ? (
          <p className="text-sm text-zinc-500">No shows match the filters.</p>
        ) : (
          <div className="overflow-hidden rounded-lg border border-zinc-200 bg-white shadow-sm">
            <table className="w-full table-fixed sm:table-auto">
              <thead>
                <tr className="border-b border-zinc-200 bg-zinc-50/80">
                  <th className="w-12 py-2.5 pl-4 text-right text-xs font-medium uppercase tracking-wider text-zinc-500">
                    #
                  </th>
                  <th className="py-2.5 pr-2 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Show
                  </th>
                  <th className="py-2.5 pr-2 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Season
                  </th>
                  <th className="py-2.5 pr-2 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Network
                  </th>
                  <th className="py-2.5 pr-2 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Score
                  </th>
                  <th className="py-2.5 pr-2 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Tier
                  </th>
                  <th className="py-2.5 pl-2 pr-4 text-left text-xs font-medium uppercase tracking-wider text-zinc-500">
                    Tags
                  </th>
                </tr>
              </thead>
              <tbody>
                {shows.map((show, index) => (
                  <ShowRow key={show.id} show={show} rank={index + 1} />
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
