"use client";

import { Activity, ChevronDown, CircleDot, Pause, Play, RadioTower, RotateCcw } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import type { SimulationPoint } from "@/lib/simulation";
import { stateLabels } from "@/lib/state-machine";
import { RealtimeChart } from "./realtime-chart";
import { TelemetryConductor } from "./telemetry-conductor";
import { SimulationNotice } from "./ui";

type Channel = {
  id: string;
  code: string;
  label: string;
  unit: string;
  color: string;
  read: (point: SimulationPoint) => number | string;
};

const channelGroups: { name: string; code: string; channels: Channel[] }[] = [
  {
    name: "温度环境系统",
    code: "ENV",
    channels: [
      { id: "specimen", code: "TMP-01", label: "试样温度", unit: "℃", color: "#e86f2a", read: (point) => point.specimenTemperature.toFixed(1) },
      { id: "hot", code: "TMP-02", label: "高温槽温度", unit: "℃", color: "#e86f2a", read: (point) => point.hotTemperature.toFixed(1) },
      { id: "cold", code: "TMP-03", label: "低温槽温度", unit: "℃", color: "#2b8ca3", read: (point) => point.coldTemperature.toFixed(1) }
    ]
  },
  {
    name: "加载测量系统",
    code: "LOAD",
    channels: [
      { id: "prestress", code: "FOR-01", label: "当前预应力", unit: "N", color: "#174a8b", read: (point) => point.currentPrestress.toFixed(1) },
      { id: "strain", code: "STR-01", label: "当前应变", unit: "με", color: "#258260", read: (point) => point.strain.toFixed(1) }
    ]
  },
  {
    name: "运动与安全系统",
    code: "SAFE",
    channels: [
      { id: "cycle", code: "CYC-01", label: "循环次数", unit: "次", color: "#174a8b", read: (point) => point.cycle },
      { id: "alarm", code: "ALM-01", label: "报警状态", unit: "", color: "#bd3434", read: (point) => point.alarmCode || "无报警" }
    ]
  }
];

export function TelemetryWorkspace({ data }: { data: SimulationPoint[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [selectedId, setSelectedId] = useState("specimen");
  const [playing, setPlaying] = useState(false);
  const resolvedIndex = activeIndex === null ? data.length - 1 : Math.min(activeIndex, data.length - 1);
  const current = data[Math.max(0, resolvedIndex)];
  const visibleData = useMemo(() => data.slice(0, Math.max(1, resolvedIndex + 1)), [resolvedIndex, data]);
  const selected = channelGroups.flatMap((group) => group.channels).find((channel) => channel.id === selectedId) ?? channelGroups[0].channels[0];

  useEffect(() => {
    if (!playing) return;
    const timer = window.setInterval(() => {
      setActiveIndex((value) => {
        const next = (value ?? 0) + 1;
        if (next >= data.length - 1) {
          setPlaying(false);
          return null;
        }
        return next;
      });
    }, 160);
    return () => window.clearInterval(timer);
  }, [playing, data.length]);

  function startReplay() {
    setActiveIndex((value) => value === null || value >= data.length - 1 ? 0 : value);
    setPlaying(true);
  }

  return (
    <section className="overflow-hidden border border-[#7f8993] bg-[#fcfcfa]">
      <header className="flex flex-wrap items-center gap-4 border-b border-[#303a45] bg-[#141a22] px-4 py-3 text-white">
        <span className="mono border border-white/35 px-2 py-1 text-[10px] font-black">WS-TELEMETRY-01</span>
        <div className="mr-auto">
          <h2 className="text-base font-black">实验遥测工作区</h2>
          <p className="mt-0.5 text-[11px] text-slate-400">测点对象 · 同步曲线 · 时间回放</p>
        </div>
        <div className="border-l border-white/20 pl-4">
          <span className="block text-[10px] text-slate-400">数据状态</span>
          <strong className="mt-1 flex items-center gap-2 text-xs"><RadioTower className="text-[#65b38d]" size={14} /> 教学模拟在线</strong>
        </div>
        <div className="border-l border-white/20 pl-4">
          <span className="block text-[10px] text-slate-400">当前阶段</span>
          <strong className="mt-1 block text-xs">{stateLabels[current.machineState]}</strong>
        </div>
      </header>

      <div className="grid xl:grid-cols-[225px_minmax(0,1fr)_280px]">
        <aside className="border-b border-[#aeb5bd] bg-[#eef0f1] xl:border-b-0 xl:border-r">
          <div className="border-b border-[#aeb5bd] px-3 py-3">
            <span className="text-[10px] font-black tracking-[.1em] text-[#68727d]">实验对象树</span>
            <strong className="mt-1 block text-sm">AF-EDU-01 / 加载试验</strong>
          </div>
          {channelGroups.map((group) => (
            <div key={group.code} className="border-b border-[#c8cdd3]">
              <div className="flex items-center gap-2 px-3 py-2 text-xs font-black">
                <ChevronDown size={13} />
                <span className="mono text-[10px] text-[#174a8b]">{group.code}</span>
                {group.name}
              </div>
              {group.channels.map((channel) => {
                const active = selected.id === channel.id;
                return (
                  <button
                    key={channel.id}
                    type="button"
                    onClick={() => setSelectedId(channel.id)}
                    className={`grid w-full grid-cols-[10px_1fr_auto] items-center gap-2 border-t border-[#d7dade] px-3 py-2 text-left text-xs ${
                      active ? "bg-white text-[#174a8b] shadow-[inset_3px_0_0_#174a8b]" : "hover:bg-white/65"
                    }`}
                  >
                    <CircleDot size={10} style={{ color: channel.color }} />
                    <span><strong className="block">{channel.label}</strong><small className="mono text-[9px] text-[#7b848d]">{channel.code}</small></span>
                    <span className="mono font-black">{channel.read(current)} {channel.unit}</span>
                  </button>
                );
              })}
            </div>
          ))}
        </aside>

        <main className="min-w-0 border-b border-[#aeb5bd] p-4 xl:border-b-0 xl:border-r">
          <div className="flex flex-wrap items-end justify-between gap-3 border-b border-[#d4d8dc] pb-3">
            <div>
              <span className="mono text-[10px] font-black text-[#68727d]">{selected.code} / SELECTED CHANNEL</span>
              <h3 className="mt-1 text-xl font-black">{selected.label}</h3>
            </div>
            <div className="text-right">
              <strong className="metric-value text-3xl" style={{ color: selected.color }}>{selected.read(current)}</strong>
              <span className="mono ml-2 text-sm font-black text-[#68727d]">{selected.unit}</span>
            </div>
          </div>
          <RealtimeChart data={visibleData} compact />
        </main>

        <aside className="bg-[#fcfcfa]">
          <div className="border-b border-[#141a22] bg-[#eef0f1] px-4 py-3">
            <span className="text-[10px] font-black tracking-[.1em] text-[#68727d]">当前遥测帧</span>
            <strong className="mono mt-1 block text-sm">T+{String(current.elapsedTime).padStart(3, "0")}s</strong>
          </div>
          <dl>
            {[
              ["阶段", current.phase],
              ["试样温度", `${current.specimenTemperature.toFixed(1)} ℃`],
              ["预应力", `${current.currentPrestress.toFixed(1)} N`],
              ["应变", `${current.strain.toFixed(1)} με`],
              ["循环", `${current.cycle} / ${current.targetCycles}`],
              ["设备状态", stateLabels[current.machineState]]
            ].map(([label, value]) => (
              <div key={label} className="grid grid-cols-[92px_1fr] border-b border-[#d7dade] px-4 py-3 text-xs">
                <dt className="font-bold text-[#68727d]">{label}</dt>
                <dd className="mono text-right font-black">{value}</dd>
              </div>
            ))}
          </dl>
          <div className={`m-4 border-l-4 p-3 text-sm font-black ${
            current.alarmCode ? "border-[#bd3434] bg-[#fae8e8] text-[#8d2222]" : "border-[#258260] bg-[#edf5f1] text-[#216d51]"
          }`}>
            {current.alarmCode ? `报警 ${current.alarmCode}` : "状态正常 · 无报警"}
          </div>
        </aside>
      </div>

      <div className="border-t border-[#aeb5bd] p-3">
        <div className="mb-2 flex flex-wrap items-center gap-2">
          <button type="button" onClick={playing ? () => setPlaying(false) : startReplay} className="control-button flex min-h-9 items-center gap-2 !px-3 !py-1 text-xs">
            {playing ? <Pause size={14} /> : <Play size={14} />} {playing ? "暂停回放" : "从头回放"}
          </button>
          <button type="button" onClick={() => { setPlaying(false); setActiveIndex(0); }} className="control-button flex min-h-9 items-center gap-2 !px-3 !py-1 text-xs">
            <RotateCcw size={14} /> 回到起点
          </button>
          <span className="muted ml-auto flex items-center gap-2 text-xs"><Activity size={14} /> 所有视图由同一时间索引驱动</span>
        </div>
        <TelemetryConductor
          points={data}
          activeIndex={activeIndex}
          onChange={(index) => { setPlaying(false); setActiveIndex(index); }}
          onLive={() => { setPlaying(false); setActiveIndex(null); }}
        />
      </div>
      <div className="p-3 pt-0"><SimulationNotice /></div>
    </section>
  );
}
