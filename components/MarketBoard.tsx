"use client";

import { useEffect, useMemo, useState } from "react";
import type { Medicine } from "@/lib/types";
import { MedicineCard } from "./MedicineCard";
import { BuyDialog } from "./BuyDialog";
import { Filter, RefreshCw } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  initialMedicines: Medicine[];
}

const TAGS = [
  "全部",
  "爱情",
  "亲情",
  "友情",
  "求学",
  "职场",
  "金钱",
  "健康",
  "焦虑",
  "告别",
  "选择",
  "冲动",
  "遗憾",
  "勇气",
  "青春",
  "自责"
];

const SORTS: Array<{ id: "newest" | "cheapest" | "priciest"; label: string }> = [
  { id: "newest", label: "最新挂出" },
  { id: "cheapest", label: "最便宜" },
  { id: "priciest", label: "最贵" }
];

export function MarketBoard({ initialMedicines }: Props) {
  const [medicines, setMedicines] = useState<Medicine[]>(initialMedicines);
  const [tag, setTag] = useState<string>("全部");
  const [sort, setSort] = useState<"newest" | "cheapest" | "priciest">("newest");
  const [openMed, setOpenMed] = useState<Medicine | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const visible = useMemo(() => {
    let arr = [...medicines];
    if (tag !== "全部") arr = arr.filter((m) => m.tags.includes(tag));
    arr.sort((a, b) => {
      if (sort === "cheapest") return a.price - b.price;
      if (sort === "priciest") return b.price - a.price;
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });
    return arr;
  }, [medicines, tag, sort]);

  async function refresh() {
    setRefreshing(true);
    try {
      const res = await fetch("/api/medicines?status=listed&limit=120", { cache: "no-store" });
      const data = (await res.json()) as { ok: boolean; medicines?: Medicine[] };
      if (data.ok && data.medicines) {
        setMedicines((prev) => mergeMedicines(prev, data.medicines!));
      }
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    const t = setInterval(refresh, 25_000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div>
      <div className="flex flex-wrap items-center gap-3 pb-3">
        <div className="flex items-center gap-1 rounded-full border border-rx-200 bg-white/80 px-1 py-1 text-xs">
          {SORTS.map((s) => (
            <button
              key={s.id}
              onClick={() => setSort(s.id)}
              className={cn(
                "rounded-full px-3 py-1 transition",
                sort === s.id ? "bg-rx-500 text-white" : "text-ink-600 hover:bg-rx-50"
              )}
            >
              {s.label}
            </button>
          ))}
        </div>
        <button
          className={cn(
            "btn-ghost h-8 px-3 py-0 text-xs",
            refreshing && "opacity-60"
          )}
          onClick={refresh}
          disabled={refreshing}
        >
          <RefreshCw className={cn("h-3.5 w-3.5", refreshing && "animate-spin")} />
          刷新
        </button>
        <div className="hidden flex-1 items-center justify-end text-xs text-ink-500 md:flex">
          <Filter className="mr-1 h-3 w-3" /> 标签筛选 ↓
        </div>
      </div>

      <div className="-mx-1 mb-4 flex flex-wrap gap-1.5 px-1">
        {TAGS.map((t) => (
          <button
            key={t}
            onClick={() => setTag(t)}
            className={cn(
              "rounded-full border px-2.5 py-0.5 text-xs transition",
              tag === t
                ? "border-pill-300 bg-pill-500 text-white"
                : "border-rx-200 bg-white/70 text-ink-600 hover:bg-rx-50"
            )}
          >
            {t}
          </button>
        ))}
      </div>

      {visible.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-rx-200 bg-white/60 p-10 text-center text-sm text-ink-500">
          这个标签下暂时没有药丸。<br />
          要不要去 <a href="/sell" className="text-pill-600 underline">挂一颗自己的</a>？
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4 lg:grid-cols-4">
          {visible.map((m) => (
            <MedicineCard
              key={m.id}
              medicine={m}
              onClick={() => m.status === "listed" && setOpenMed(m)}
              disabled={m.status !== "listed"}
            />
          ))}
        </div>
      )}

      <BuyDialog
        medicine={openMed}
        onClose={() => setOpenMed(null)}
        onBought={(updated) => {
          setMedicines((arr) => arr.map((x) => (x.id === updated.id ? updated : x)));
        }}
      />
    </div>
  );
}

function mergeMedicines(prev: Medicine[], next: Medicine[]): Medicine[] {
  const map = new Map(prev.map((m) => [m.id, m]));
  for (const m of next) map.set(m.id, m);
  return Array.from(map.values());
}
