import Link from "next/link";
import { Nav } from "@/components/nav";

export default function TiersPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <Nav currentPath="/tiers" />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <p className="text-zinc-600">Tier list view — coming next. Use Rankings in the meantime.</p>
        <Link href="/" className="mt-2 inline-block text-sm font-medium text-zinc-900 underline">
          ← Back to Rankings
        </Link>
      </main>
    </div>
  );
}
