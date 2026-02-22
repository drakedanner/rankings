import Link from "next/link";

const links = [
  { href: "/", label: "Rankings" },
  { href: "/tiers", label: "Tiers" },
  { href: "/covers", label: "Covers" },
];

export function Nav({ currentPath }: { currentPath: string }) {
  return (
    <nav className="sticky top-0 z-10 border-b border-zinc-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-lg font-semibold text-zinc-900">
          2025 TV Rankings
        </Link>
        <div className="flex gap-1">
          {links.map(({ href, label }) => {
            const isActive = currentPath === href || (href !== "/" && currentPath.startsWith(href));
            return (
              <Link
                key={href}
                href={href}
                className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                  isActive
                    ? "bg-zinc-100 text-zinc-900"
                    : "text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
