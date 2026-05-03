import Link from "next/link";
import { listMedicines, getStoreStats } from "@/lib/store";
import { MarketBoard } from "@/components/MarketBoard";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const medicines = await listMedicines({ limit: 60 });
  const stats = await getStoreStats();

  return (
    <div className="space-y-8">
      <section className="relative overflow-hidden rounded-3xl border border-pill-100 bg-gradient-to-br from-pill-50 via-cream-50 to-rx-50 px-6 py-8 shadow-sm md:px-10 md:py-12">
        <div className="absolute -right-16 -top-10 h-48 w-48 rounded-full bg-pill-100/70 blur-3xl" />
        <div className="absolute -bottom-20 -left-10 h-56 w-56 rounded-full bg-rx-100/70 blur-3xl" />

        <div className="relative grid gap-8 md:grid-cols-[1.4fr_1fr] md:items-center">
          <div>
            <div className="mb-2 inline-flex items-center gap-1 rounded-full border border-pill-200 bg-white/70 px-3 py-1 text-[11px] tracking-widest text-pill-600">
              RegretMart · 一颗药丸的轻声安慰
            </div>
            <h1 className="font-kai text-3xl leading-tight text-ink-900 md:text-4xl">
              把你的后悔，<br className="md:hidden" />做成一颗药丸挂出来卖。
            </h1>
            <p className="mt-3 max-w-md text-sm leading-relaxed text-ink-700">
              AI 替你写好药丸名、配好开解话；
              别人花<span className="text-pill-600">「释怀币」</span>买走时，你也卸下了一点点。
              不用注册，进来就送 <span className="font-semibold text-pill-600">100 释怀币</span>。
            </p>
            <div className="mt-5 flex flex-wrap items-center gap-2">
              <Link href="/sell" className="btn-primary">
                我有一颗后悔药要挂
              </Link>
              <a href="#market" className="btn-ghost">
                先看看别人的
              </a>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-x-6 gap-y-1 text-xs text-ink-500">
              <span>
                市集存货 <span className="font-semibold text-ink-900 tabular-nums">{stats.listed}</span> 颗
              </span>
              <span>
                已开方 <span className="font-semibold text-ink-900 tabular-nums">{stats.sold}</span> 张
              </span>
              <span>2 分钟可体验主流程 · 无需注册</span>
            </div>
          </div>

          <PrescriptionDemo />
        </div>
      </section>

      <section id="market" className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <div>
            <h2 className="font-kai text-2xl text-ink-900">今日柜面</h2>
            <p className="text-xs text-ink-500">点击任意药丸即可买走，会得到 AI 写的一句开解话。</p>
          </div>
        </div>

        <MarketBoard initialMedicines={medicines} />
      </section>
    </div>
  );
}

function PrescriptionDemo() {
  return (
    <div className="prescription-paper relative mx-auto w-full max-w-sm px-5 py-5">
      <div className="absolute right-3 top-3">
        <span className="seal text-[11px]">样方</span>
      </div>
      <div className="flex items-center gap-3 border-b border-dashed border-rx-200 pb-3">
        <div
          className="pill-shape relative flex h-12 w-20 shrink-0 items-center justify-center rounded-full text-base text-white"
          style={{ ["--pill-color" as string]: "#f1839f" } as React.CSSProperties}
        >
          <span className="absolute inset-y-1 left-1/2 w-px -translate-x-1/2 bg-white/60" />
          <span>💊✨</span>
        </div>
        <div className="min-w-0">
          <div className="font-kai text-base text-ink-900">没说出口的告别丸</div>
          <div className="text-[11px] text-ink-500">Rx · No.SAMPLE</div>
        </div>
      </div>
      <div className="pt-3">
        <div className="text-[11px] tracking-widest text-rx-600">疗效说明</div>
        <p className="mt-1 whitespace-pre-line font-kai text-[15px] leading-7 text-ink-900">
          那句话不必再说给 TA，可以说给现在身边的人。
          沉默的代价你已经付过，
          但温柔可以接力——从今晚的一句"我在"开始。
        </p>
      </div>
      <div className="mt-3 border-t border-dashed border-rx-200 pt-2 text-right text-[11px] text-ink-500">
        发药 · 后悔药交易所
      </div>
    </div>
  );
}
