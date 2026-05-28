import { NextResponse } from "next/server";
import { cancelReservation } from "@/adapters/coolstay/client";

export async function POST(request: Request) {
  const body = await request.json();
  const bookId = body.book_id;

  if (!bookId) {
    return NextResponse.json(
      { message: "예약번호가 필요합니다." },
      { status: 400 },
    );
  }

  try {
    await cancelReservation(bookId);
    return NextResponse.json({ success: true });
  } catch (e) {
    console.error("[reservation cancel] error:", e);
    return NextResponse.json(
      { message: "예약 취소 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요." },
      { status: 502 },
    );
  }
}
