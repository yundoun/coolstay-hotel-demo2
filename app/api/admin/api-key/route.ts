import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync } from "fs";
import { join } from "path";

export const dynamic = "force-dynamic";

const KEY_PATH = join(process.cwd(), "hotel-data", "gyeongju-palace", "api-key.json");

function readKey(): string {
  try {
    const data = JSON.parse(readFileSync(KEY_PATH, "utf-8"));
    return data.motelKey || "";
  } catch {
    return "";
  }
}

export async function GET() {
  return NextResponse.json({ motelKey: readKey() });
}

export async function POST(req: NextRequest) {
  const { motelKey } = await req.json();
  if (!motelKey || typeof motelKey !== "string") {
    return NextResponse.json({ error: "모텔키를 입력해주세요." }, { status: 400 });
  }
  writeFileSync(KEY_PATH, JSON.stringify({ motelKey: motelKey.trim() }, null, 2) + "\n", "utf-8");
  return NextResponse.json({ success: true });
}
