import Link from "next/link";
import {
  CONSUMPTION_TOP_LEVEL,
  CATEGORY_LABELS,
  CATEGORIES_YEAR_SCOPED,
  YEARS,
  DEFAULT_YEAR,
  SPOTS_PATH,
} from "@/lib/constants";

type NavProps = {
  currentPath: string;
  category?: string;
  year?: number;
};

function getConsumptionContext(currentPath: string, category?: string): string | null {
  if (category && CATEGORIES_YEAR_SCOPED.includes(category as "tv" | "movies")) return "what-to-watch";
  if (currentPath === SPOTS_PATH || currentPath === "/food" || currentPath.startsWith(SPOTS_PATH)) return "where-to-eat";
  return null;
}

export function Nav({ currentPath, category, year }: NavProps) {
  const effectiveYear = year ?? DEFAULT_YEAR;
  const consumption = getConsumptionContext(currentPath, category);

  return (
    <nav className="sticky top-0 z-10 bg-[var(--background)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--background)]/80">
      {/* Row 1: Consumption — What to watch | Where to eat */}
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">
        <Link href="/tv/2025" className="font-serif text-xl font-bold text-foreground">
          Rankings
        </Link>
        <div className="flex items-center gap-1">
          {CONSUMPTION_TOP_LEVEL.map((top) => {
            const isActive = top.id === consumption;
            const href = top.slugs[0] === "spots" ? SPOTS_PATH : `/${top.slugs[0]}/${DEFAULT_YEAR}`;
            return (
              <Link
                key={top.id}
                href={href}
                className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                  isActive ? "text-[var(--accent)]" : "text-[var(--secondary)] hover:text-[var(--foreground)]"
                }`}
              >
                {top.label}
                {isActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)]" aria-hidden />
                )}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Row 2: Type — TV | Movies (under What to watch) or Spots (under Where to eat) */}
      <div className="border-t border-[var(--border)]/60 bg-[var(--background)]/50 px-4 py-2 sm:px-6">
        <div className="flex flex-wrap items-center gap-1">
          {consumption === "what-to-watch" &&
            CATEGORIES_YEAR_SCOPED.map((cat) => {
              const href = `/${cat}/${effectiveYear}`;
              const isActive = category === cat || currentPath.startsWith(`/${cat}/`);
              return (
                <Link
                  key={cat}
                  href={href}
                  className={`relative px-3 py-1.5 text-sm font-medium transition-colors ${
                    isActive ? "text-[var(--accent)]" : "text-[var(--secondary)] hover:text-[var(--foreground)]"
                  }`}
                >
                  {CATEGORY_LABELS[cat] ?? cat}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)]" aria-hidden />
                  )}
                </Link>
              );
            })}
          {consumption === "where-to-eat" && (
            <Link
              href={SPOTS_PATH}
              className="relative px-3 py-1.5 text-sm font-medium text-[var(--accent)]"
            >
              Spots
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)]" aria-hidden />
            </Link>
          )}
        </div>
      </div>

      {/* Row 3: Year + View (only when on TV or Movies) */}
      {category && CATEGORIES_YEAR_SCOPED.includes(category as "tv" | "movies") && (
        <div className="flex flex-wrap items-center gap-2 border-t border-[var(--border)]/40 bg-[var(--background)]/30 px-4 py-1.5 sm:px-6">
          <span className="text-xs font-medium uppercase tracking-wide text-[var(--secondary)]">Year</span>
          {YEARS.map((y) => {
            const href = `/${category}/${y}`;
            const isActive = currentPath === href;
            return (
              <Link
                key={y}
                href={href}
                className={`px-2 py-1 text-sm font-medium transition-colors ${
                  isActive ? "text-[var(--accent)]" : "text-[var(--secondary)] hover:text-[var(--foreground)]"
                }`}
              >
                {y}
              </Link>
            );
          })}
          <span className="ml-2 text-xs font-medium uppercase tracking-wide text-[var(--secondary)]">View</span>
          <Link
            href={`/${category}/${effectiveYear}`}
            className={`px-2 py-1 text-sm font-medium transition-colors ${
              currentPath === `/${category}/${effectiveYear}`
                ? "text-[var(--accent)]"
                : "text-[var(--secondary)] hover:text-[var(--foreground)]"
            }`}
          >
            Rankings
          </Link>
          <Link
            href={`/${category}/${effectiveYear}/tiers`}
            className={`px-2 py-1 text-sm font-medium transition-colors ${
              currentPath === `/${category}/${effectiveYear}/tiers`
                ? "text-[var(--accent)]"
                : "text-[var(--secondary)] hover:text-[var(--foreground)]"
            }`}
          >
            Tiers
          </Link>
          <Link
            href={`/${category}/${effectiveYear}/covers`}
            className={`px-2 py-1 text-sm font-medium transition-colors ${
              currentPath === `/${category}/${effectiveYear}/covers`
                ? "text-[var(--accent)]"
                : "text-[var(--secondary)] hover:text-[var(--foreground)]"
            }`}
          >
            Covers
          </Link>
        </div>
      )}
    </nav>
  );
}
