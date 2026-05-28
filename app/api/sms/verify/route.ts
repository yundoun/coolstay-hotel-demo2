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
    const msg = e instanceof Error ? e.message : "인증번호 확인 실패";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
