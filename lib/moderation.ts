const KEYWORD_BLACKLIST = [
  "习近平",
  "毛泽东",
  "共产党",
  "六四",
  "天安门事件",
  "法轮",
  "藏独",
  "疆独",
  "台独",
  "港独",
  "翻墙",
  "VPN",
  "约炮",
  "嫖娼",
  "卖淫",
  "色情",
  "黄片",
  "毒品",
  "冰毒",
  "海洛因",
  "大麻",
  "枪支",
  "炸弹",
  "杀人",
  "自杀方法",
  "上吊",
  "割腕",
  "跳楼",
  "氰化",
  "传销",
  "庞氏",
  "杀猪盘"
];

const SUICIDE_KEYWORDS = ["想死", "不想活", "自杀", "结束生命", "活不下去", "想轻生", "活着没意思", "想从楼上跳"];

export interface ModerationResult {
  ok: boolean;
  reason?: string;
  needsCrisisHotline?: boolean;
}

export function moderateContent(text: string): ModerationResult {
  const t = (text || "").trim();
  if (t.length === 0) return { ok: false, reason: "内容不能为空" };
  if (t.length > 200) return { ok: false, reason: "内容请控制在 200 字以内" };

  const lowered = t.toLowerCase();
  for (const k of KEYWORD_BLACKLIST) {
    if (lowered.includes(k.toLowerCase())) {
      return { ok: false, reason: "内容包含不允许的话题，请换一种说法" };
    }
  }

  const hasSuicide = SUICIDE_KEYWORDS.some((k) => t.includes(k));
  return { ok: true, needsCrisisHotline: hasSuicide };
}
