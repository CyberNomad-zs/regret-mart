import { NextRequest, NextResponse } from "next/server";
import { createMedicine, listMedicines } from "@/lib/store";
import { generateCandidates } from "@/lib/llm";
import { moderateContent } from "@/lib/moderation";
import { clamp, pickPillColor } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const tag = searchParams.get("tag") || undefined;
  const sellerId = searchParams.get("sellerId") || undefined;
  const buyerId = searchParams.get("buyerId") || undefined;
  const status = (searchParams.get("status") as "listed" | "sold" | "all" | null) || "listed";
  const sort = (searchParams.get("sort") as "newest" | "cheapest" | "priciest" | null) || "newest";
  const limit = Number(searchParams.get("limit") || "60");
  const offset = Number(searchParams.get("offset") || "0");

  const medicines = await listMedicines({ tag, sellerId, buyerId, status, sort, limit, offset });
  return NextResponse.json({ ok: true, medicines });
}

export async function POST(req: NextRequest) {
  let body: {
    sellerId?: string;
    title?: string;
    content?: string;
    comfortText?: string;
    emojiSkin?: string;
    pillColor?: string;
    price?: number;
    tags?: string[];
  };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, reason: "invalid json" }, { status: 400 });
  }

  const sellerId = (body.sellerId || "").trim();
  const content = (body.content || "").trim();
  if (!sellerId) return NextResponse.json({ ok: false, reason: "missing sellerId" }, { status: 400 });

  const mod = moderateContent(content);
  if (!mod.ok) return NextResponse.json({ ok: false, reason: mod.reason }, { status: 400 });

  let title = (body.title || "").trim();
  let comfortText = (body.comfortText || "").trim();
  let emojiSkin = (body.emojiSkin || "").trim();
  let tags = (body.tags || []).filter(Boolean).slice(0, 3);
  let pillColor = (body.pillColor || "").trim();

  if (!title || !comfortText || !emojiSkin) {
    const cands = await generateCandidates({ content });
    const pick = cands[0];
    title = title || pick.title;
    comfortText = comfortText || pick.comfortText;
    emojiSkin = emojiSkin || pick.emojiSkin;
    if (tags.length === 0) tags = pick.tags;
    pillColor = pillColor || pick.pillColor;
  }

  if (!pillColor) pillColor = pickPillColor(title);
  const price = clamp(Math.round(Number(body.price) || 30), 5, 200);

  const medicine = await createMedicine({
    sellerId,
    title,
    content,
    comfortText,
    emojiSkin,
    pillColor,
    price,
    tags
  });

  return NextResponse.json({ ok: true, medicine, crisisHotline: mod.needsCrisisHotline === true });
}
