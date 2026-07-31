import { assetPath } from "@/lib/asset-path";

export type DevicePart = {
  id: string;
  name: string;
  system: string;
  image: string;
  x?: number;
  y?: number;
  confirmed: boolean;
  function: string;
  input: string;
  output: string;
  role: string;
  safety: string;
  relation: string;
  status: "资料确认" | "位置待确认";
};

const overview = assetPath("/assets/images/original/device-overview.jpg");
const control = assetPath("/assets/images/original/control-interface.jpg");
const loading = assetPath("/assets/images/original/loading-module.jpg");

export const deviceParts: DevicePart[] = [
  { id: "pc", name: "上位机", system: "人机交互", image: overview, x: 35, y: 21, confirmed: true, function: "设置实验参数并汇总显示数据。", input: "温度、循环次数、预紧力等设定", output: "控制需求与可视化信息", role: "启动连接、设置参数并查看过程。", safety: "不得把本教学界面当作真实控制终端。", relation: "与中控、温控和数据采集相连。", status: "资料确认" },
  { id: "panel", name: "操作面板", system: "人机交互", image: control, x: 67, y: 52, confirmed: true, function: "集中显示运行状态与操作入口。", input: "操作者命令", output: "设备状态与提示", role: "承载启停、照明与监测等操作。", safety: "操作前先确认状态与联锁。", relation: "包含显示、温控、急停和报警部件。", status: "资料确认" },
  { id: "alarm", name: "报警指示灯", system: "安全系统", image: overview, x: 48, y: 12, confirmed: true, function: "显示警告或报警状态。", input: "控制系统报警信号", output: "可见状态提示", role: "提醒操作者停止或检查。", safety: "报警未解除前不得强行继续。", relation: "与传感器、联锁和急停逻辑相关。", status: "资料确认" },
  { id: "estop", name: "急停按钮", system: "安全系统", image: control, x: 92, y: 22, confirmed: true, function: "在紧急情况下立即停止运动与加载。", input: "人工按下", output: "急停状态", role: "切断当前实验动作。", safety: "急停后必须排除风险并复位，不能直接继续。", relation: "优先级高于一般控制命令。", status: "资料确认" },
  { id: "hot-controller", name: "高温控制器", system: "温度控制", image: control, x: 92, y: 73, confirmed: true, function: "设定并显示高温槽温度。", input: "高温目标值", output: "加热控制与温度显示", role: "准备高温环境。", safety: "注意高温风险，真实操作须执行实验室规程。", relation: "与高温槽和温度传感器关联。", status: "资料确认" },
  { id: "cold-controller", name: "低温控制器", system: "温度控制", image: control, x: 92, y: 49, confirmed: true, function: "设定并显示低温槽温度。", input: "低温目标值", output: "制冷控制与温度显示", role: "准备低温环境。", safety: "低温系统异常时停止循环。", relation: "与低温槽和循环制冷组件关联。", status: "资料确认" },
  { id: "loading-zone", name: "实验加载区", system: "加载系统", image: overview, x: 71, y: 39, confirmed: true, function: "完成试样夹持、预紧与温度循环移动。", input: "试样、夹具与运动命令", output: "循环加载过程", role: "虚拟实验的主要运动区域。", safety: "防护门打开时禁止启动运动。", relation: "包含固定板、夹具与作动平台。", status: "资料确认" },
  { id: "hot-bath", name: "高温槽", system: "温度环境", image: loading, x: 46, y: 59, confirmed: false, function: "为试样提供高温阶段环境。", input: "加热控制", output: "高温环境", role: "构成冷热循环的一端。", safety: "具体位置需由项目人员在实物上确认。", relation: "与高温控制器和温度传感器相连。", status: "位置待确认" },
  { id: "cold-bath", name: "低温槽", system: "温度环境", image: loading, x: 57, y: 59, confirmed: false, function: "为试样提供低温阶段环境。", input: "制冷控制", output: "低温环境", role: "构成冷热循环的另一端。", safety: "液位或制冷异常时不得运行。", relation: "与低温控制器和制冷组件相连。", status: "位置待确认" },
  { id: "plate", name: "固定板", system: "加载系统", image: loading, x: 45, y: 38, confirmed: true, function: "承载夹具与试样并随作动平台移动。", input: "平台位移", output: "试样位置变化", role: "将运动传递给试样。", safety: "安装前需归零并打开防护区域。", relation: "连接作动平台与夹具。", status: "资料确认" },
  { id: "fixture", name: "快速更换夹具", system: "夹持系统", image: loading, x: 61, y: 82, confirmed: true, function: "适配板状、丝状、棒状等不同试样。", input: "试样与夹紧力", output: "稳定夹持", role: "提高更换效率并保证载荷传递。", safety: "试样与夹具必须匹配。", relation: "安装在固定板正面。", status: "资料确认" },
  { id: "prestress", name: "预紧机构", system: "加载系统", image: loading, confirmed: false, function: "向试样施加教学设定的预应力。", input: "预应力设定", output: "预紧载荷", role: "建立温度循环前的机械载荷。", safety: "未夹紧试样不得施加预应力。", relation: "申请书描述固定板背面电推杆完成预紧。", status: "位置待确认" },
  { id: "platform", name: "双自由度作动平台", system: "运动系统", image: loading, x: 88, y: 65, confirmed: true, function: "带动固定板前后、上下运动。", input: "运动控制信号", output: "两方向位移", role: "使试样在高低温槽间循环。", safety: "防护门未关闭时禁止运动。", relation: "由相互垂直的直线导轨构成。", status: "资料确认" },
  { id: "pressure", name: "压力传感器", system: "传感采集", image: loading, confirmed: false, function: "反馈预拉力值。", input: "机械载荷", output: "压力/预拉力信号", role: "监测预应力状态。", safety: "断连时实验必须停止。", relation: "与预紧机构和上位机相关。", status: "位置待确认" },
  { id: "temperature", name: "温度传感器", system: "传感采集", image: control, confirmed: false, function: "采集环境槽和试样温度。", input: "温度变化", output: "温度信号", role: "支撑温控与数据记录。", safety: "断连时不得继续运行。", relation: "服务高低温控制与数据区。", status: "位置待确认" },
  { id: "strain", name: "应变采集接口", system: "传感采集", image: control, confirmed: false, function: "接入电阻应变仪采集应变。", input: "应变仪信号", output: "应变数据", role: "支持教学数据分析。", safety: "真实接线方法需以仪器说明书为准。", relation: "与数据处理终端相关。", status: "位置待确认" },
  { id: "cooling", name: "循环制冷组件", system: "温度环境", image: overview, x: 80, y: 79, confirmed: true, function: "为低温槽提供循环冷却能力。", input: "制冷控制", output: "冷却介质循环", role: "准备并维持低温环境。", safety: "制冷异常时触发保护。", relation: "与低温槽和低温控制器相连。", status: "资料确认" },
  { id: "guard", name: "安全防护区域", system: "安全系统", image: overview, x: 40, y: 41, confirmed: true, function: "隔离加载区与操作者。", input: "门状态", output: "安全联锁信号", role: "控制是否允许运动。", safety: "防护门未关闭严禁启动循环。", relation: "与运动控制和安全联锁关联。", status: "资料确认" }
];
