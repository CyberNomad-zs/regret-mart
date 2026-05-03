"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Coins, FlaskConical, Loader2, Sparkles } from "lucide-react";
import type { GenerateCandidate, Medicine } from "@/lib/types";
import { useToast } from "@/components/ToastProvider";
import { useWallet } from "@/components/WalletProvider";
import { cn, clamp } from "@/lib/utils";

const SAMPLE_PROMPTS = [
  "毕业那年没去成自己想去的城市，听家里话回了老家",
  "拒绝了一次心仪的面试机会，因为怕通勤太远",
  "高中跟最好的朋友冷战了三个月，没机会和好",
  "母亲生日忘了打电话，借口加班"
];

type Stage = "input" | "generating" | "pick" | "submitting";

export default function SellPage() {
  const router = useRouter();
  const toast = useToast();
  const { anonId, hydrated } = useWallet();

  const [content, setContent] = useState("");
  const [stage, setStage] = useState<Stage>("input");
  const [candidates, setCandidates] = useState<GenerateCandidate[]>([]);
  const [pickIdx, setPickIdx] = useState(0);
  const [price, setPrice] = useState(30);
  const [crisis, setCrisis] = useState(false);
  const [llmEnabled, setLlmEnabled] = useState(true);

  useEffect(() => {
    if (candidates[pickIdx]) setPrice(candidates[pickIdx].suggestedPrice);
  }, [pickIdx, candidates]);

  async function generate() {
    const text = content.trim();
    if (text.length < 10) {
      toast.error("再多写一点，至少 10 个字");
      return;
    }
    if (text.length > 200) {
      toast.error("内容请控制在 200 字内");
      return;
    }
    setStage("generating");
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: text })
      });
      const data = (await res.json()) as {
        ok: boolean;
        reason?: string;
        candidates?: GenerateCandidate[];
        crisisHotline?: boolean;
        llmEnabled?: boolean;
      };
      if (!data.ok || !data.candidates?.length) {
        toast.error(data.reason || "生成失败");
        setStage("input");
        return;
      }
      setCandidates(data.candidates);
      setPickIdx(0);
      setCrisis(!!data.crisisHotline);
      setLlmEnabled(data.llmEnabled !== false);
      setStage("pick");
    } catch {
      toast.error("网络异常，请重试");
      setStage("input");
    }
  }

  async function publish() {
    const pick = candidates[pickIdx];
    if (!pick || !anonId) return;
    setStage("submitting");
    try {
      const res = await fetch("/api/medicines", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          sellerId: anonId,
          title: pick.title,
          content,
          comfortText: pick.comfortText,
          emojiSkin: pick.emojiSkin,
          pillColor: pick.pillColor,
          price: clamp(price, 5, 200),
          tags: pick.tags
        })
      });
      const data = (await res.json()) as { ok: boolean; reason?: string; medicine?: Medicine };
      if (!data.ok || !data.medicine) {
        toast.error(data.reason || "上架失败");
        setStage("pick");
        return;
      }
      toast.success("已挂上柜面，等人来抓药");
      router.push("/me?from=sell");
    } catch {
      toast.error("网络异常，请重试");
      setStage("pick");
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-2">
        <Link href="/" className="btn-ghost h-8 px-3 py-0 text-xs">
          <ArrowLeft className="h-3.5 w-3.5" />
          返回市集
        </Link>
        <h1 className="font-kai text-2xl text-ink-900">挂一颗后悔药</h1>
      </div>

      <div className="rounded-3xl border border-pill-100 bg-white/80 p-5 shadow-sm md:p-6">
        <label className="text-sm font-medium text-ink-800">
          1. 写下那件让你后悔的小事 <span className="text-ink-300">（10–200 字）</span>
        </label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={5}
          maxLength={200}
          disabled={stage !== "input" && stage !== "generating"}
          placeholder="例如：当年填志愿没听自己的，去了「稳」的那个专业…"
          className="mt-2 w-full resize-none rounded-2xl border border-rx-100 bg-white px-4 py-3 text-sm leading-relaxed text-ink-800 outline-none ring-pill-200 transition focus:border-pill-300 focus:ring-2"
        />
        <div className="mt-1 flex items-center justify-between text-xs text-ink-500">
          <span>不会公开你的真实身份。</span>
          <span className="tabular-nums">{content.length} / 200</span>
        </div>

        {stage === "input" && (
          <>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {SAMPLE_PROMPTS.map((p) => (
                <button
                  key={p}
                  type="button"
                  onClick={() => setContent(p)}
                  className="rounded-full border border-rx-200 bg-white px-2.5 py-1 text-xs text-ink-600 hover:bg-rx-50"
                >
                  {p}
                </button>
              ))}
            </div>

            <div className="mt-5 flex items-center justify-end gap-2">
              <button className="btn-primary" onClick={generate} disabled={content.trim().length < 10}>
                <Sparkles className="h-4 w-4" />
                AI 帮我配药
              </button>
            </div>
          </>
        )}

        {stage === "generating" && (
          <div className="mt-5 flex items-center justify-center gap-2 rounded-2xl bg-cream-100 p-5 text-sm text-ink-700">
            <FlaskConical className="h-4 w-4 animate-pulse text-pill-500" />
            正在熬药……AI 正在为你写三种不同风格的药丸。
          </div>
        )}
      </div>

      <AnimatePresence>
        {(stage === "pick" || stage === "submitting") && (
          <motion.div
            initial={{ y: 12, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ opacity: 0 }}
            className="rounded-3xl border border-pill-100 bg-white/80 p-5 shadow-sm md:p-6"
          >
            <div className="mb-3 flex items-baseline justify-between">
              <div>
                <div className="font-kai text-lg text-ink-900">2. 挑一颗你最喜欢的</div>
                <div className="text-xs text-ink-500">
                  {llmEnabled ? "由 AI 现配" : "AI 暂不可用，已使用本地兜底模板"}
                </div>
              </div>
              <button
                className="text-xs text-rx-600 hover:underline"
                onClick={() => {
                  setStage("input");
                  setCandidates([]);
                }}
              >
                重新生成
              </button>
            </div>

            {crisis && (
              <div className="mb-3 rounded-2xl border border-pill-200 bg-pill-50 p-3 text-xs text-pill-700">
                你这段话里有些沉重的字眼。如果你最近真的很难受，
                可以拨打全国心理援助热线 <span className="font-mono">12320-5</span>，他们 24 小时在线。
              </div>
            )}

            <div className="grid gap-3 md:grid-cols-3">
              {candidates.map((c, i) => (
                <button
                  key={i}
                  onClick={() => setPickIdx(i)}
                  className={cn(
                    "pill-card flex w-full flex-col items-stretch p-4 text-left transition",
                    pickIdx === i ? "ring-2 ring-pill-400" : "ring-0"
                  )}
                >
                  <div className="flex items-center justify-center pb-2">
                    <div
                      className="pill-shape relative flex h-16 w-24 items-center justify-center rounded-full text-xl text-white"
                      style={{ ["--pill-color" as string]: c.pillColor } as React.CSSProperties}
                    >
                      <span className="absolute inset-y-1.5 left-1/2 w-px -translate-x-1/2 bg-white/60" />
                      <span>{c.emojiSkin}</span>
                    </div>
                  </div>
                  <div className="text-center font-kai text-sm text-ink-900">{c.title}</div>
                  <div className="mt-1 flex flex-wrap justify-center gap-1">
                    {c.tags.map((t) => (
                      <span key={t} className="chip">
                        {t}
                      </span>
                    ))}
                  </div>
                  <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-ink-700">{c.comfortText}</p>
                  <div className="mt-2 text-center text-[11px] text-ink-500">
                    建议价 <span className="font-semibold text-pill-600">{c.suggestedPrice}</span> 释怀币
                  </div>
                </button>
              ))}
            </div>

            <div className="mt-5 grid items-end gap-3 md:grid-cols-[1fr_auto]">
              <div>
                <label className="text-sm font-medium text-ink-800">3. 给它定一个价</label>
                <div className="mt-2 flex items-center gap-3">
                  <input
                    type="range"
                    min={5}
                    max={200}
                    value={price}
                    onChange={(e) => setPrice(Number(e.target.value))}
                    className="flex-1 accent-pill-500"
                  />
                  <div className="inline-flex items-center gap-1 rounded-full border border-pill-200 bg-pill-50 px-3 py-1 text-sm text-pill-600">
                    <Coins className="h-4 w-4" />
                    <span className="font-semibold tabular-nums">{price}</span>
                  </div>
                </div>
                <p className="mt-1 text-[11px] text-ink-500">
                  越扎心的事卖得越贵；建议参考 AI 给的建议价。
                </p>
              </div>

              <button className="btn-primary" disabled={stage === "submitting"} onClick={publish}>
                {stage === "submitting" ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <Sparkles className="h-4 w-4" />
                )}
                挂到柜面
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {!hydrated && (
        <div className="rounded-2xl border border-dashed border-rx-200 bg-white/60 p-4 text-xs text-ink-500">
          正在为你开通匿名钱包……
        </div>
      )}
    </div>
  );
}
