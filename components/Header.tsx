"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useWallet } from "./WalletProvider";
import { Coins, Pill, PenLine, User } from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { href: "/", label: "市集", icon: Pill },
  { href: "/sell", label: "上架", icon: PenLine },
  { href: "/me", label: "我的", icon: User }
];

export function Header() {
  const path = usePathname();
  const { wallet, hydrated } = useWallet();

  return (
    <header className="sticky top-0 z-30 border-b border-pill-100/60 bg-cream-50/80 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="flex items-center gap-2">
          <span className="relative inline-flex h-8 w-12 items-center justify-center rounded-full bg-gradient-to-br from-pill-300 to-rx-300 text-white shadow-pill">
            <span className="absolute inset-y-0 left-1/2 w-px bg-white/70" />
            <span className="text-[10px] font-semibold tracking-widest">RX</span>
          </span>
          <div className="leading-tight">
            <div className="font-kai text-lg text-ink-900">后悔药交易所</div>
            <div className="text-[10px] tracking-widest text-ink-500">RegretMart · 仅供体验</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {NAV.map((n) => {
            const active = path === n.href;
            const Icon = n.icon;
            return (
              <Link
                key={n.href}
                href={n.href}
                className={cn(
                  "inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm transition",
                  active ? "bg-pill-500 text-white shadow-pill" : "text-ink-700 hover:bg-cream-100"
                )}
              >
                <Icon className="h-4 w-4" />
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 rounded-full border border-pill-200 bg-white/80 px-3 py-1.5 text-sm shadow-sm">
            <Coins className="h-4 w-4 text-pill-500" />
            <span className="font-semibold text-pill-600 tabular-nums">
              {hydrated ? (wallet?.balance ?? "—") : "—"}
            </span>
            <span className="text-[10px] tracking-widest text-ink-500">释怀币</span>
          </div>
        </div>
      </div>

      <nav className="flex items-center justify-around border-t border-pill-100/60 bg-cream-50/95 py-1.5 md:hidden">
        {NAV.map((n) => {
          const active = path === n.href;
          const Icon = n.icon;
          return (
            <Link
              key={n.href}
              href={n.href}
              className={cn(
                "inline-flex flex-col items-center gap-0.5 rounded-lg px-3 py-1 text-[11px]",
                active ? "text-pill-600" : "text-ink-500"
              )}
            >
              <Icon className="h-4 w-4" />
              {n.label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
