import { NextResponse } from "next/server";
import { getApiBase, getToken, invalidateToken } from "@/adapters/coolstay/client";

/** 에러 코드 → 사용자용 메시지 */
const USER_MESSAGES: Record<string, string> = {
  "40000016": "객실 가격이 변동되었습니다. 페이지를 새로고침한 후 다시 시도해 주세요.",
  "40000022": "선택하신 객실이 매진되었습니다. 다른 객실 또는 날짜를 선택해 주세요.",
  "40000029": "객실 운영 시간이 변경되었습니다. 페이지를 새로고침한 후 다시 시도해 주세요.",
  "40000047": "해당 쿠폰 사용 시 현장결제가 불가합니다.",
};
const DEFAULT_USER_MESSAGE = "예약 처리 중 문제가 발생했습니다. 잠시 후 다시 시도해 주세요.";

export async function POST(request: Request) {
  const body = await request.json();

  async function tryReservation() {
    const { accessToken, secret } = await getToken();
    const upstream = await fetch(`${getApiBase()}/api/v2/mobile/reserv/ready`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "app-token": accessToken,
        "app-secret-code": secret,
      },
      body: JSON.stringify(body),
    });

    const contentType = upstream.headers.get("content-type") ?? "";
    if (!contentType.includes("application/json")) {
      const text = await upstream.text();
      console.error("[reservation proxy] non-JSON response:", upstream.status, text.slice(0, 200));
      throw new Error("NON_JSON");
    }

    const data = await upstream.json();

    if (data.code === "40000004" || data.code === "40000003") {
      throw new Error(`token_expired:${data.code}`);
    }

    return { data, status: upstream.status, ok: upstream.ok };
  }

  try {
    let result: Awaited<ReturnType<typeof tryReservation>>;
    try {
      result = await tryReservation();
    } catch (e) {
      const msg = e instanceof Error ? e.message : "";
      if (msg.startsWith("token_expired:")) {
        invalidateToken();
        result = await tryReservation();
      } else {
        throw e;
      }
    }

    const { data, ok } = result;
    if (!ok || data.code !== "20000000") {
      console.error("[reservation proxy] upstream error:", data.code, data.desc, data.errorMsg ?? data.internalBodyError ?? "");
      return NextResponse.json(
        { message: USER_MESSAGES[data.code] ?? DEFAULT_USER_MESSAGE, code: data.code },
        { status: ok ? 400 : result.status },
      );
    }

    return NextResponse.json(data.result);
  } catch (e) {
    console.error("[reservation proxy] error:", e);
    return NextResponse.json(
      { message: DEFAULT_USER_MESSAGE },
      { status: 502 },
    );
  }
}
