import { NextRequest, NextResponse } from "next/server";
import { adminDelist } from "@/lib/store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const body = (await req.json().catch(() => ({}))) as { id?: string; key?: string };
  if (!process.env.ADMIN_KEY || body.key !== process.env.ADMIN_KEY) {
    return NextResponse.json({ ok: false }, { status: 403 });
  }
  if (!body.id) return NextResponse.json({ ok: false, reason: "missing id" }, { status: 400 });
  const ok = await adminDelist(body.id);
  return NextResponse.json({ ok });
}
