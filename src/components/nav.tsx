import Link from "next/link";

const links = [
  { href: "/", label: "2025" },
  { href: "/2026", label: "2026" },
  { href: "/tiers", label: "Tiers" },
  { href: "/covers", label: "Covers" },
];

export function Nav({ currentPath }: { currentPath: string }) {
  return (
    <nav className="sticky top-0 z-10 bg-[var(--background)]/95 backdrop-blur supports-[backdrop-filter]:bg-[var(--background)]/80">
      <div className="flex h-14 items-center justify-between px-4 sm:px-6">
        <Link href="/" className="font-serif text-xl font-bold text-foreground">
          TV Rankings
        </Link>
        <div className="flex items-center gap-1">
          {links.map(({ href, label }) => {
            const isActive =
              currentPath === href || (href !== "/" && currentPath.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`relative px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "text-[var(--accent)]"
                    : "text-[var(--secondary)] hover:text-[var(--foreground)]"
                }`}
              >
                {label}
                {isActive && (
                  <span
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-[var(--accent)]"
                    aria-hidden
                  />
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
