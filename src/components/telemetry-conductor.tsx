"use client";

import { Radio, SkipForward } from "lucide-react";
import type { SimulationPoint } from "@/lib/simulation";

export function TelemetryConductor({
  points,
  activeIndex,
  onChange,
  onLive,
  label = "统一时间轴"
}: {
  points: SimulationPoint[];
  activeIndex: number | null;
  onChange: (index: number) => void;
  onLive: () => void;
  label?: string;
}) {
  const lastIndex = Math.max(0, points.length - 1);
  const resolvedIndex = activeIndex === null ? lastIndex : Math.min(activeIndex, lastIndex);
  const current = points[resolvedIndex];
  const isLive = activeIndex === null;

  return (
    <div className="border border-[#9fa7af] bg-[#eef0f1]">
      <div className="grid items-center gap-3 px-3 py-2.5 md:grid-cols-[170px_minmax(0,1fr)_170px]">
        <div>
          <span className="text-[10px] font-black tracking-[.12em] text-[#68727d]">{label}</span>
          <strong className="mono mt-1 flex items-center gap-2 text-xs">
            <Radio className={isLive ? "text-[#258260]" : "text-[#d99b28]"} size={14} />
            {isLive ? "实时跟随" : "历史回放"}
          </strong>
        </div>
        <div className="min-w-0">
          <input
            aria-label="遥测时间轴"
            type="range"
            min={0}
            max={lastIndex}
            value={resolvedIndex}
            disabled={!points.length}
            onChange={(event) => onChange(Number(event.target.value))}
            className="telemetry-range w-full"
          />
          <div className="mono mt-1 flex justify-between text-[10px] text-[#68727d]">
            <span>T+000s</span>
            <span>T+{String(current?.elapsedTime ?? 0).padStart(3, "0")}s · 循环 {current?.cycle ?? 0}</span>
            <span>T+{String(points.at(-1)?.elapsedTime ?? 0).padStart(3, "0")}s</span>
          </div>
        </div>
        <button
          type="button"
          disabled={!points.length || isLive}
          onClick={onLive}
          className="control-button flex min-h-9 items-center justify-center gap-2 !px-3 !py-1 text-xs"
        >
          <SkipForward size={14} /> 跳至最新
        </button>
      </div>
    </div>
  );
}
