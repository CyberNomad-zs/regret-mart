import { NextRequest, NextResponse } from "next/server";
import { getOrCreateWallet, listTransactionsByBuyer } from "@/lib/store";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const anonId = searchParams.get("anonId") || "";
  if (!anonId) return NextResponse.json({ ok: false, reason: "missing anonId" }, { status: 400 });

  const wallet = await getOrCreateWallet(anonId);
  const transactions = await listTransactionsByBuyer(anonId);
  return NextResponse.json({ ok: true, wallet, transactions });
}
