import type { Medicine } from "./types";

const baseTime = Date.now();
function ago(minutes: number): string {
  return new Date(baseTime - minutes * 60_000).toISOString();
}

export const SEED_MEDICINES: Medicine[] = [
  {
    id: "med_seed_01",
    sellerId: "seed_anon_01",
    title: "高考志愿没听自己的丸",
    content: "当年填志愿被劝去了“稳妥”的专业，不喜欢，也没考研换。十年了一想到还是会闷一下。",
    comfortText:
      "你以为是错过的那条路在闪光，其实你走过的这条路也长出了别人没有的肌肉。让那个十八岁的自己别难过——TA 已经尽力替你挑了。",
    emojiSkin: "💊📝",
    pillColor: "#88aed6",
    price: 38,
    tags: ["求学", "选择", "遗憾"],
    status: "listed",
    buyerId: null,
    createdAt: ago(180),
    soldAt: null
  },
  {
    id: "med_seed_02",
    sellerId: "seed_anon_02",
    title: "没跟外婆好好告别丸",
    content: "外婆走的那年我在外地实习，请假被拒，没回去。后来再也没机会跟她说一句“我爱你”。",
    comfortText:
      "外婆听得见。她大概率不会怪你没赶到现场，她只会心疼你为了生活咬牙撑着的样子。把那句没说出口的话，悄悄说给现在身边的人吧。",
    emojiSkin: "💊🌾",
    pillColor: "#c9a8e0",
    price: 88,
    tags: ["亲情", "告别"],
    status: "listed",
    buyerId: null,
    createdAt: ago(220),
    soldAt: null
  },
  {
    id: "med_seed_03",
    sellerId: "seed_anon_03",
    title: "明明有机会却没表白丸",
    content: "TA 在我面前晃了三年，最后一晚在便利店买热可可时我都拿出口香糖了，最终还是说了“再见”。",
    comfortText:
      "勇敢这件事是有保质期的，过期了不必硬吞。但下一颗别犹豫——你已经知道了犹豫的味道有多苦。",
    emojiSkin: "💊💌",
    pillColor: "#f1839f",
    price: 25,
    tags: ["爱情", "错过"],
    status: "listed",
    buyerId: null,
    createdAt: ago(50),
    soldAt: null
  },
  {
    id: "med_seed_04",
    sellerId: "seed_anon_04",
    title: "实习时辞职太冲动丸",
    content: "因为一句被冤枉的批评当场摔门，后来发现是 leader 替我背了锅。再也没好意思回去解释。",
    comfortText:
      "年轻时的“不忍”是给自己留尊严的方式，没什么需要回去补救的。那个 leader 替你扛过，那就把这份善意往下传——别人犯倔时你别戳破。",
    emojiSkin: "💊🚪",
    pillColor: "#e8567c",
    price: 18,
    tags: ["职场", "冲动"],
    status: "listed",
    buyerId: null,
    createdAt: ago(15),
    soldAt: null
  },
  {
    id: "med_seed_05",
    sellerId: "seed_anon_05",
    title: "对前任说了狠话丸",
    content: "分手那晚我说了“你这种人没人会要”，过了一个月才反应过来不是 TA 不好，是我们不合适。删了又加，加了又删，话从来没说出口。",
    comfortText:
      "狠话只是当时痛的回声，不是真心。如果真要道歉，就用“祝你好”三个字代替——比解释更得体，也让你自己可以放下。",
    emojiSkin: "💊🥀",
    pillColor: "#d63b65",
    price: 66,
    tags: ["爱情", "遗憾", "冲动"],
    status: "listed",
    buyerId: null,
    createdAt: ago(95),
    soldAt: null
  },
  {
    id: "med_seed_06",
    sellerId: "seed_anon_06",
    title: "没去那场演唱会丸",
    content: "他最后一次巡演我嫌票贵没去，第二年他宣布退圈了。",
    comfortText:
      "你没看到的现场，TA 也没看到你那年熬夜攒钱的样子。喜欢一个人不需要在场证明，你心里那盏灯亮过，就算到过。",
    emojiSkin: "💊🎤",
    pillColor: "#5b8cc4",
    price: 12,
    tags: ["遗憾", "青春"],
    status: "listed",
    buyerId: null,
    createdAt: ago(8),
    soldAt: null
  },
  {
    id: "med_seed_07",
    sellerId: "seed_anon_07",
    title: "拿了体检报告没复查丸",
    content: "三年前体检异常，医生建议复查我嫌麻烦没去。今年又查出来，已经升级了。",
    comfortText:
      "把过去骂自己的那股狠劲，原封不动用来照顾现在的自己。从今天起的每一次复查、每一顿好好吃的饭，都是在替三年前那个忽视自己的人补课。",
    emojiSkin: "💊🩺",
    pillColor: "#9bd1c5",
    price: 120,
    tags: ["健康", "自责"],
    status: "listed",
    buyerId: null,
    createdAt: ago(330),
    soldAt: null
  },
  {
    id: "med_seed_08",
    sellerId: "seed_anon_08",
    title: "把猫送走那天丸",
    content: "搬家那年合租不让养，把它送给了“靠谱”的同事。半年后听说丢了。",
    comfortText:
      "那不是抛弃，是当时的你能给 TA 的最体面的安排。如果还想弥补，就在能力范围内，再爱一只——不是为了赎罪，是为了让那份爱继续流动。",
    emojiSkin: "💊🐈",
    pillColor: "#f3c87b",
    price: 55,
    tags: ["亲情", "遗憾"],
    status: "listed",
    buyerId: null,
    createdAt: ago(440),
    soldAt: null
  },
  {
    id: "med_seed_09",
    sellerId: "seed_anon_09",
    title: "群里替朋友说话丸",
    content: "看到她被同事 PUA，我没在群里替她说一句话。后来她离职，没再联系我。",
    comfortText:
      "沉默的代价你已经付了，不必再用愧疚追加利息。下次遇到类似的场景，哪怕只发一个“+1”，都是你在替过去那次缺席兑现承诺。",
    emojiSkin: "💊🫥",
    pillColor: "#b6c592",
    price: 22,
    tags: ["友情", "勇气"],
    status: "listed",
    buyerId: null,
    createdAt: ago(120),
    soldAt: null
  },
  {
    id: "med_seed_10",
    sellerId: "seed_anon_10",
    title: "三十岁还没存款丸",
    content: "看到同龄人买房买车，我连应急的两万块都没攒下。每次刷到这种新闻就睡不好。",
    comfortText:
      "存款是工具不是奖牌，没集齐也不会被淘汰出局。把“存款焦虑”换成“现金流体检”——这个月能不能不花呗、能不能多存 500，比刷别人的成绩单实在得多。",
    emojiSkin: "💊💸",
    pillColor: "#e08e6f",
    price: 30,
    tags: ["焦虑", "金钱"],
    status: "listed",
    buyerId: null,
    createdAt: ago(28),
    soldAt: null
  },
  {
    id: "med_seed_11",
    sellerId: "seed_anon_11",
    title: "把朋友秘密讲出去丸",
    content: "酒桌上当谈资讲了好友的隐私，TA 知道后我们再没说过话。",
    comfortText:
      "守口这件事是慢慢学会的，你已经付了一份昂贵的学费。别再追着 TA 道歉了，让 TA 用自己的节奏决定要不要回来。你能做的，是从今天开始把别人说给你的话，全部上锁。",
    emojiSkin: "💊🤐",
    pillColor: "#f7adc0",
    price: 48,
    tags: ["友情", "自责"],
    status: "listed",
    buyerId: null,
    createdAt: ago(75),
    soldAt: null
  },
  {
    id: "med_seed_12",
    sellerId: "seed_anon_12",
    title: "没赶上爷爷最后一面丸",
    content: "高三那年怕影响成绩，家里没告诉我。等知道时已经下葬了。我连黑纱都没戴过。",
    comfortText:
      "家人替你挡下了那场风雪，因为他们相信你能跑得更远。爷爷不需要你戴黑纱，他需要你以后每年清明站在他面前的样子，是健康、被爱、且依旧温柔的。",
    emojiSkin: "💊🕯️",
    pillColor: "#88aed6",
    price: 99,
    tags: ["亲情", "告别"],
    status: "listed",
    buyerId: null,
    createdAt: ago(360),
    soldAt: null
  }
];
