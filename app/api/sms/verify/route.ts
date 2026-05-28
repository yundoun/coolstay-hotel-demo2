import { NextResponse } from "next/server";
import { verifySmsCode } from "@/adapters/coolstay/client";

export async function POST(request: Request) {
  const body = await request.json();
  const { sms_auth_key, sms_auth_code, phone_number } = body;

  if (!sms_auth_key || !sms_auth_code || !phone_number) {
    return NextResponse.json({ error: "필수 파라미터가 누락되었습니다." }, { status: 400 });
  }

  try {
    const { isVerified } = await verifySmsCode(sms_auth_key, sms_auth_code, phone_number);
    return NextResponse.json({ is_verified: isVerified });
  } catch (e) {
    console.error("[sms/verify] error:", e);
    const msg = e instanceof Error ? e.message : "";
    // 인증번호 불일치 등 업스트림 비즈니스 에러는 400으로 사용자 안내
    if (msg.includes("인증번호 확인 실패")) {
      return NextResponse.json({ error: "인증번호가 올바르지 않습니다. 다시 확인해 주세요." }, { status: 400 });
    }
    return NextResponse.json({ error: "인증번호 확인에 실패했습니다. 잠시 후 다시 시도해 주세요." }, { status: 502 });
  }
}
