export const learningObjectives = [
  "识别设备主要组成部分",
  "解释预应力—温度循环疲劳试验基本原理",
  "理解高温槽、低温槽与循环加载机构作用",
  "按正确顺序完成虚拟实验",
  "识别危险操作并正确使用急停",
  "阅读温度、预应力、应变与循环次数",
  "完成基础数据分析与虚拟实验报告",
  "区分教学模拟数据与真实试验数据"
];

export const workflow = [
  { id: "connect", label: "连接设备", state: "connected", hint: "建立本地教学模拟连接" },
  { id: "home", label: "设备归零", state: "ready", hint: "确认作动平台初始位置" },
  { id: "open-door", label: "打开防护门", state: "door-open", hint: "进入安装准备" },
  { id: "select-specimen", label: "选择试样", state: "specimen-selecting", hint: "选择板状教学试样" },
  { id: "select-fixture", label: "选择夹具", state: "specimen-selecting", hint: "匹配快速更换夹具" },
  { id: "load", label: "安装试样", state: "specimen-loading", hint: "将试样安装到固定板" },
  { id: "clamp", label: "夹紧试样", state: "specimen-clamped", hint: "确认夹紧状态" },
  { id: "close-door", label: "关闭防护门", state: "door-closed", hint: "启用安全联锁" },
  { id: "parameters", label: "设置参数", state: "parameter-setting", hint: "使用教学演示范围" },
  { id: "heat", label: "高温槽预热", state: "heating", hint: "目标 80℃（资料目标值）" },
  { id: "cool", label: "低温槽预冷", state: "cooling", hint: "目标 10℃（资料目标值）" },
  { id: "environment", label: "确认环境", state: "environment-ready", hint: "冷热环境均已准备" },
  { id: "prestress", label: "施加预应力", state: "prestressing", hint: "教学演示量程" },
  { id: "check", label: "状态检查", state: "experiment-ready", hint: "确认门、温度与夹紧状态" },
  { id: "start", label: "启动循环实验", state: "running-hot", hint: "开始教学模拟数据采集" }
] as const;
