/** CoolStay upstream 응답 → 도메인 객체 변환 */

import type { BookingStatus, BookingItem } from "@/domain/reservation/types";

/* ── 공통 파서 ── */

/** item.extras 배열 → { code: value } 맵 */
export function parseExtras(item: any): Record<string, string> {
  const map: Record<string, string> = {};
  for (const e of item.extras ?? []) map[e.code] = e.value;
  return map;
}

/** 숙박 카테고리 코드 */
const STAY_CATEGORY = "010102";

/** upstream item → ApiRoom (예약용 객실, 날짜 기반 가격 포함) */
export function toApiRoom(item: any): {
  itemKey: string;
  packageKey: string;
  name: string;
  maxGuests: number;
  image: string | null;
  images: { url: string; thumbUrl: string }[];
  price: number;
  dailyPrices: number[];
  checkInTime: string;
  checkOutTime: string;
} | null {
  // 숙박(010102) sub_item만 선택, 대실(010101) 제외
  const sub = (item.sub_items ?? []).find(
    (s: any) => s.category?.code === STAY_CATEGORY,
  );
  if (!sub) return null;

  // 판매 불가(품절) 체크 — daily_extras의 SALES_YN
  const firstDay = sub.daily_extras?.[0];
  if (firstDay) {
    const salesYn = parseExtras(firstDay).SALES_YN;
    if (salesYn === "N") return null;
  }

  const extras = parseExtras(item);

  const dailyPrices: number[] = [];
  let stime = "";
  let etime = "";
  for (const d of sub.daily_extras ?? []) {
    const dex = parseExtras(d);
    dailyPrices.push(Number(dex.PRICE ?? 0));
    if (!stime) stime = dex.STIME ?? "";
    etime = dex.ETIME ?? "";
  }

  return {
    itemKey: item.key,
    packageKey: sub.key,
    name: item.name,
    maxGuests: Number(extras.MAX ?? 2),
    image: item.images?.[0]?.thumb_url ?? null,
    images: (item.images ?? []).map((img: any) => ({
      url: img.url,
      thumbUrl: img.thumb_url,
    })),
    price: sub.price ?? dailyPrices.reduce((a: number, b: number) => a + b, 0),
    dailyPrices,
    checkInTime: stime,
    checkOutTime: etime,
  };
}

/* ── 예약 상태 코드 → 도메인 상태 ── */
const BOOK_STATUS_MAP: Record<string, BookingStatus> = {
  BS001: "BEFORE",   // 예약 확정 (이용 전)
  BS002: "AFTER",    // 이용 완료
  BS003: "CANCEL",   // 취소
  BEFORE: "BEFORE",
  AFTER: "AFTER",
  CANCEL: "CANCEL",
};

/** upstream book → BookingItem (비회원 예약 조회 결과) */
export function toBookingItem(book: any): BookingItem {
  const item = book.items?.[0];
  const itemImage = book.item_images?.[0]?.url ?? book.item_images?.[0]?.thumb_url ?? null;
  return {
    bookId: book.book_id ?? book.bookId ?? "",
    status: BOOK_STATUS_MAP[book.status] ?? "BEFORE",
    storeName: book.motel?.name ?? "",
    roomName: item?.name ?? "",
    roomImage: book.repr_image ?? itemImage ?? null,
    checkIn: String(book.start_dt ?? book.startDt ?? ""),
    checkOut: String(book.end_dt ?? book.endDt ?? ""),
    guestName: book.name ?? "",
    guestPhone: book.phone_number ?? book.phoneNumber ?? "",
    totalPrice: Number(book.total_price ?? book.totalPrice ?? 0),
    originPrice: Number(book.origin_price_total ?? book.originPriceTotal ?? 0),
    payment: {
      method: book.payment?.method ?? "SITE",
      status: book.payment?.status ?? "",
      charge: Number(book.payment?.charge ?? 0),
      cardNo: book.payment?.card_no ?? book.payment?.cardNo,
      refundCharge: book.payment?.refund_charge != null ? Number(book.payment.refund_charge) : undefined,
    },
    refundYn: book.refund_yn === "Y" || book.refundYn === "Y",
    vehicleYn: book.vehicle_yn === "Y" || book.vehicleYn === "Y",
    regDate: String(book.reg_dt ?? book.regDt ?? ""),
  };
}

/** upstream item → RoomType (홈페이지용, 기본 정보만) */
export function toRoomType(item: any): {
  itemKey: string;
  name: string;
  description: string;
  maxGuests: number;
  images: { url: string; thumbUrl: string }[];
  basePrice: number;
  checkInTime: string;
  checkOutTime: string;
} | null {
  // 숙박 sub_item만 선택
  const sub = (item.sub_items ?? []).find(
    (s: any) => s.category?.code === STAY_CATEGORY,
  );
  if (!sub) return null;

  const ex = parseExtras(item);

  // 숙박 체크인/체크아웃 시간 추출
  let stime = "";
  let etime = "";
  for (const d of sub.daily_extras ?? []) {
    const dex = parseExtras(d);
    if (!stime) stime = dex.STIME ?? "";
    etime = dex.ETIME ?? "";
  }

  return {
    itemKey: item.key,
    name: item.name,
    description: item.description ?? "",
    maxGuests: Number(ex.MAX ?? 2),
    images: (item.images ?? []).map((img: any) => ({
      url: img.url,
      thumbUrl: img.thumb_url,
    })),
    basePrice: sub.price ?? Number(item.price ?? 0),
    checkInTime: stime,
    checkOutTime: etime,
  };
}
