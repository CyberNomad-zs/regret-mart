import { NextRequest, NextResponse } from "next/server";
import { buyMedicine } from "@/lib/store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  let body: { buyerId?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, reason: "invalid json" }, { status: 400 });
  }
  const buyerId = (body.buyerId || "").trim();
  if (!buyerId) return NextResponse.json({ ok: false, reason: "missing buyerId" }, { status: 400 });

  const result = await buyMedicine(id, buyerId);
  if (!result.ok) return NextResponse.json(result, { status: 400 });
  return NextResponse.json(result);
}
