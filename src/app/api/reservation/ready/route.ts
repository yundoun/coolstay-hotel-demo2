import { NextResponse } from "next/server";
import { getApiBase, getToken, invalidateToken } from "@/adapters/coolstay/client";

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
      throw new Error(`API 서버가 JSON이 아닌 응답을 반환했습니다 (${upstream.status})`);
    }

    const data = await upstream.json();

    // 토큰 만료 시 갱신 후 재시도를 위해 throw
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
      return NextResponse.json(
        { message: data.desc || "예약 요청이 실패했습니다.", code: data.code },
        { status: ok ? 400 : result.status },
      );
    }

    return NextResponse.json(data.result);
  } catch (e) {
    console.error("[reservation proxy] error:", e);
    return NextResponse.json(
      { message: e instanceof Error ? e.message : "예약 요청 실패" },
      { status: 502 },
    );
  }
}
