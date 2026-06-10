import { NextRequest, NextResponse } from "next/server";
import { readFileSync, writeFileSync, copyFileSync } from "fs";
import { join } from "path";
import type { SiteConfig } from "@/domain/site-config/types";

export const dynamic = "force-dynamic";

const HOTEL_DIR = join(process.cwd(), "hotel-data", "gyeongju-palace");
const CONFIG_PATH = join(HOTEL_DIR, "index.ts");
const ORIGINAL_PATH = join(HOTEL_DIR, "_original.ts");
const KEY_PATH = join(HOTEL_DIR, "api-key.json");
const ORIGINAL_KEY_PATH = join(HOTEL_DIR, "_original-api-key.json");

export async function GET() {
  const raw = readFileSync(CONFIG_PATH, "utf-8");
  // demo2 패턴: const config: SiteConfig = { ... }; export default config;
  const match = raw.match(/const config:\s*SiteConfig\s*=\s*(\{[\s\S]*\});\s*\n\s*export default config;/);
  if (!match) {
    return NextResponse.json({ error: "Failed to parse config" }, { status: 500 });
  }

  try {
    const fn = new Function(`return ${match[1]}`);
    const config = fn();
    return NextResponse.json(config);
  } catch {
    return NextResponse.json({ error: "Failed to evaluate config" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  const config: SiteConfig = await req.json();
  const content = generateConfigFile(config);
  writeFileSync(CONFIG_PATH, content, "utf-8");
  return NextResponse.json({ success: true });
}

export async function DELETE() {
  copyFileSync(ORIGINAL_PATH, CONFIG_PATH);
  copyFileSync(ORIGINAL_KEY_PATH, KEY_PATH);
  return NextResponse.json({ success: true });
}

function generateConfigFile(c: SiteConfig): string {
  const s = JSON.stringify;
  const nearbyItems = c.directions.nearbyItems
    .map((item) => `      { label: ${s(item.label)}, value: ${s(item.value)} },`)
    .join("\n");

  const heroImages = c.heroImages
    .map((url) => `    ${s(url)},`)
    .join("\n");

  const aboutImages = c.about.images
    .map((url) => `    ${s(url)},`)
    .join("\n");

  return `import type { SiteConfig } from "@/domain/site-config/types";

/**
 * \u250c\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2510
 * \u2502  ${c.name} \u2014 \uc6f9\uc0ac\uc774\ud2b8 \uc124\uc815${" ".repeat(Math.max(0, 23 - c.name.length))}\u2502
 * \u2502                                             \u2502
 * \u2502  \uc0c8 \ud638\ud154 \uc138\ud305 \uc2dc                              \u2502
 * \u2502  \uc544\ub798 \uac12\ub4e4\ub9cc \uad50\uccb4\ud558\uba74 \ub429\ub2c8\ub2e4.                  \u2502
 * \u2514\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2518
 */

const config: SiteConfig = {

  /* \u2500\u2500 \uae30\ubcf8 \uc815\ubcf4 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  /** \ud638\ud154 \uace0\uc720 ID (\ud3f4\ub354\uba85\uacfc \ub3d9\uc77c\ud558\uac8c) */
  id: ${s(c.id)},
  /** \ud638\ud154 \uc815\uc2dd \uba85\uce6d */
  name: ${s(c.name)},
  /** \uc18c\uc7ac \ub3c4\uc2dc */
  city: ${s(c.city)},
  /** \ub4f1\uae09 (4\uc131 or 5\uc131) */
  grade: ${c.grade},
  /** \uc8fc\uc18c \u2014 \uc9c0\ub3c4 \uac80\uc0c9\uc5d0\ub3c4 \uc0ac\uc6a9\ub428 */
  address: ${s(c.address)},
  /** \ub300\ud45c \uc5f0\ub77d\ucc98 */
  phone: ${s(c.phone)},
  /*\u2500\u2500 Hero \uc139\uc158 (\ubc30\ub108 \uc2ac\ub77c\uc774\ub4dc \uc774\ubbf8\uc9c0, \ucd5c\ub300 5\uc7a5) \u2500\u2500 */
  heroImages: [
${heroImages}
  ],
  /** \ud55c \uc904 \ucee8\uc149 \ubb38\uad6c \u2014 \ube0c\ub77c\uc6b0\uc800 \ud0ed \uc81c\ubaa9\uc5d0 \ud45c\uc2dc */
  shortConcept: ${s(c.shortConcept)},
  /** \ud638\ud154\uba85\uc774 \uae38\uba74 "sm"\uc73c\ub85c \uc124\uc815 \u2014 \ud788\uc5b4\ub85c \uc81c\ubaa9 \ud06c\uae30 \uc870\uc808 */
  heroTitleSize: ${s(c.heroTitleSize || "base")},

  /* \u2500\u2500 \uc778\uc0ac\ub9d0 \uc139\uc158 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  greeting: {
    /** \uc778\uc0ac\ub9d0 \uc81c\ubaa9 (\uc904\ubc14\uafb8: \\n) */
    headline: ${s(c.greeting.headline)},
    /** \uc778\uc0ac\ub9d0 \ubcf8\ubb38 (\uc904\ubc14\uafb8: \\n) */
    body: ${s(c.greeting.body)},
    /** \uc11c\uba85 (\uc608: "OO\ud638\ud154 \uc77c\ub3d9") */
    signature: ${s(c.greeting.signature)},
  },

  /* \u2500\u2500 \ud638\ud154 \uc18c\uac1c(About) \uc139\uc158 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  about: {
    /** \uc139\uc158 \uc18c\uc81c\ubaa9 \u2014 \uc81c\ubaa9 \uc704\uc5d0 \uc791\uac8c \ud45c\uc2dc */
    subtitle: ${s(c.about.subtitle || "")},
    /** \uc81c\ubaa9 (\uc904\ubc14\uafb8: \\n) */
    title: ${s(c.about.title)},
    /** \ubcf8\ubb38 \uc124\uba85 */
    body: ${s(c.about.body || "")},
    /** \uac24\ub7ec\ub9ac \uc774\ubbf8\uc9c0 URL (\ucd5c\ub300 5\uc7a5) */
    images: [
${aboutImages}
    ],
  },

  /* \u2500\u2500 \ucc3e\uc544\uc624\ub294 \uae38 \uc139\uc158 \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500 */
  directions: {
    /** \uc8fc\ucc28 \uc548\ub0b4 \u2014 \uc5c6\uc73c\uba74 \ube48 \ubb38\uc790\uc5f4 (\ud654\uba74\uc5d0 \ud45c\uc2dc\ub418\uc9c0 \uc54a\uc74c) */
    parkingInfo: ${s(c.directions.parkingInfo)},
    /** \uc8fc\ubcc0 \uad00\uad11\uc9c0\xb7\uad50\ud1b5 \uc548\ub0b4 */
    nearbyItems: [
${nearbyItems}
    ],
  },
};

export default config;
`;
}
