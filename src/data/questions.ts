export type Question = {
  id: string;
  type: "single" | "judge" | "match" | "sequence";
  title: string;
  options: string[];
  answer: number;
  explanation: string;
};

export const questions: Question[] = [
  {
    id: "q-platform",
    type: "single",
    title: "哪个部件负责带动试样在高温槽和低温槽之间移动？",
    options: ["双自由度作动平台", "报警指示灯", "温度控制器", "上位机显示器"],
    answer: 0,
    explanation: "双自由度作动平台通过相互垂直的直线导轨带动固定板前后、上下运动。"
  },
  {
    id: "q-estop",
    type: "single",
    title: "急停按钮最适合在什么情况下使用？",
    options: ["日常暂停看数据", "发现可能危及人员或设备的紧急风险", "切换页面", "修改图表颜色"],
    answer: 1,
    explanation: "急停用于紧急风险，触发后必须排除风险并复位，不能直接继续。"
  },
  {
    id: "q-door",
    type: "judge",
    title: "防护门未关闭时允许启动循环机构。",
    options: ["正确", "错误"],
    answer: 1,
    explanation: "安全联锁必须阻止防护门未关闭时的运动。"
  },
  {
    id: "q-fixture",
    type: "match",
    title: "哪个部件用于夹持不同形态的试样？",
    options: ["快速更换夹具", "循环制冷组件", "报警灯", "数据处理器"],
    answer: 0,
    explanation: "快速更换夹具用于适配板状、丝状、棒状等不同试样。"
  },
  {
    id: "q-home",
    type: "sequence",
    title: "为什么安装试样前需要设备归零？",
    options: ["建立已知安全初始位置", "提高屏幕亮度", "生成正式结论", "连接远程数据库"],
    answer: 0,
    explanation: "归零建立已知的安全初始位置，是后续安装与运动的前置条件。"
  }
];
