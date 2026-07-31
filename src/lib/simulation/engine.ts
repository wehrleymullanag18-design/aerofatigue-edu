import type { LabState } from "@/lib/state-machine";

export type SimulationConfig = {
  seed: number;
  hotTarget: number;
  coldTarget: number;
  prestressTarget: number;
  targetCycles: number;
};

export type SimulationPoint = {
  timestamp: string;
  elapsedTime: number;
  cycle: number;
  targetCycles: number;
  phase: "高温驻留" | "移向低温" | "低温驻留" | "移向高温";
  hotTemperature: number;
  coldTemperature: number;
  specimenTemperature: number;
  targetPrestress: number;
  currentPrestress: number;
  strain: number;
  machineState: LabState;
  doorState: "closed";
  alarmCode: string;
  alarmLevel: "none" | "warning" | "fault";
  progress: number;
};

export const defaultSimulationConfig: SimulationConfig = {
  seed: 2022,
  hotTarget: 80,
  coldTarget: 10,
  prestressTarget: 500,
  targetCycles: 6
};

function seededNoise(seed: number, index: number) {
  const x = Math.sin(seed * 12.9898 + index * 78.233) * 43758.5453;
  return (x - Math.floor(x)) * 2 - 1;
}

function round(value: number, digits = 2) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

export function generatePoint(
  config: SimulationConfig,
  index: number,
  preset: "normal" | "warning" | "fault" = "normal"
): SimulationPoint {
  const phaseIndex = index % 40;
  const cycle = Math.min(config.targetCycles, Math.floor(index / 40));
  const phase =
    phaseIndex < 14 ? "高温驻留" : phaseIndex < 20 ? "移向低温" : phaseIndex < 34 ? "低温驻留" : "移向高温";
  const wave = (Math.sin((phaseIndex / 40) * Math.PI * 2 - Math.PI / 2) + 1) / 2;
  const noise = seededNoise(config.seed, index);
  const hotTemperature = config.hotTarget - 8 * Math.exp(-index / 18) + noise * 0.12;
  const coldTemperature = config.coldTarget + 4 * Math.exp(-index / 18) + noise * 0.08;
  const specimenTemperature = config.coldTarget + (config.hotTarget - config.coldTarget) * wave + noise * 0.18;
  const currentPrestress = config.prestressTarget * (1 + 0.0025 * Math.sin(index / 5)) + noise * 0.25;
  const strain = currentPrestress * 2.18 + (specimenTemperature - 25) * 1.6;
  const alarmCode = preset === "warning" && index > 52 ? "TEMP-101" : preset === "fault" && index > 38 ? "SENS-201" : "";
  const alarmLevel = alarmCode ? (preset === "fault" ? "fault" : "warning") : "none";
  const machineState: LabState =
    phase === "高温驻留" ? "running-hot" : phase === "低温驻留" ? "running-cold" : phase === "移向低温" ? "moving-to-cold" : "moving-to-hot";

  return {
    timestamp: new Date(Date.UTC(2026, 0, 1, 8, 0, index)).toISOString(),
    elapsedTime: index,
    cycle,
    targetCycles: config.targetCycles,
    phase,
    hotTemperature: round(hotTemperature),
    coldTemperature: round(coldTemperature),
    specimenTemperature: round(specimenTemperature),
    targetPrestress: config.prestressTarget,
    currentPrestress: round(currentPrestress),
    strain: round(strain),
    machineState,
    doorState: "closed",
    alarmCode,
    alarmLevel,
    progress: round(Math.min(100, (index / (config.targetCycles * 40)) * 100), 1)
  };
}

export function generateSeries(
  config: SimulationConfig = defaultSimulationConfig,
  count = 160,
  preset: "normal" | "warning" | "fault" = "normal"
) {
  return Array.from({ length: Math.min(count, 360) }, (_, index) => generatePoint(config, index, preset));
}

export function toCsv(points: SimulationPoint[]) {
  const keys: (keyof SimulationPoint)[] = [
    "timestamp",
    "cycle",
    "phase",
    "hotTemperature",
    "coldTemperature",
    "specimenTemperature",
    "targetPrestress",
    "currentPrestress",
    "strain",
    "machineState",
    "alarmCode"
  ];
  return [keys.join(","), ...points.map((point) => keys.map((key) => point[key]).join(","))].join("\n");
}

export function toJson(points: SimulationPoint[]) {
  return JSON.stringify({ dataType: "教学模拟数据", modelNotice: "该模型仅用于虚拟实验教学，不是材料疲劳寿命计算模型。", points }, null, 2);
}

export function isFiniteSeries(points: SimulationPoint[]) {
  return points.every((point) =>
    [
      point.hotTemperature,
      point.coldTemperature,
      point.specimenTemperature,
      point.currentPrestress,
      point.strain,
      point.progress
    ].every(Number.isFinite)
  );
}
