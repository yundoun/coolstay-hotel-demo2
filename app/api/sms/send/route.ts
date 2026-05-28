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
    console.error("[sms/send] error:", e);
    return NextResponse.json({ error: "인증번호 발송에 실패했습니다. 잠시 후 다시 시도해 주세요." }, { status: 502 });
  }
}
