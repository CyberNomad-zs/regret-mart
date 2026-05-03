# 后悔药交易所 · RegretMart

> 把后悔变成药丸挂上市集，AI 配药、虚拟币交易，2 分钟体验情绪互助经济。

一个 hackathon 作品，主题「做个市场」。把无形的"后悔事"做成"药丸商品"——
每颗药丸是一段后悔，价格是其重量，开解话是疗效。

## 核心特性

- 进入即送 **100 释怀币**，无需注册、无需登录
- 挂单：写下后悔事 → AI 写药丸名 + 配开解话 → 定价上架
- 购买：花释怀币买走 → 翻牌动画揭晓开解话 → 一键复制 / 保存图片
- 内置 8+ 颗精心写好的种子药丸，开箱即用
- LLM 未配置时自动降级为本地兜底模板，**零 API key 也能跑**
- 内容审核两道闸：关键词黑名单 + 长度/敏感词过滤
- 完整合规页（关于 / 隐私 / 免责 / 心理援助热线）

## 技术栈

- [Next.js 15](https://nextjs.org/) (App Router) + React 19 + TypeScript
- [Tailwind CSS 3](https://tailwindcss.com/)
- [Framer Motion](https://www.framer.com/motion/) （翻牌动画）
- [lucide-react](https://lucide.dev/)（图标）
- [html-to-image](https://github.com/bubkoo/html-to-image)（开解话保存图片）
- 默认 **内存存储**，每次冷启动重新种子；可选接入 Supabase 持久化
- 默认 **LLM 关闭**，使用本地模板；可选接入 DeepSeek / OpenAI 兼容 API

## 本地开发

```bash
npm install
cp .env.example .env.local      # 可选，留空也能跑
npm run dev
```

打开 http://localhost:3002 即可看到市集（`npm run dev` 默认端口见 `package.json`）。

## 环境变量

> 全部可选。不填任何值时，使用「内存存储 + 本地兜底模板」。

```bash
# LLM —— 任选其一，留空则使用本地模板（也很好看）
DEEPSEEK_API_KEY=
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-chat

OPENAI_API_KEY=
OPENAI_BASE_URL=https://api.openai.com/v1
OPENAI_MODEL=gpt-4o-mini

# 后台一键下架 key
ADMIN_KEY=change-me

# 公开站点 URL（可选，用于 OG / 分享）
NEXT_PUBLIC_SITE_URL=https://your-domain.vercel.app
```

## 部署到 Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyou%2Fregret-mart&env=DEEPSEEK_API_KEY%2CADMIN_KEY)

1. 把仓库推到 GitHub
2. Vercel → Add New Project → Import 该仓库
3. 在 Vercel 项目设置里把上面的环境变量配上（可全部留空）
4. Deploy。完成后会得到 `https://<project>.vercel.app`

> 注意：默认使用内存存储，Serverless 冷启动会重置数据。
> 如果要持久化，可在 `lib/store.ts` 接入 Supabase REST 或 Vercel KV。

## 部署到 Netlify

仓库根目录已包含 [`netlify.toml`](netlify.toml) 与 [`@netlify/plugin-nextjs`](https://www.npmjs.com/package/@netlify/plugin-nextjs)，用于 SSR / API Routes。

1. 将代码推送到 GitHub / GitLab / Bitbucket。
2. 登录 [Netlify](https://app.netlify.com/) → **Add new site** → **Import an existing project**，授权仓库。
3. **Build settings**（一般会自动识别）：
   - Build command: `npm run build`
   - 无需手动填写 Publish directory：由 `@netlify/plugin-nextjs` 接管。
4. 在 **Site configuration → Environment variables** 中按需添加与上文「环境变量」一节相同的变量（可全部留空）。
5. **Deploy site**。站点首页形如 `https://<name>.netlify.app`。

可选：本地预览 Netlify 构建使用 [Netlify CLI](https://docs.netlify.com/cli/get-started/)：`npm i -g netlify-cli` → 在项目根目录执行 `netlify dev`。

## 目录结构

```
app/
  layout.tsx              # 全局布局 + Provider
  page.tsx                # 市集首页（SSR）
  sell/page.tsx           # 上架页（AI 生成 3 候选）
  me/page.tsx             # 我的钱包 + 挂单 + 收藏
  about/page.tsx          # 关于 / 隐私 / 免责
  api/medicines/route.ts          # GET 列表 / POST 上架
  api/medicines/[id]/buy/route.ts # POST 买入
  api/generate/route.ts            # POST AI 配药
  api/wallet/route.ts               # GET 钱包 + 交易
  api/admin/delist/route.ts         # 后台下架
components/
  Header.tsx, Footer.tsx
  MedicineCard.tsx                  # 药丸卡片
  BuyDialog.tsx                      # 买入弹窗 + 翻牌揭晓
  MarketBoard.tsx                    # 市集 Grid + 筛选 + 自动刷新
  ToastProvider.tsx                  # 全局 Toast
  WalletProvider.tsx                 # 钱包上下文
lib/
  types.ts, utils.ts
  anon.ts          # 客户端：浏览器指纹 + localStorage
  store.ts         # 服务端：内存存储 + 种子
  seed-data.ts     # 12 颗预置药丸
  llm.ts           # DeepSeek/OpenAI 客户端 + 兜底模板
  moderation.ts    # 关键词黑名单 + 长度过滤
seed/
  medicines.json   # 种子数据 JSON 备份
```

## 提交物

| 项 | 内容 |
|---|---|
| 网站 URL | `https://<deploy>.vercel.app` |
| 作品名 | 后悔药交易所 |
| 作品介绍 | 把后悔变成药丸挂上市集，AI 配药、虚拟币交易，2 分钟体验情绪互助经济 |

## 风险与回退

- LLM 不稳定/超时 → 已内置 3 套不同风格的本地兜底模板
- 数据冷启动重置 → 已内置 12 颗精写种子，保证空库也好看
- 审核漏放 → 后台 `POST /api/admin/delist` 一键下架（需要 ADMIN_KEY）

## 合规声明

- 释怀币为体验道具，**不可充值、不可提现、无现实价值**
- 内容审核会拒绝政治、违法、色情、自伤、未成年不适等话题
- 不替代心理咨询；底部展示心理援助热线
- 不收集任何 PII；匿名身份基于浏览器随机标识

## License

MIT
