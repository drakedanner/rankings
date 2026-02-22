"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Nav } from "@/components/nav";

type Spot = {
  id: string;
  name: string;
  tagline: string;
  neighborhood: string | null;
  city: string;
};

export default function SpotsPage() {
  const [spots, setSpots] = useState<Spot[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/spots", { cache: "no-store" })
      .then((res) => res.json())
      .then((data) => setSpots(data))
      .catch(() => setSpots([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen bg-background">
      <Nav currentPath="/spots" />
      <main className="mx-auto max-w-2xl px-4 py-8 sm:px-6">
        <h1 className="font-serif text-2xl font-bold text-foreground">Boston</h1>
        <p className="mt-1 text-sm text-secondary">Where to eat — ongoing list.</p>
        {loading ? (
          <p className="mt-6 text-sm text-secondary">Loading…</p>
        ) : spots.length === 0 ? (
          <p className="mt-6 text-sm text-secondary">No spots yet. Run the seed to add Boston spots.</p>
        ) : (
          <ul className="mt-6 space-y-2">
            {spots.map((spot) => (
              <li
                key={spot.id}
                className="flex items-baseline justify-between gap-3 rounded-lg border border-[var(--border)] bg-card px-4 py-3"
              >
                <span className="font-medium text-foreground">{spot.name}</span>
                <span className="text-sm text-secondary">
                  {spot.tagline}
                  {spot.neighborhood ? ` · ${spot.neighborhood}` : ""}
                </span>
              </li>
            ))}
          </ul>
        )}
        <Link
          href="/tv/2025"
          className="mt-8 inline-block text-sm font-medium text-foreground underline hover:no-underline"
        >
          ← What to watch
        </Link>
      </main>
    </div>
  );
}
