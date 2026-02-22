import Link from "next/link";
import { Nav } from "@/components/nav";

export default function CoversPage() {
  return (
    <div className="min-h-screen bg-[#FAFAF9]">
      <Nav currentPath="/covers" />
      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <p className="text-zinc-600">Cover grid view — coming next. Use Rankings in the meantime.</p>
        <Link href="/" className="mt-2 inline-block text-sm font-medium text-zinc-900 underline">
          ← Back to Rankings
        </Link>
      </main>
    </div>
  );
}
