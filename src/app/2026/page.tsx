import type { Metadata } from "next";
import { YearRankings } from "@/components/year-rankings";

export const metadata: Metadata = {
  title: "2026 TV Rankings",
  description: "Rankings and tier list for TV shows released in 2026",
};

export default function Year2026Page() {
  return <YearRankings year={2026} currentPath="/2026" />;
}
