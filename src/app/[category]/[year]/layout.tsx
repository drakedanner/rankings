import { redirect } from "next/navigation";
import { CATEGORIES_YEAR_SCOPED, DEFAULT_YEAR, SPOTS_PATH } from "@/lib/constants";

export default async function CategoryYearLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ category: string; year: string }>;
}) {
  const { category, year } = await params;
  const yearNum = parseInt(year, 10);
  if (category === "food" || category === "spots") redirect(SPOTS_PATH);
  if (!CATEGORIES_YEAR_SCOPED.includes(category as "tv" | "movies")) redirect("/tv/2025");
  if (isNaN(yearNum) || yearNum < 2000 || yearNum > 2100) redirect(`/${category}/${DEFAULT_YEAR}`);
  return <>{children}</>;
}
