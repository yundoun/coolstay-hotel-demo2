import { NextResponse } from "next/server";
import { fetchStoreDetail } from "@/adapters/coolstay/client";
import { toApiRoom } from "@/adapters/coolstay/mappers";
import type { ApiRoom, RoomsResponse } from "@/adapters/coolstay/types";

/** 예약용 — 날짜 기반 객실 + 실시간 가격 */
export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const checkIn = searchParams.get("checkIn");
  const checkOut = searchParams.get("checkOut");

  if (!checkIn || !checkOut) {
    return NextResponse.json({ message: "checkIn, checkOut 필수" }, { status: 400 });
  }

  try {
    const motel = await fetchStoreDetail({ checkIn, checkOut });
    if (!motel) {
      return NextResponse.json(
        { message: "숙소 정보를 찾을 수 없습니다. CMS에서 앱노출이 활성화되어 있는지 확인해주세요." },
        { status: 502 },
      );
    }
    const rooms = (motel.items ?? []).map(toApiRoom).filter(Boolean) as ApiRoom[];

    return NextResponse.json({
      motelKey: motel.key,
      storeName: motel.name,
      sitePayment: motel.site_payment_yn === "Y",
      rooms,
    } satisfies RoomsResponse);
  } catch (err) {
    console.error("[store/rooms] error:", err);
    return NextResponse.json({ message: "객실 정보를 불러올 수 없습니다. 잠시 후 다시 시도해 주세요." }, { status: 502 });
  }
}
