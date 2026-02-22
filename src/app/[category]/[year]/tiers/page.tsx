import Link from "next/link";
import { Nav } from "@/components/nav";
import { CATEGORY_LABELS } from "@/lib/constants";

export default async function TiersViewPage({
  params,
}: {
  params: Promise<{ category: string; year: string }>;
}) {
  const { category, year } = await params;
  const label = CATEGORY_LABELS[category] ?? category;
  const currentPath = `/${category}/${year}/tiers`;

  return (
    <div className="min-h-screen bg-background">
      <Nav currentPath={currentPath} category={category} year={parseInt(year, 10)} />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <p className="text-secondary">
          Tier list view — coming next. Use Rankings in the meantime.
        </p>
        <Link
          href={`/${category}/${year}`}
          className="mt-2 inline-block text-sm font-medium text-foreground underline hover:no-underline"
        >
          ← Back to {label} {year} Rankings
        </Link>
      </main>
    </div>
  );
}
