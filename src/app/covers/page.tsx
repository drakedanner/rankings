import { redirect } from "next/navigation";
import { DEFAULT_YEAR } from "@/lib/constants";

export default function CoversRedirect() {
  redirect(`/tv/${DEFAULT_YEAR}/covers`);
}
