"use client";

import Image from "next/image";
import { AlertOctagon, ArrowDown, ArrowLeftRight, Snowflake, ThermometerSun } from "lucide-react";
import type { SimulationPoint } from "@/lib/simulation";
import { stateLabels } from "@/lib/state-machine";
import { assetPath } from "@/lib/asset-path";
import { useLabStore } from "@/store/lab-store";

const runningStates = ["running-hot", "running-cold", "moving-to-cold", "moving-to-hot"];

export function MachineVisual({ point, historical = false }: { point?: SimulationPoint; historical?: boolean }) {
  const state = useLabStore((store) => store.state);
  const data = useLabStore((store) => store.data);
  const current = point ?? data.at(-1);
  const displayState = historical && current ? current.machineState : state;
  const running = runningStates.includes(displayState) && !historical;
  const alarm = current?.alarmCode || (!historical && state === "emergency-stop" ? "E-STOP" : "");
  const phase = current?.phase ?? stateLabels[displayState];

  return (
    <section className="instrument-panel overflow-hidden" aria-label="真实设备数字实验区">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/20 px-4 py-3">
        <div>
          <p className="text-[11px] font-bold tracking-[.16em] text-slate-400">加载测试区 / 设备视图 02</p>
          <h2 className="mt-1 text-base font-black text-white">预应力温度循环实验台</h2>
        </div>
        <span className={`inline-flex items-center gap-2 border px-3 py-1.5 text-xs font-black ${
          (!historical && state === "emergency-stop") || alarm
            ? "border-[#bd3434] bg-[#531d20] text-red-100"
            : running
              ? "border-[#4e8f76] bg-[#183b30] text-emerald-100"
              : "border-slate-500 bg-[#202936] text-slate-200"
        }`}>
          <span className={`h-2 w-2 ${(!historical && state === "emergency-stop") || alarm ? "bg-[#e85b5b]" : running ? "bg-[#58a782]" : "bg-slate-400"}`} />
          {historical ? `历史 · ${stateLabels[displayState]}` : stateLabels[state]}
        </span>
      </div>

      <div className="relative min-h-[420px] overflow-hidden bg-[#242b33] xl:min-h-[440px] 2xl:min-h-[540px]">
        <Image
          src={assetPath("/assets/images/original/loading-module.jpg")}
          alt="预应力温度循环疲劳设备真实加载区"
          fill
          priority
          className="object-cover object-center"
          sizes="(min-width: 1280px) 55vw, 100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#10151c]/80 via-transparent to-[#10151c]/18" />

        <div className="absolute left-[3%] top-[5%] border-l-2 border-[#e86f2a] bg-[#141a22]/88 px-3 py-2 text-white">
          <div className="flex items-center gap-2 text-[11px] font-black text-[#f3a372]"><ThermometerSun size={14} /> 高温槽</div>
          <strong className="mono mt-1 block text-xl">{current?.hotTemperature.toFixed(1) ?? "—"}<small className="ml-1 text-xs">℃</small></strong>
        </div>

        <div className="absolute right-[3%] top-[5%] border-r-2 border-[#2b8ca3] bg-[#141a22]/88 px-3 py-2 text-right text-white">
          <div className="flex items-center justify-end gap-2 text-[11px] font-black text-[#8ec8d5]">低温槽 <Snowflake size={14} /></div>
          <strong className="mono mt-1 block text-xl">{current?.coldTemperature.toFixed(1) ?? "—"}<small className="ml-1 text-xs">℃</small></strong>
        </div>

        <div className="absolute left-[35%] top-[13%] bg-[#141a22]/88 px-3 py-2 text-white">
          <span className="block text-[10px] font-bold text-slate-300">当前工作阶段</span>
          <strong className="mt-1 block text-sm">{phase}</strong>
        </div>

        <div className="absolute left-[48%] top-[23%] flex items-center gap-2 text-white">
          <span className="h-px w-14 bg-white/80" />
          <span className="bg-[#141a22]/80 px-2 py-1 text-[10px] font-bold">Z 轴升降</span>
          <ArrowDown size={18} />
        </div>

        <div className={`absolute left-[41%] top-[48%] ${running ? "motion-carriage" : ""}`}>
          <div className="relative h-24 w-14 border-2 border-white/90 bg-[#174a8b]/75 shadow-[0_2px_8px_rgba(0,0,0,.35)]">
            <div className="absolute left-1/2 top-[-38px] h-40 w-1 -translate-x-1/2 bg-white/90" />
            <div className="absolute left-1/2 top-1/2 h-2 w-24 -translate-x-1/2 -translate-y-1/2 bg-[#dce6ef]" />
            <span className="absolute left-full top-1/2 ml-3 w-28 -translate-y-1/2 border-l border-white bg-[#141a22]/85 px-2 py-1 text-[10px] font-bold text-white">
              试样 / 固定板
            </span>
          </div>
        </div>

        <div className="absolute bottom-[18%] left-[27%] right-[24%] flex items-center gap-2 text-white">
          <ArrowLeftRight size={22} />
          <div className="h-px flex-1 bg-white/80" />
          <span className="bg-[#141a22]/82 px-2 py-1 text-[10px] font-bold">X 轴往复运动</span>
        </div>

        <div className="absolute bottom-4 left-4 right-4 grid gap-px bg-white/20 sm:grid-cols-4">
          {[
            ["试样温度", `${current?.specimenTemperature.toFixed(1) ?? "—"} ℃`],
            ["当前预应力", `${current?.currentPrestress.toFixed(1) ?? "—"} N`],
            ["循环次数", `${current?.cycle ?? 0} / ${current?.targetCycles ?? 6}`],
            ["设备报警", alarm || "无报警"]
          ].map(([label, value], index) => (
            <div key={label} className="bg-[#141a22]/92 px-3 py-2.5 text-white">
              <span className="block text-[10px] font-bold text-slate-400">{label}</span>
              <strong className={`mono mt-1 block text-sm ${index === 3 && alarm ? "text-[#ff8b8b]" : ""}`}>{value}</strong>
            </div>
          ))}
        </div>

        {!historical && state === "offline" && (
          <div className="absolute inset-x-0 top-0 border-b border-[#d99b28] bg-[#463616]/92 px-4 py-2 text-center text-xs font-black text-[#ffe3a1]">
            设备未连接 · 结构视图保持可见，连接后启用交互标注
          </div>
        )}

        {!historical && state === "emergency-stop" && (
          <div className="absolute inset-0 z-20 grid place-items-center bg-[#3b1114]/72">
            <div className="border-2 border-[#e45e5e] bg-[#2a0e10]/95 px-8 py-6 text-center text-white">
              <AlertOctagon className="mx-auto text-[#ff7777]" size={48} />
              <strong className="mt-3 block text-3xl font-black">紧急停止</strong>
              <p className="mt-2 text-sm text-red-100">运动、动画与数据采集已停止</p>
            </div>
          </div>
        )}
      </div>
      <div className="border-t border-white/15 bg-[#10151c] px-4 py-2.5 text-xs font-semibold text-slate-300">
        动画用于解释设备工作过程，不是实拍视频。结构标注为教学覆盖层。
      </div>
    </section>
  );
}
