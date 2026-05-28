import { NextResponse } from "next/server";
import { fetchGuestReservation } from "@/adapters/coolstay/client";
import { toBookingItem } from "@/adapters/coolstay/mappers";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const bookId = searchParams.get("book_id");
  const phone = searchParams.get("phone_number");

  if (!bookId || !phone) {
    return NextResponse.json(
      { message: "예약번호와 전화번호를 모두 입력해주세요." },
      { status: 400 },
    );
  }

  try {
    const result = await fetchGuestReservation(bookId, phone);
    // upstream은 단건 조회: result.book (객체) 또는 빈 경우 books: []
    const books = result.book
      ? [toBookingItem(result.book)]
      : (result.books ?? []).map(toBookingItem);
    return NextResponse.json({ books });
  } catch (e) {
    console.error("[reservation lookup] error:", e);
    return NextResponse.json(
      { message: "예약 정보를 조회할 수 없습니다. 예약번호와 전화번호를 다시 확인해 주세요." },
      { status: 502 },
    );
  }
}
