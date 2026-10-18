import { NextResponse } from "next/server";
import { search } from "@/lib/search";

export function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q") ?? "";
  return NextResponse.json(search(query.slice(0, 200)));
}
