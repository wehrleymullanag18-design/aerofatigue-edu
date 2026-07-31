export type LabState =
  | "offline"
  | "idle"
  | "connecting"
  | "connected"
  | "homing"
  | "ready"
  | "door-open"
  | "specimen-selecting"
  | "specimen-loading"
  | "specimen-clamped"
  | "door-closed"
  | "parameter-setting"
  | "heating"
  | "cooling"
  | "environment-ready"
  | "prestressing"
  | "experiment-ready"
  | "running-hot"
  | "moving-to-cold"
  | "running-cold"
  | "moving-to-hot"
  | "paused"
  | "warning"
  | "fault"
  | "emergency-stop"
  | "completed"
  | "resetting";

export type LabAction =
  | "connect"
  | "home"
  | "openDoor"
  | "selectSpecimen"
  | "selectFixture"
  | "install"
  | "clamp"
  | "closeDoor"
  | "setParameters"
  | "heat"
  | "cool"
  | "confirmEnvironment"
  | "prestress"
  | "check"
  | "start"
  | "pause"
  | "resume"
  | "emergencyStop"
  | "complete"
  | "reset";

export type MachineContext = {
  connected: boolean;
  homed: boolean;
  doorClosed: boolean;
  specimenSelected: boolean;
  fixtureSelected: boolean;
  specimenInstalled: boolean;
  specimenClamped: boolean;
  parametersSet: boolean;
  hotReady: boolean;
  coldReady: boolean;
  prestressApplied: boolean;
};

export type TransitionResult = {
  ok: boolean;
  state: LabState;
  context: MachineContext;
  message: string;
};

export const initialContext: MachineContext = {
  connected: false,
  homed: false,
  doorClosed: true,
  specimenSelected: false,
  fixtureSelected: false,
  specimenInstalled: false,
  specimenClamped: false,
  parametersSet: false,
  hotReady: false,
  coldReady: false,
  prestressApplied: false
};

function reject(state: LabState, context: MachineContext, message: string): TransitionResult {
  return { ok: false, state, context, message };
}

function accept(
  state: LabState,
  context: MachineContext,
  message: string,
  patch: Partial<MachineContext> = {}
): TransitionResult {
  return { ok: true, state, context: { ...context, ...patch }, message };
}

export function transition(
  state: LabState,
  action: LabAction,
  context: MachineContext
): TransitionResult {
  if (action === "emergencyStop" && state !== "offline" && state !== "emergency-stop") {
    return accept("emergency-stop", context, "已执行紧急停止：运动、动画与数据采集均已停止。");
  }
  if (action === "reset" && ["emergency-stop", "fault", "warning", "completed"].includes(state)) {
    return accept("idle", initialContext, "系统已复位，请从连接设备重新开始。");
  }

  switch (action) {
    case "connect":
      return state === "offline"
        ? accept("connected", context, "教学模拟设备已连接。", { connected: true })
        : reject(state, context, "当前状态不需要重复连接。");
    case "home":
      return state === "connected" && context.connected
        ? accept("ready", context, "设备归零完成。", { homed: true })
        : reject(state, context, "未连接设备，不能执行归零。");
    case "openDoor":
      return state === "ready" && context.homed
        ? accept("door-open", context, "防护门已打开，可以选择并安装试样。", { doorClosed: false })
        : reject(state, context, "必须先连接并完成设备归零，才能打开防护门进入安装流程。");
    case "selectSpecimen":
      return state === "door-open"
        ? accept("specimen-selecting", context, "已选择板状教学试样。", { specimenSelected: true })
        : reject(state, context, "请先完成归零并打开防护门。");
    case "selectFixture":
      return state === "specimen-selecting" && context.specimenSelected
        ? accept("specimen-selecting", context, "已选择匹配的快速更换夹具。", { fixtureSelected: true })
        : reject(state, context, "请先选择试样，再选择匹配夹具。");
    case "install":
      return state === "specimen-selecting" &&
        !context.doorClosed &&
        context.specimenSelected &&
        context.fixtureSelected
        ? accept("specimen-loading", context, "试样已安装到固定板。", { specimenInstalled: true })
        : reject(state, context, "安装前必须打开防护门，并完成试样与夹具选择。");
    case "clamp":
      return state === "specimen-loading" && context.specimenInstalled
        ? accept("specimen-clamped", context, "试样已夹紧。", { specimenClamped: true })
        : reject(state, context, "试样尚未正确安装，不能夹紧。");
    case "closeDoor":
      return state === "specimen-clamped"
        ? accept("door-closed", context, "防护门已关闭，安全联锁生效。", { doorClosed: true })
        : reject(state, context, "必须先安装并夹紧试样，才能关闭防护门。");
    case "setParameters":
      return state === "door-closed"
        ? accept("parameter-setting", context, "实验参数已按教学演示范围设置。", { parametersSet: true })
        : reject(state, context, "请先夹紧试样并关闭防护门。");
    case "heat":
      return state === "parameter-setting" && context.parametersSet
        ? accept("heating", context, "高温槽预热完成。", { hotReady: true })
        : reject(state, context, "请先完成参数设置。");
    case "cool":
      return state === "heating" && context.hotReady
        ? accept("cooling", context, "低温槽预冷完成。", { coldReady: true })
        : reject(state, context, "请先完成高温槽预热。");
    case "confirmEnvironment":
      return state === "cooling" && context.hotReady && context.coldReady
        ? accept("environment-ready", context, "冷热环境准备完成。")
        : reject(state, context, "高温槽和低温槽尚未同时准备完成。");
    case "prestress":
      return state === "environment-ready" && context.specimenClamped
        ? accept("prestressing", context, "预应力已施加（教学演示量程）。", { prestressApplied: true })
        : reject(state, context, "试样未夹紧或环境未准备完成，不能施加预应力。");
    case "check":
      return state === "prestressing" &&
        context.doorClosed &&
        context.hotReady &&
        context.coldReady &&
        context.prestressApplied
        ? accept("experiment-ready", context, "状态检查通过，可以启动循环实验。")
        : reject(state, context, "门、温度环境、夹紧或预应力状态不满足启动条件。");
    case "start":
      return state === "experiment-ready" && context.doorClosed
        ? accept("running-hot", context, "循环实验已启动，正在采集教学模拟数据。")
        : reject(state, context, context.doorClosed ? "实验准备未完成，不能启动。" : "防护门未关闭，安全联锁已阻止启动。");
    case "pause":
      return ["running-hot", "running-cold", "moving-to-cold", "moving-to-hot"].includes(state)
        ? accept("paused", context, "实验已暂停，动画与数据采集已冻结。")
        : reject(state, context, "当前没有正在运行的实验可暂停。");
    case "resume":
      return state === "paused"
        ? accept("running-hot", context, "实验继续，动画与数据采集已恢复。")
        : reject(state, context, state === "emergency-stop" ? "急停后不能直接继续，必须先排除风险并复位。" : "只有暂停状态可以继续。");
    case "complete":
      return ["running-hot", "running-cold", "moving-to-cold", "moving-to-hot"].includes(state)
        ? accept("completed", context, "教学演示循环已完成，可以生成实验报告。")
        : reject(state, context, "实验尚未运行，不能直接完成。");
    default:
      return reject(state, context, "当前操作不适用于此状态。");
  }
}

export const stateLabels: Record<LabState, string> = {
  offline: "设备未连接",
  idle: "待机",
  connecting: "正在连接",
  connected: "设备已连接",
  homing: "归零中",
  ready: "归零完成",
  "door-open": "防护门打开",
  "specimen-selecting": "选择试样与夹具",
  "specimen-loading": "安装试样",
  "specimen-clamped": "试样已夹紧",
  "door-closed": "防护门关闭",
  "parameter-setting": "参数设置",
  heating: "高温槽预热",
  cooling: "低温槽预冷",
  "environment-ready": "冷热环境准备完成",
  prestressing: "施加预应力",
  "experiment-ready": "实验准备完成",
  "running-hot": "高温阶段",
  "moving-to-cold": "移动至低温槽",
  "running-cold": "低温阶段",
  "moving-to-hot": "移动至高温槽",
  paused: "已暂停",
  warning: "警告",
  fault: "故障",
  "emergency-stop": "紧急停止",
  completed: "实验完成",
  resetting: "复位中"
};
