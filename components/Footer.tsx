import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-rx-100/70 bg-cream-50/80">
      <div className="mx-auto max-w-6xl px-4 py-6 text-xs leading-relaxed text-ink-500 md:px-6">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <div className="font-kai text-sm text-ink-800">关于本作品</div>
            <p className="mt-1">
              RegretMart 是一款以情绪互助为主题的虚拟市集 demo。
              所有商品、价格、释怀币均为体验道具，
              <span className="font-medium text-pill-600">不可充值、不可提现、无现实价值</span>。
            </p>
          </div>
          <div>
            <div className="font-kai text-sm text-ink-800">心理援助</div>
            <p className="mt-1">
              如果你正经历严重情绪困扰，请联系：
              <br />
              · 全国心理援助热线 <span className="font-mono">12320-5</span>
              <br />
              · 北京心理危机干预 <span className="font-mono">010-82951332</span>
            </p>
          </div>
          <div>
            <div className="font-kai text-sm text-ink-800">条款</div>
            <ul className="mt-1 space-y-0.5">
              <li>
                <Link className="hover:text-pill-600" href="/about">
                  作品说明 · 隐私 · 免责
                </Link>
              </li>
              <li>未成年人请在监护人指导下使用</li>
              <li>本站不收集任何 PII，仅使用浏览器随机标识</li>
            </ul>
          </div>
        </div>
        <div className="mt-5 border-t border-rx-100 pt-3 text-center text-[11px] text-ink-300">
          © {new Date().getFullYear()} RegretMart · 一颗药丸的轻声安慰
        </div>
      </div>
    </footer>
  );
}
