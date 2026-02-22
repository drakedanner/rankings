import { redirect } from "next/navigation";
import { SPOTS_PATH } from "@/lib/constants";

export default function FoodRedirect() {
  redirect(SPOTS_PATH);
}
