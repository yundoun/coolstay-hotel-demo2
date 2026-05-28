import { NextResponse } from "next/server";
import { fetchTermsList } from "@/adapters/coolstay/client";

export async function GET() {
  try {
    const terms = await fetchTermsList();
    return NextResponse.json({ terms });
  } catch (e) {
    console.error("[api/terms] error:", e);
    return NextResponse.json({ error: "약관 정보를 불러올 수 없습니다." }, { status: 502 });
  }
}
