"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Coins, Pill, ShoppingBag, Sparkles, Trash2 } from "lucide-react";
import { useWallet } from "@/components/WalletProvider";
import { resetAnonId } from "@/lib/anon";
import type { Medicine } from "@/lib/types";
import { formatRelative } from "@/lib/utils";

export default function MePage() {
  const { anonId, wallet, transactions, hydrated, refresh } = useWallet();
  const [listings, setListings] = useState<Medicine[]>([]);
  const [sold, setSold] = useState<Medicine[]>([]);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    if (!anonId) return;
    refresh();
    Promise.all([
      fetch(`/api/medicines?status=listed&sellerId=${anonId}&limit=100`).then((r) => r.json()),
      fetch(`/api/medicines?status=sold&sellerId=${anonId}&limit=100`).then((r) => r.json())
    ])
      .then(([a, b]) => {
        setListings((a?.medicines as Medicine[]) || []);
        setSold((b?.medicines as Medicine[]) || []);
      })
      .finally(() => setLoaded(true));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [anonId]);

  if (!hydrated) {
    return <div className="text-sm text-ink-500">正在打开你的抽屉…</div>;
  }

  return (
    <div className="space-y-6">
      <section className="rounded-3xl border border-pill-100 bg-gradient-to-br from-cream-50 to-pill-50 p-5 shadow-sm md:p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className="text-xs tracking-widest text-ink-500">我的钱包</div>
            <div className="mt-1 flex items-baseline gap-2">
              <span className="text-3xl font-semibold text-pill-600 tabular-nums">{wallet?.balance ?? "—"}</span>
              <span className="text-sm text-ink-500">释怀币</span>
            </div>
            <div className="mt-1 text-[11px] text-ink-300">
              匿名 ID：<span className="font-mono">{anonId.slice(0, 18)}…</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/sell" className="btn-primary">
              <Sparkles className="h-4 w-4" />
              挂一颗
            </Link>
            <Link href="/" className="btn-ghost">
              <ShoppingBag className="h-4 w-4" />
              逛市集
            </Link>
          </div>
        </div>
      </section>

      <Section title={`我的挂单（${listings.length}）`} icon={<Pill className="h-4 w-4 text-pill-500" />}>
        {!loaded ? (
          <Skeleton />
        ) : listings.length === 0 ? (
          <Empty hint="还没有挂单。" cta={<Link href="/sell" className="text-pill-600 underline">去挂第一颗</Link>} />
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {listings.map((m) => (
              <SmallCard key={m.id} medicine={m} statusLabel="挂单中" />
            ))}
          </div>
        )}
      </Section>

      <Section title={`已卖出（${sold.length}）`} icon={<Coins className="h-4 w-4 text-emerald-600" />}>
        {!loaded ? (
          <Skeleton />
        ) : sold.length === 0 ? (
          <Empty hint="还没人买过你的药丸。" />
        ) : (
          <div className="grid grid-cols-2 gap-3 md:grid-cols-3 lg:grid-cols-4">
            {sold.map((m) => (
              <SmallCard key={m.id} medicine={m} statusLabel="已售出" />
            ))}
          </div>
        )}
      </Section>

      <Section title={`我的开解话收藏（${transactions.length}）`} icon={<Sparkles className="h-4 w-4 text-rx-500" />}>
        {transactions.length === 0 ? (
          <Empty hint="还没收藏。买一颗别人的药丸就能解锁。" />
        ) : (
          <div className="space-y-3">
            {transactions.map((tx) => (
              <article key={tx.id} className="prescription-paper relative px-4 py-4">
                <div className="absolute right-3 top-3">
                  <span className="seal text-[11px]">已发药</span>
                </div>
                <div className="font-kai text-base text-ink-900">{tx.medicineTitle}</div>
                <p className="mt-1 whitespace-pre-line font-kai text-[14px] leading-7 text-ink-800">
                  {tx.comfortTextSnapshot}
                </p>
                <div className="mt-2 flex items-center justify-between border-t border-dashed border-rx-200 pt-2 text-[11px] text-ink-500">
                  <span>购于 {new Date(tx.createdAt).toLocaleString("zh-CN")}</span>
                  <span>花了 {tx.price} 释怀币</span>
                </div>
              </article>
            ))}
          </div>
        )}
      </Section>

      <div className="pt-4">
        <button
          className="btn-ghost text-xs text-ink-500"
          onClick={() => {
            if (confirm("确定要重置匿名身份吗？这会清空你的钱包和收藏。")) {
              resetAnonId();
              window.location.href = "/";
            }
          }}
        >
          <Trash2 className="h-3.5 w-3.5" />
          重置我的匿名身份
        </button>
      </div>
    </div>
  );
}

function Section({ title, icon, children }: { title: string; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="font-kai text-lg text-ink-900 inline-flex items-center gap-2">
        {icon}
        {title}
      </h2>
      {children}
    </section>
  );
}

function Skeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="h-44 animate-pulse rounded-2xl bg-cream-100" />
      ))}
    </div>
  );
}

function Empty({ hint, cta }: { hint: string; cta?: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-rx-200 bg-white/60 p-6 text-center text-sm text-ink-500">
      {hint}
      {cta ? <div className="mt-1">{cta}</div> : null}
    </div>
  );
}

function SmallCard({ medicine, statusLabel }: { medicine: Medicine; statusLabel: string }) {
  return (
    <div className="pill-card p-3">
      <div className="flex items-center justify-between text-[11px] text-ink-500">
        <span>{statusLabel}</span>
        <span>{formatRelative(medicine.createdAt)}</span>
      </div>
      <div className="my-2 flex items-center justify-center">
        <div
          className="pill-shape relative flex h-14 w-24 items-center justify-center rounded-full text-base text-white"
          style={{ ["--pill-color" as string]: medicine.pillColor } as React.CSSProperties}
        >
          <span className="absolute inset-y-1 left-1/2 w-px -translate-x-1/2 bg-white/60" />
          <span>{medicine.emojiSkin}</span>
        </div>
      </div>
      <div className="font-kai text-sm text-ink-900 line-clamp-1">{medicine.title}</div>
      <div className="mt-1 flex items-center justify-between text-[11px]">
        <span className="text-ink-500 line-clamp-1">{medicine.tags.join("·")}</span>
        <span className="inline-flex items-center gap-0.5 text-pill-600">
          <Coins className="h-3 w-3" />
          {medicine.price}
        </span>
      </div>
    </div>
  );
}
