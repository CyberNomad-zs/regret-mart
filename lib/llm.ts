import type { GenerateCandidate } from "./types";
import { clamp, pickPillColor } from "./utils";

const SYSTEM_PROMPT = `你是「后悔药交易所」的 AI 药剂师。用户会提交一段自己的「后悔事」，你需要把它做成一颗精致、温柔、有创意的「后悔药」。

请输出 JSON（务必只输出 JSON，不要带 markdown 代码块标记），形如：
{
  "candidates": [
    {
      "title": "10 字以内的药丸名，格式以「丸」结尾",
      "emojiSkin": "2 个 emoji，组成药丸的卡面图",
      "tags": ["1-3 个标签，从【职场,爱情,亲情,友情,求学,健康,金钱,焦虑,告别,选择,冲动,遗憾,勇气,青春,自责】里选"],
      "comfortText": "60-110 字的开解话。要温柔但不矫情，给一个具体可执行的「今天起可以做什么」建议。第二人称。不要喊口号、不要鸡汤、不要「加油」。",
      "suggestedPrice": 5-200 之间的整数，越扎心的痛感价格越高
    },
    { ...第二个候选，风格不同... },
    { ...第三个候选，风格不同... }
  ]
}

约束：
1. 三个候选要有不同的开解角度（如：理性框架 / 温柔抱抱 / 反向幽默）
2. 不输出政治、违法、未成年不适、自伤建议等内容
3. 不替用户做「找心理医生」以外的医疗建议
4. 输出语言：简体中文`;

export interface LlmConfig {
  provider: "deepseek" | "openai" | "none";
  apiKey: string;
  baseUrl: string;
  model: string;
}

export function getLlmConfig(): LlmConfig {
  if (process.env.DEEPSEEK_API_KEY) {
    return {
      provider: "deepseek",
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseUrl: process.env.DEEPSEEK_BASE_URL || "https://api.deepseek.com",
      model: process.env.DEEPSEEK_MODEL || "deepseek-chat"
    };
  }
  if (process.env.OPENAI_API_KEY) {
    return {
      provider: "openai",
      apiKey: process.env.OPENAI_API_KEY,
      baseUrl: process.env.OPENAI_BASE_URL || "https://api.openai.com/v1",
      model: process.env.OPENAI_MODEL || "gpt-4o-mini"
    };
  }
  return { provider: "none", apiKey: "", baseUrl: "", model: "" };
}

interface ChatResponse {
  choices: Array<{ message: { content: string } }>;
}

async function callLlm(content: string): Promise<string> {
  const cfg = getLlmConfig();
  if (cfg.provider === "none") throw new Error("no llm configured");

  const url = cfg.baseUrl.replace(/\/$/, "") + "/chat/completions";
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${cfg.apiKey}`
    },
    body: JSON.stringify({
      model: cfg.model,
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user", content: `这是用户的后悔事：\n${content}\n\n请生成 3 个候选。` }
      ],
      temperature: 0.85,
      response_format: { type: "json_object" }
    })
  });
  if (!res.ok) throw new Error(`llm http ${res.status}`);
  const data = (await res.json()) as ChatResponse;
  const text = data.choices?.[0]?.message?.content ?? "";
  if (!text) throw new Error("llm empty response");
  return text;
}

function safeParseCandidates(jsonStr: string): GenerateCandidate[] | null {
  try {
    const cleaned = jsonStr
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();
    const parsed = JSON.parse(cleaned) as { candidates?: unknown };
    if (!parsed.candidates || !Array.isArray(parsed.candidates)) return null;
    const list = parsed.candidates as Array<Partial<GenerateCandidate>>;
    return list
      .filter((c) => c && typeof c.title === "string" && typeof c.comfortText === "string")
      .slice(0, 3)
      .map((c) => normalizeCandidate(c, c.title || ""));
  } catch {
    return null;
  }
}

function normalizeCandidate(raw: Partial<GenerateCandidate>, seed: string): GenerateCandidate {
  const title = (raw.title || "未命名丸").slice(0, 16);
  const comfortText = (raw.comfortText || "").slice(0, 220);
  const emojiSkin = (raw.emojiSkin || "💊✨").slice(0, 8);
  const tags = (Array.isArray(raw.tags) ? raw.tags : []).map((t) => String(t).slice(0, 6)).slice(0, 3);
  const suggestedPrice = clamp(Math.round(Number(raw.suggestedPrice) || 30), 5, 200);
  const pillColor = (raw as { pillColor?: string }).pillColor || pickPillColor(title + seed);
  return { title, comfortText, emojiSkin, tags, suggestedPrice, pillColor };
}

const FALLBACK_TEMPLATES: Array<(c: string) => Omit<GenerateCandidate, "pillColor">> = [
  (c) => ({
    title: extractTitle(c, "理性框架"),
    emojiSkin: "💊📐",
    tags: ["遗憾", "选择"],
    comfortText:
      "把这件事拆开看：当时的信息、情绪、可选项，构成了那个唯一可能的决定。今天的你之所以会「如果当时……」，是因为你已经长出了那时候没有的视角。这本身就是补偿。",
    suggestedPrice: 38
  }),
  (c) => ({
    title: extractTitle(c, "温柔抱抱"),
    emojiSkin: "💊🫂",
    tags: ["自责", "遗憾"],
    comfortText:
      "先抱抱那个还没原谅自己的你。能把这段写出来挂出来，已经比 90% 的人勇敢了。今天可以做一件小事——给当时的自己写一句「我知道你尽力了」，存在备忘录里，难受时打开看一眼。",
    suggestedPrice: 22
  }),
  (c) => ({
    title: extractTitle(c, "反向幽默"),
    emojiSkin: "💊🙃",
    tags: ["遗憾", "勇气"],
    comfortText:
      "恭喜，你解锁了「过去的我」这位永远在线的反派。但好消息是，这位反派的剧本由现在的你来写——把这次遗憾改成一个梗讲给朋友听吧，能笑出来的事就压不垮你。",
    suggestedPrice: 15
  })
];

function extractTitle(content: string, suffix: string): string {
  const t = content.replace(/[，。,.\s\n]+/g, "").slice(0, 6);
  return `${t}丸·${suffix}`.slice(0, 14);
}

export interface GenerateOptions {
  content: string;
  signal?: AbortSignal;
}

export async function generateCandidates(opts: GenerateOptions): Promise<GenerateCandidate[]> {
  const { content } = opts;
  try {
    const cfg = getLlmConfig();
    if (cfg.provider !== "none") {
      const raw = await callLlm(content);
      const parsed = safeParseCandidates(raw);
      if (parsed && parsed.length >= 1) return parsed.slice(0, 3);
    }
  } catch (err) {
    console.warn("[llm] fall back to templates:", err);
  }
  return FALLBACK_TEMPLATES.map((tpl, i) => {
    const c = tpl(content);
    return { ...c, pillColor: pickPillColor(c.title + i) };
  });
}

export function isLlmConfigured(): boolean {
  return getLlmConfig().provider !== "none";
}
