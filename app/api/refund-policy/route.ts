import { NextResponse } from "next/server";
import { fetchRefundPolicy } from "@/adapters/coolstay/client";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const storeKey = searchParams.get("store_key");
  const itemKey = searchParams.get("item_key");
  const packKey = searchParams.get("pack_key");
  const checkIn = searchParams.get("check_in");
  const checkOut = searchParams.get("check_out");

  if (!storeKey || !itemKey || !packKey || !checkIn || !checkOut) {
    return NextResponse.json({ error: "필수 파라미터가 누락되었습니다." }, { status: 400 });
  }

  try {
    const policies = await fetchRefundPolicy({ storeKey, itemKey, packKey, checkIn, checkOut });
    return NextResponse.json({ refund_policies: policies });
  } catch (e) {
    console.error("[refund-policy] error:", e);
    return NextResponse.json({ error: "환불 규정을 불러올 수 없습니다." }, { status: 502 });
  }
}
