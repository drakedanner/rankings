"use client";

import { useParams } from "next/navigation";
import { YearRankings } from "@/components/year-rankings";
import { CATEGORIES_YEAR_SCOPED, DEFAULT_YEAR } from "@/lib/constants";

export default function CategoryYearPage() {
  const params = useParams();
  const category = String(params.category ?? "tv");
  const year = Math.min(2100, Math.max(2000, parseInt(String(params.year ?? DEFAULT_YEAR), 10) || DEFAULT_YEAR));
  const currentPath = `/${category}/${year}`;
  const validCategory = CATEGORIES_YEAR_SCOPED.includes(category as "tv" | "movies") ? category : "tv";

  return (
    <YearRankings
      category={validCategory as "tv" | "movies"}
      year={year}
      currentPath={currentPath}
    />
  );
}
