import { NextResponse } from "next/server";
import { sendSmsCode } from "@/adapters/coolstay/client";

export async function POST(request: Request) {
  const body = await request.json();
  const phone = body.phone_number;

  if (!phone || phone.replace(/[^0-9]/g, "").length < 10) {
    return NextResponse.json({ error: "올바른 휴대폰 번호를 입력해 주세요." }, { status: 400 });
  }

  try {
    const { smsAuthKey } = await sendSmsCode(phone);
    return NextResponse.json({ sms_auth_key: smsAuthKey });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "인증번호 발송 실패";
    return NextResponse.json({ error: msg }, { status: 502 });
  }
}
