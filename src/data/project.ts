import {
  BookOpenCheck,
  ClipboardCheck,
  FlaskConical,
  Presentation
} from "lucide-react";

export const project = {
  name: "AeroFatigue Edu",
  title: "预应力—温度循环疲劳虚拟实验教学平台",
  slogan: "从认识设备，到规范操作；从安全训练，到数据理解。",
  statement: "演示模拟数据，不代表正式实验结论。",
  animationStatement: "动画用于解释设备工作过程，不是实拍视频。",
  localNotice: "本平台第一版不连接真实仪器，不发送真实控制指令。"
};

export const modes = [
  {
    id: "learn",
    title: "学习模式",
    caption: "结构认知 · 原理讲解 · 即时解释",
    href: "/device?mode=learn",
    icon: BookOpenCheck,
    tone: "blue"
  },
  {
    id: "practice",
    title: "练习模式",
    caption: "规范操作 · 提示反馈 · 错误复盘",
    href: "/lab?mode=practice",
    icon: FlaskConical,
    tone: "cyan"
  },
  {
    id: "exam",
    title: "考核模式",
    caption: "安全联锁 · 操作评分 · 结果分析",
    href: "/lab?mode=exam",
    icon: ClipboardCheck,
    tone: "amber"
  },
  {
    id: "presentation",
    title: "答辩演示",
    caption: "十章叙事 · 快速实验 · 全屏展示",
    href: "/presentation",
    icon: Presentation,
    tone: "purple"
  }
] as const;

export const projectStatus = [
  {
    status: "已实现",
    color: "green",
    items: ["本地虚拟实验平台", "设备结构认知", "状态机与安全联锁", "模拟数据、评分与报告"]
  },
  {
    status: "正在升级",
    color: "blue",
    items: ["热点坐标由项目人员精校", "题库持续补充", "真实设备操作视频"]
  },
  {
    status: "未来验证",
    color: "purple",
    items: ["真实数据回放", "设备指标独立复验", "材料寿命与工程结论"]
  }
];

export const verifiedFacts = [
  { label: "实体资料", value: "3 组设备照片", note: "整机、控制界面、加载模块" },
  { label: "环境目标", value: "80℃ / 10℃", note: "申请书目标值，未独立复验" },
  { label: "教学环节", value: "认知—操作—分析", note: "覆盖训练与安全考核" },
  { label: "运行方式", value: "本地离线", note: "无账号、无云端依赖" }
];
