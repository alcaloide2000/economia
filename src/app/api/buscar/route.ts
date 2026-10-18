import { NextResponse } from "next/server";
import { searchTranscripts } from "@/lib/transcriptSearch";

export function GET(request: Request) {
  const query = new URL(request.url).searchParams.get("q") ?? "";
  return NextResponse.json(searchTranscripts(query.slice(0, 200)));
}
