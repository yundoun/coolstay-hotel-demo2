import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync, copyFileSync } from "fs";
import { join } from "path";
import type { SiteConfig } from "@/domain/site-config/types";

export const dynamic = "force-dynamic";

const HOTEL_DIR = join(process.cwd(), "hotel-data", "gyeongju-palace");
const CONFIG_PATH = join(HOTEL_DIR, "config.json");
const ORIGINAL_PATH = join(HOTEL_DIR, "_original.json");
const KEY_PATH = join(HOTEL_DIR, "api-key.json");
const ORIGINAL_KEY_PATH = join(HOTEL_DIR, "_original-api-key.json");

export async function GET() {
  try {
    const config = JSON.parse(readFileSync(CONFIG_PATH, "utf-8"));
    return NextResponse.json(config);
  } catch {
    return NextResponse.json({ error: "Failed to read config" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const config: SiteConfig = await req.json();
  writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), "utf-8");
  return NextResponse.json({ success: true });
}

export async function DELETE() {
  copyFileSync(ORIGINAL_PATH, CONFIG_PATH);
  copyFileSync(ORIGINAL_KEY_PATH, KEY_PATH);
  return NextResponse.json({ success: true });
}
