"use client";

import { motion } from "framer-motion";
import { Coins, Tag } from "lucide-react";
import type { Medicine } from "@/lib/types";
import { cn, formatRelative } from "@/lib/utils";

interface Props {
  medicine: Medicine;
  onClick?(): void;
  disabled?: boolean;
  badge?: string;
}

export function MedicineCard({ medicine, onClick, disabled, badge }: Props) {
  const isSold = medicine.status === "sold";
  const skin = (medicine.emojiSkin || "💊").trim();

  return (
    <motion.button
      type="button"
      whileHover={{ y: -4 }}
      whileTap={{ scale: 0.985 }}
      onClick={disabled ? undefined : onClick}
      className={cn(
        "pill-card group relative flex h-full w-full flex-col items-stretch overflow-hidden p-4 text-left",
        disabled && "cursor-default opacity-60",
        isSold && "grayscale"
      )}
    >
      {badge ? (
        <div className="absolute right-3 top-3 z-10">
          <span className="seal text-[11px]">{badge}</span>
        </div>
      ) : null}
      {isSold ? (
        <div className="absolute right-3 top-3 z-10">
          <span className="seal text-[11px]">已发药</span>
        </div>
      ) : null}

      <div className="flex items-center justify-center pb-3">
        <div
          className="pill-shape relative flex h-20 w-32 items-center justify-center rounded-full text-2xl tracking-widest text-white animate-floaty"
          style={{ "--pill-color": medicine.pillColor } as React.CSSProperties}
        >
          <span className="absolute inset-y-2 left-1/2 w-px -translate-x-1/2 bg-white/60" />
          <span className="drop-shadow-sm">{skin}</span>
        </div>
      </div>

      <h3 className="font-kai text-base text-ink-900 line-clamp-1">{medicine.title}</h3>

      <p className="mt-1 line-clamp-2 text-xs leading-relaxed text-ink-700">
        {medicine.content}
      </p>

      <div className="mt-2 flex flex-wrap gap-1.5">
        {medicine.tags.slice(0, 3).map((t) => (
          <span key={t} className="chip">
            <Tag className="h-3 w-3" />
            {t}
          </span>
        ))}
      </div>

      <div className="mt-3 flex items-center justify-between border-t border-dashed border-pill-100 pt-2 text-xs text-ink-500">
        <span>{formatRelative(medicine.createdAt)}</span>
        <span className="inline-flex items-center gap-1 rounded-full bg-pill-50 px-2 py-0.5 text-pill-600">
          <Coins className="h-3 w-3" />
          <span className="font-semibold tabular-nums">{medicine.price}</span>
        </span>
      </div>
    </motion.button>
  );
}
