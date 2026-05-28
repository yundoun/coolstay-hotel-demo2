/** CoolStay upstream API 클라이언트 */

/** yyyy-MM-dd → yyyyMMdd (검수기 내부 서비스 호환) */
function toCompactDate(iso: string): string {
  return iso.replace(/-/g, "");
}

export function getApiBase() {
  const base = process.env.COOLSTAY_API_BASE;
  if (!base) throw new Error("COOLSTAY_API_BASE 미설정");
  return base;
}

export function getMotelKey() {
  const key = process.env.COOLSTAY_MOTEL_KEY;
  if (!key) throw new Error("COOLSTAY_MOTEL_KEY 미설정");
  return key;
}

/* ── 토큰 캐싱 (5분 TTL 토큰 → 4분 캐싱) ── */

const TOKEN_CACHE_TTL_MS = 4 * 60 * 1000; // 4분

let cachedToken: { accessToken: string; secret: string } | null = null;
let cachedAt = 0;
let inflightRequest: Promise<{ accessToken: string; secret: string }> | null = null;

async function fetchNewToken() {
  const res = await fetch(`${getApiBase()}/api/v2/mobile/auth/sessions/temporary`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
  });
  const data = await res.json();
  const token = data.result?.token;
  if (!token?.access_token) throw new Error("토큰 발급 실패");
  return { accessToken: token.access_token as string, secret: token.secret as string };
}

export async function getToken() {
  // 캐시 유효하면 즉시 반환
  if (cachedToken && Date.now() - cachedAt < TOKEN_CACHE_TTL_MS) {
    return cachedToken;
  }
  // 이미 발급 요청 중이면 그 결과를 공유 (thundering herd 방지)
  if (inflightRequest) return inflightRequest;

  inflightRequest = fetchNewToken()
    .then((t) => {
      cachedToken = t;
      cachedAt = Date.now();
      return t;
    })
    .finally(() => {
      inflightRequest = null;
    });

  return inflightRequest;
}

/** 캐시 무효화 — 토큰 만료 에러 시 호출 */
export function invalidateToken() {
  cachedToken = null;
  cachedAt = 0;
}

/** 토큰 만료 에러 코드 */
const TOKEN_EXPIRED_CODE = "40000004";
const TOKEN_INVALID_CODE = "40000003";

/**
 * CoolStay API를 호출하되, 토큰 만료 시 갱신 후 1회 재시도.
 * 서버 사이드 API route에서 사용하는 모든 upstream 호출에 적용.
 */
async function callWithRetry<T>(
  fn: (headers: { "app-token": string; "app-secret-code": string }) => Promise<T>,
): Promise<T> {
  const { accessToken, secret } = await getToken();
  try {
    return await fn({ "app-token": accessToken, "app-secret-code": secret });
  } catch (e) {
    const msg = e instanceof Error ? e.message : "";
    if (msg.includes(TOKEN_EXPIRED_CODE) || msg.includes(TOKEN_INVALID_CODE)) {
      invalidateToken();
      const fresh = await getToken();
      return fn({ "app-token": fresh.accessToken, "app-secret-code": fresh.secret });
    }
    throw e;
  }
}

/** upstream JSON 파싱 + 에러 코드 검증 공통 */
async function parseUpstream(res: Response, label: string) {
  const raw = await res.text();
  const data = JSON.parse(raw.replace(/[\x00-\x1f]/g, " "));
  if (data.code !== "20000000") {
    throw new Error(`${label}: ${data.code} ${data.desc || ""}`);
  }
  return data;
}

/** 비회원 예약 조회 */
export async function fetchGuestReservation(bookId: string, phoneNumber: string) {
  return callWithRetry(async (headers) => {
    const qs = new URLSearchParams({ book_id: bookId, phone_number: phoneNumber });
    const res = await fetch(`${getApiBase()}/api/v2/mobile/reserv/guest/list?${qs}`, { headers });
    const data = await parseUpstream(res, "예약 조회 실패");
    return data.result;
  });
}

/** 예약 취소 */
export async function cancelReservation(bookId: string) {
  return callWithRetry(async (headers) => {
    const res = await fetch(`${getApiBase()}/api/v2/mobile/reserv/delete`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify({ book_id: bookId }),
    });
    const data = await parseUpstream(res, "예약 취소 실패");
    return data.result;
  });
}

/** SMS 인증번호 발송 */
export async function sendSmsCode(phoneNumber: string) {
  return callWithRetry(async (headers) => {
    const res = await fetch(`${getApiBase()}/api/v2/mobile/auth/code/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify({ phone_number: phoneNumber.replace(/-/g, "") }),
    });
    const data = await parseUpstream(res, "인증번호 발송 실패");
    return { smsAuthKey: data.result.sms_auth_key as string };
  });
}

/** SMS 인증번호 확인 */
export async function verifySmsCode(smsAuthKey: string, smsAuthCode: string, phoneNumber: string) {
  return callWithRetry(async (headers) => {
    const res = await fetch(`${getApiBase()}/api/v2/mobile/auth/code/check`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...headers },
      body: JSON.stringify({
        sms_auth_key: smsAuthKey,
        sms_auth_code: smsAuthCode,
        auth_method: phoneNumber.replace(/-/g, ""),
      }),
    });
    const data = await parseUpstream(res, "인증번호 확인 실패");
    return { isVerified: (data.result.isVerified ?? data.result.is_verified) as boolean };
  });
}

/** 약관 목록 조회 */
export async function fetchTermsList() {
  return callWithRetry(async (headers) => {
    const res = await fetch(`${getApiBase()}/api/v2/mobile/manage/terms/list`, { headers });
    const data = await parseUpstream(res, "약관 조회 실패");
    return data.result.terms as {
      code: string;
      name: string;
      url: string;
      required_yn: string;
      version: string;
    }[];
  });
}

/** 취소 환불 규정 조회 */
export async function fetchRefundPolicy(params: {
  storeKey: string;
  itemKey: string;
  packKey: string;
  checkIn: string;
  checkOut: string;
}) {
  return callWithRetry(async (headers) => {
    const qs = new URLSearchParams({
      store_key: params.storeKey,
      item_key: params.itemKey,
      pack_key: params.packKey,
      search_start_date: toCompactDate(params.checkIn),
      search_end_date: toCompactDate(params.checkOut),
    });
    const res = await fetch(`${getApiBase()}/api/v2/mobile/contents/refund-policy/list?${qs}`, { headers });
    const data = await parseUpstream(res, "환불 규정 조회 실패");
    return (data.result.refund_policies ?? data.result.refundPolicies ?? []) as {
      until: string;
      percent: number;
      amount: number;
    }[];
  });
}

/** details/list upstream 호출 공통 */
export async function fetchStoreDetail(params: { checkIn?: string; checkOut?: string }) {
  const motelKey = getMotelKey();
  return callWithRetry(async (headers) => {
    const qs = new URLSearchParams({ motel_key: motelKey, pure_click_yn: "N" });
    if (params.checkIn) qs.set("search_start", toCompactDate(params.checkIn));
    if (params.checkOut) qs.set("search_end", toCompactDate(params.checkOut));

    const res = await fetch(`${getApiBase()}/api/v2/mobile/contents/details/list?${qs}`, { headers });
    const data = await parseUpstream(res, "숙소 조회 실패");
    return data.result.motel;
  });
}
