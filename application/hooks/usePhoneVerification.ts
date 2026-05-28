"use client";

import { useCallback, useEffect, useRef, useState } from "react";

type Status = "idle" | "sending" | "sent" | "verifying" | "verified" | "expired";

const TIMEOUT_SEC = 180; // 3분

export function usePhoneVerification() {
  const [status, setStatus] = useState<Status>("idle");
  const [remaining, setRemaining] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const authKeyRef = useRef<string | null>(null);

  // 타이머 정리
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // 카운트다운
  useEffect(() => {
    if (status !== "sent") return;

    timerRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setStatus("expired");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [status]);

  const send = useCallback(async (phone: string) => {
    if (!phone || phone.replace(/[^0-9]/g, "").length < 10) {
      setError("올바른 휴대폰 번호를 입력해 주세요.");
      return;
    }
    setError(null);
    setStatus("sending");

    try {
      const res = await fetch("/api/sms/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone_number: phone }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "인증번호 발송에 실패했습니다.");
        setStatus("idle");
        return;
      }

      authKeyRef.current = data.sms_auth_key;
      setStatus("sent");
      setRemaining(TIMEOUT_SEC);
    } catch {
      setError("네트워크 오류가 발생했습니다. 다시 시도해 주세요.");
      setStatus("idle");
    }
  }, []);

  const verify = useCallback(async (code: string, phone?: string) => {
    if (!code || code.length < 6) {
      setError("인증번호 6자리를 입력해 주세요.");
      return;
    }
    if (!authKeyRef.current) {
      setError("인증번호를 먼저 요청해 주세요.");
      return;
    }
    setError(null);
    setStatus("verifying");

    try {
      const res = await fetch("/api/sms/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sms_auth_key: authKeyRef.current,
          sms_auth_code: code,
          phone_number: phone ?? "",
        }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "인증번호 확인에 실패했습니다.");
        setStatus("sent");
        return;
      }

      if (data.is_verified) {
        if (timerRef.current) clearInterval(timerRef.current);
        setStatus("verified");
        setRemaining(0);
      } else {
        setError("인증번호가 일치하지 않습니다. 다시 확인해 주세요.");
        setStatus("sent");
      }
    } catch {
      setError("네트워크 오류가 발생했습니다. 다시 시도해 주세요.");
      setStatus("sent");
    }
  }, []);

  const resetVerification = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    authKeyRef.current = null;
    setStatus("idle");
    setRemaining(0);
    setError(null);
  }, []);

  const formatRemaining = remaining > 0
    ? `${String(Math.floor(remaining / 60)).padStart(2, "0")}:${String(remaining % 60).padStart(2, "0")}`
    : "";

  return { status, remaining, formatRemaining, error, send, verify, resetVerification };
}
