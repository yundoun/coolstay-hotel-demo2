import { NextResponse } from "next/server";
import { fetchStoreDetail } from "@/adapters/coolstay/client";
import { toRoomType } from "@/adapters/coolstay/mappers";
import type { StoreInfo } from "@/adapters/coolstay/types";

/** 홈 페이지용 — 숙소 기본 정보 + 객실 유형 (날짜 불필요) */
export async function GET() {
  try {
    const motel = await fetchStoreDetail({});
    const rooms = (motel.items ?? []).map(toRoomType).filter(Boolean) as NonNullable<ReturnType<typeof toRoomType>>[];

    const storeImages = (motel.images ?? []).map((img: any) => ({
      url: img.url as string,
      thumbUrl: img.thumb_url as string,
      description: (img.description ?? "") as string,
    }));

    const info: StoreInfo = {
      motelKey: motel.key,
      name: motel.name,
      greetingMsg: motel.greeting_msg ?? "",
      phone: motel.phone_number ?? motel.safe_number ?? "",
      address: motel.location?.address ?? "",
      latitude: motel.location?.latitude ?? "",
      longitude: motel.location?.longitude ?? "",
      locationDesc: motel.location?.description ?? "",
      parkingYn: motel.parking_yn === "Y",
      parkingInfo: motel.parking_info ?? "",
      sitePayment: motel.site_payment_yn === "Y",
      images: storeImages,
      rooms,
      benefitRoom: motel.benefit_room ?? "",
      benefitExtra: motel.benefit_extra ?? "",
      policyMsg: motel.policy_msg ?? "",
      refundPolicy: motel.refund_policy ?? "",
    };

    return NextResponse.json(info);
  } catch (err) {
    console.error("[store/info] error:", err);
    return NextResponse.json({ message: "숙소 정보를 불러올 수 없습니다." }, { status: 502 });
  }
}
