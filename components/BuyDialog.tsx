"use client";

import { AnimatePresence, motion } from "framer-motion";
import { forwardRef, useEffect, useRef, useState } from "react";
import { Coins, Copy, Download, Heart, Loader2, X } from "lucide-react";
import type { Medicine, Transaction, Wallet } from "@/lib/types";
import { useToast } from "./ToastProvider";
import { useWallet } from "./WalletProvider";
import { addFavorite } from "@/lib/anon";

interface Props {
  medicine: Medicine | null;
  onClose(): void;
  onBought(updated: Medicine): void;
}

type Stage = "confirm" | "loading" | "revealed" | "error";

export function BuyDialog({ medicine, onClose, onBought }: Props) {
  const { anonId, wallet, applyWallet, applyTransaction } = useWallet();
  const toast = useToast();
  const [stage, setStage] = useState<Stage>("confirm");
  const [errorMsg, setErrorMsg] = useState("");
  const [tx, setTx] = useState<Transaction | null>(null);
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (medicine) {
      setStage("confirm");
      setTx(null);
      setErrorMsg("");
    }
  }, [medicine]);

  useEffect(() => {
    if (!medicine) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [medicine, onClose]);

  if (!medicine) return null;

  const insufficient = (wallet?.balance ?? 0) < medicine.price;
  const isOwn = wallet && medicine.sellerId === anonId;

  async function confirmBuy() {
    if (!medicine) return;
    setStage("loading");
    try {
      const res = await fetch(`/api/medicines/${medicine.id}/buy`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ buyerId: anonId })
      });
      const data = (await res.json()) as {
        ok: boolean;
        reason?: string;
        medicine?: Medicine;
        wallet?: Wallet;
        transaction?: Transaction;
      };
      if (!data.ok || !data.transaction || !data.wallet || !data.medicine) {
        setErrorMsg(data.reason || "出错了，再试一次？");
        setStage("error");
        return;
      }
      applyWallet(data.wallet);
      applyTransaction(data.transaction);
      addFavorite(data.transaction.id);
      onBought(data.medicine);
      setTx(data.transaction);
      setStage("revealed");
    } catch (err) {
      setErrorMsg(String(err));
      setStage("error");
    }
  }

  async function copyComfort() {
    if (!medicine) return;
    const text = `『${medicine.title}』\n\n${medicine.comfortText}\n\n— 来自 后悔药交易所 RegretMart`;
    try {
      await navigator.clipboard.writeText(text);
      toast.success("已复制到剪贴板");
    } catch {
      toast.error("复制失败，请手动选中");
    }
  }

  async function downloadCard() {
    const med = medicine;
    const cardEl = cardRef.current;
    if (!med || !cardEl) return;
    try {
      const mod = await import("html-to-image");
      const dataUrl = await mod.toPng(cardEl, { pixelRatio: 2, cacheBust: true });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${med.title}.png`;
      a.click();
      toast.success("已保存图片");
    } catch (err) {
      console.error(err);
      toast.error("生成图片失败");
    }
  }

  return (
    <AnimatePresence>
      <motion.div
        key="overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-ink-900/40 p-4 backdrop-blur"
        onClick={onClose}
      >
        <motion.div
          key="modal"
          initial={{ y: 16, opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 12, opacity: 0, scale: 0.97 }}
          transition={{ type: "spring", stiffness: 280, damping: 26 }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute right-3 top-3 z-10 rounded-full bg-cream-100 p-1.5 text-ink-500 transition hover:text-ink-900"
            aria-label="关闭"
          >
            <X className="h-4 w-4" />
          </button>

          {(stage === "confirm" || stage === "loading" || stage === "error") && (
            <ConfirmStage
              medicine={medicine}
              wallet={wallet}
              loading={stage === "loading"}
              insufficient={insufficient}
              isOwn={!!isOwn}
              errorMsg={stage === "error" ? errorMsg : ""}
              onCancel={onClose}
              onConfirm={confirmBuy}
            />
          )}

          {stage === "revealed" && tx && (
            <RevealedStage
              ref={cardRef}
              medicine={medicine}
              transaction={tx}
              onCopy={copyComfort}
              onDownload={downloadCard}
              onClose={onClose}
            />
          )}
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

interface ConfirmProps {
  medicine: Medicine;
  wallet: Wallet | null;
  loading: boolean;
  insufficient: boolean;
  isOwn: boolean;
  errorMsg: string;
  onCancel(): void;
  onConfirm(): void;
}

function ConfirmStage({ medicine, wallet, loading, insufficient, isOwn, errorMsg, onCancel, onConfirm }: ConfirmProps) {
  return (
    <div className="px-6 pb-6 pt-7">
      <div className="flex items-center justify-center pb-3">
        <div
          className="pill-shape relative flex h-20 w-32 items-center justify-center rounded-full text-2xl text-white"
          style={{ "--pill-color": medicine.pillColor } as React.CSSProperties}
        >
          <span className="absolute inset-y-2 left-1/2 w-px -translate-x-1/2 bg-white/60" />
          <span>{medicine.emojiSkin}</span>
        </div>
      </div>
      <h2 className="text-center font-kai text-xl text-ink-900">{medicine.title}</h2>
      <p className="mx-auto mt-2 max-w-sm whitespace-pre-line text-center text-sm leading-relaxed text-ink-700">
        {medicine.content}
      </p>
      <div className="mt-4 flex items-center justify-center gap-2 text-sm">
        <Coins className="h-4 w-4 text-pill-500" />
        <span className="text-pill-600">
          价格 <span className="font-semibold">{medicine.price}</span> 释怀币
        </span>
        <span className="text-ink-300">·</span>
        <span className="text-ink-500">
          你有 <span className="tabular-nums">{wallet?.balance ?? "—"}</span>
        </span>
      </div>

      {isOwn ? (
        <p className="mt-4 rounded-xl bg-cream-100 p-3 text-center text-xs text-ink-500">
          这是你自己挂上的药丸，不能买给自己。
        </p>
      ) : insufficient ? (
        <p className="mt-4 rounded-xl bg-pill-50 p-3 text-center text-xs text-pill-600">
          释怀币不够。可以先去市集挂一颗自己的后悔药赚一点。
        </p>
      ) : null}

      {errorMsg && (
        <p className="mt-4 rounded-xl bg-pill-50 p-3 text-center text-xs text-pill-600">{errorMsg}</p>
      )}

      <div className="mt-6 flex items-center justify-center gap-2">
        <button className="btn-ghost" onClick={onCancel}>
          再看看
        </button>
        <button className="btn-primary" disabled={loading || isOwn || insufficient} onClick={onConfirm}>
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Heart className="h-4 w-4" />}
          {loading ? "正在配药…" : `花 ${medicine.price} 释怀币买走`}
        </button>
      </div>
    </div>
  );
}

interface RevealedProps {
  medicine: Medicine;
  transaction: Transaction;
  onCopy(): void;
  onDownload(): void;
  onClose(): void;
}

const RevealedStage = forwardRef<HTMLDivElement, RevealedProps>(function RevealedStage(
  { medicine, transaction, onCopy, onDownload, onClose },
  ref
) {
  return (
    <div className="relative">
      <motion.div
        initial={{ rotateY: 90, opacity: 0 }}
        animate={{ rotateY: 0, opacity: 1 }}
        transition={{ duration: 0.55, ease: [0.2, 0.8, 0.2, 1] }}
        className="px-6 pb-5 pt-7"
        style={{ transformPerspective: 800 }}
      >
        <div ref={ref} className="prescription-paper relative px-5 py-5">
          <div className="absolute right-3 top-3">
            <span className="seal text-[11px]">已发药</span>
          </div>
          <div className="flex items-center gap-3 border-b border-dashed border-rx-200 pb-3">
            <div
              className="pill-shape relative flex h-12 w-20 shrink-0 items-center justify-center rounded-full text-base text-white"
              style={{ "--pill-color": medicine.pillColor } as React.CSSProperties}
            >
              <span className="absolute inset-y-1 left-1/2 w-px -translate-x-1/2 bg-white/60" />
              <span>{medicine.emojiSkin}</span>
            </div>
            <div className="min-w-0">
              <div className="font-kai text-base text-ink-900">{medicine.title}</div>
              <div className="text-[11px] text-ink-500">
                Rx · No.{transaction.id.slice(-6).toUpperCase()}
              </div>
            </div>
          </div>
          <div className="pt-3">
            <div className="text-[11px] tracking-widest text-rx-600">疗效说明</div>
            <p className="mt-1 whitespace-pre-line font-kai text-[15px] leading-7 text-ink-900">
              {medicine.comfortText}
            </p>
          </div>
          <div className="mt-3 border-t border-dashed border-rx-200 pt-2 text-right text-[11px] text-ink-500">
            发药日期 {new Date(transaction.createdAt).toLocaleString("zh-CN")} · 后悔药交易所
          </div>
        </div>
      </motion.div>

      <div className="flex items-center justify-center gap-2 px-6 pb-6">
        <button className="btn-ghost" onClick={onCopy}>
          <Copy className="h-4 w-4" />
          复制
        </button>
        <button className="btn-soft" onClick={onDownload}>
          <Download className="h-4 w-4" />
          保存图片
        </button>
        <button className="btn-primary" onClick={onClose}>
          收下
        </button>
      </div>
    </div>
  );
});
