import Link from "next/link";

export default function AboutPage() {
  return (
    <article className="prose mx-auto max-w-2xl space-y-6 text-ink-800">
      <header>
        <h1 className="font-kai text-3xl text-ink-900">关于「后悔药交易所」</h1>
        <p className="text-sm text-ink-500">
          一颗药丸的轻声安慰 · RegretMart · {new Date().getFullYear()}
        </p>
      </header>

      <section>
        <h2 className="font-kai text-lg">这是什么</h2>
        <p className="text-sm leading-relaxed">
          这是一个把"后悔事"做成"虚拟药丸"挂上市集的小作品。
          你写一段后悔的小事，AI 替你设计药丸名、配上一句开解话；
          其他人觉得共鸣，就花<span className="text-pill-600">"释怀币"</span>买走，
          你也因此卸下一点。整个过程不超过 2 分钟，不需要注册。
        </p>
      </section>

      <section>
        <h2 className="font-kai text-lg">合规与边界</h2>
        <ul className="list-disc pl-5 text-sm leading-relaxed">
          <li>
            <strong>无现实价值</strong>：所有商品、价格、释怀币均为体验道具，
            <span className="text-pill-600">不可充值、不可提现</span>。
          </li>
          <li>
            <strong>内容审核</strong>：上架内容会经过关键词黑名单与
            AI 二次审核，涉及政治、违法、色情、未成年人不适等内容会被拒绝。
          </li>
          <li>
            <strong>不替代心理咨询</strong>：本站提供的是同理共鸣，不是医疗建议。
            如果你正经历严重情绪困扰，请联系
            全国心理援助热线 <span className="font-mono">12320-5</span> 或
            北京心理危机干预 <span className="font-mono">010-82951332</span>。
          </li>
          <li>
            <strong>未成年提示</strong>：未成年人请在监护人指导下使用。
          </li>
        </ul>
      </section>

      <section>
        <h2 className="font-kai text-lg">隐私</h2>
        <p className="text-sm leading-relaxed">
          我们不收集任何个人身份信息（PII）。
          匿名身份基于浏览器随机生成的 ID，
          仅用于让你的钱包余额和挂单在同一台设备上保留。
          清除浏览器数据或在「我的 → 重置匿名身份」即可一键抹除。
        </p>
      </section>

      <section>
        <h2 className="font-kai text-lg">免责声明</h2>
        <p className="text-sm leading-relaxed">
          作品由 AI 生成的开解话、药丸名等内容仅供情感共鸣之用，
          不构成任何专业建议（包括但不限于心理、医疗、法律、投资）。
          作者尽力优化生成质量，但不对内容的准确性、适用性作任何保证。
          请按个人情况理性参考。
        </p>
      </section>

      <section>
        <h2 className="font-kai text-lg">联系</h2>
        <p className="text-sm leading-relaxed">
          这是一个 hackathon 作品，欢迎反馈意见。
          <Link href="/" className="text-pill-600 underline">
            回到市集
          </Link>
        </p>
      </section>
    </article>
  );
}
