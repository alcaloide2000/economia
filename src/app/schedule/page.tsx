import { redirect } from "next/navigation";

// The temario now lives at the home page; keep old /schedule links working.
export default function Schedule() {
  redirect("/");
}
