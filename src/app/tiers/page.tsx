import { redirect } from "next/navigation";
import { DEFAULT_YEAR } from "@/lib/constants";

export default function TiersRedirect() {
  redirect(`/tv/${DEFAULT_YEAR}/tiers`);
}
