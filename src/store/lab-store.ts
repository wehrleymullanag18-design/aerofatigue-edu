"use client";

import { create } from "zustand";
import {
  defaultSimulationConfig,
  generatePoint,
  type SimulationPoint
} from "@/lib/simulation";
import {
  initialContext,
  transition,
  type LabAction,
  type LabState,
  type MachineContext
} from "@/lib/state-machine";

export type LogEntry = {
  id: number;
  time: string;
  action: string;
  message: string;
  level: "info" | "success" | "warning" | "danger";
};

const initialLog: LogEntry = {
  id: 0,
  time: "--:--:--",
  action: "系统",
  message: "本地教学模拟控制台已就绪。",
  level: "info"
};

type LabStore = {
  state: LabState;
  context: MachineContext;
  data: SimulationPoint[];
  logs: LogEntry[];
  safetyErrors: number;
  preset: "normal" | "warning" | "fault";
  mode: "learn" | "practice" | "exam";
  lastMessage: string;
  runAction: (action: LabAction, label: string) => boolean;
  unsafeStart: () => void;
  tick: () => void;
  setPreset: (preset: LabStore["preset"]) => void;
  setMode: (mode: LabStore["mode"]) => void;
  restart: () => void;
};

function newLog(label: string, message: string, level: LogEntry["level"]): LogEntry {
  return {
    id: Date.now() + Math.round(Math.random() * 1000),
    time: new Date().toLocaleTimeString("zh-CN", { hour12: false }),
    action: label,
    message,
    level
  };
}

export const useLabStore = create<LabStore>((set, get) => ({
  state: "offline",
  context: initialContext,
  data: [],
  logs: [initialLog],
  safetyErrors: 0,
  preset: "normal",
  mode: "practice",
  lastMessage: "请从“连接设备”开始。",
  runAction: (action, label) => {
    const current = get();
    const result = transition(current.state, action, current.context);
    set({
      state: result.state,
      context: result.context,
      lastMessage: result.message,
      logs: [
        newLog(label, result.message, result.ok ? (action === "emergencyStop" ? "danger" : "success") : "warning"),
        ...current.logs
      ].slice(0, 80),
      safetyErrors: result.ok ? current.safetyErrors : current.safetyErrors + (action === "start" ? 1 : 0)
    });
    return result.ok;
  },
  unsafeStart: () => {
    const current = get();
    const result = transition(current.state, "start", { ...current.context, doorClosed: false });
    const message = "安全联锁演示：防护门未关闭，系统已阻止启动。";
    set({
      lastMessage: message,
      safetyErrors: current.safetyErrors + 1,
      logs: [newLog("尝试启动", result.ok ? result.message : message, "danger"), ...current.logs].slice(0, 80)
    });
  },
  tick: () => {
    const current = get();
    if (!["running-hot", "running-cold", "moving-to-cold", "moving-to-hot"].includes(current.state)) return;
    const point = generatePoint(defaultSimulationConfig, current.data.length, current.preset);
    set({
      data: [...current.data, point].slice(-240),
      state: point.machineState,
      lastMessage: point.alarmCode ? `教学预设触发：${point.alarmCode}` : current.lastMessage
    });
  },
  setPreset: (preset) => set({ preset, lastMessage: `已选择${preset === "normal" ? "正常" : preset === "warning" ? "警告" : "故障"}教学预设。` }),
  setMode: (mode) => set({ mode }),
  restart: () =>
    set({
      state: "offline",
      context: initialContext,
      data: [],
      logs: [newLog("重新实验", "已清空本次教学过程，请重新连接。", "info")],
      safetyErrors: 0,
      lastMessage: "请从“连接设备”开始。"
    })
}));
