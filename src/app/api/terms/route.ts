import { NextResponse } from "next/server";
import { fetchTermsList } from "@/adapters/coolstay/client";

export async function GET() {
  try {
    const terms = await fetchTermsList();
    return NextResponse.json({ terms });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "약관 조회 실패";
    console.error("[api/terms] error:", msg, e);
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
