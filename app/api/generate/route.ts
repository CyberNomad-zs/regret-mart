import { NextRequest, NextResponse } from "next/server";
import { generateCandidates, isLlmConfigured } from "@/lib/llm";
import { moderateContent } from "@/lib/moderation";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  let body: { content?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, reason: "invalid json" }, { status: 400 });
  }
  const content = (body.content || "").trim();
  const mod = moderateContent(content);
  if (!mod.ok) return NextResponse.json({ ok: false, reason: mod.reason });

  const candidates = await generateCandidates({ content });
  return NextResponse.json({
    ok: true,
    candidates,
    crisisHotline: mod.needsCrisisHotline === true,
    llmEnabled: isLlmConfigured()
  });
}
