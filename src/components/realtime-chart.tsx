"use client";

import dynamic from "next/dynamic";
import type { EChartsOption } from "echarts";
import type { SimulationPoint } from "@/lib/simulation";

const ReactECharts = dynamic(() => import("echarts-for-react"), { ssr: false });

export function RealtimeChart({ data, compact = false }: { data: SimulationPoint[]; compact?: boolean }) {
  const option: EChartsOption = {
    animation: false,
    backgroundColor: "transparent",
    color: ["#e86f2a", "#174a8b", "#258260"],
    tooltip: { trigger: "axis", backgroundColor: "#fcfcfa", borderColor: "#aeb5bd", textStyle: { color: "#141a22" } },
    legend: { top: 0, textStyle: { color: "#49545f", fontWeight: 600 }, data: ["试样温度", "当前预应力", "应变（缩放）"] },
    grid: { left: 50, right: 20, top: 42, bottom: 42 },
    xAxis: {
      type: "category",
      boundaryGap: false,
      data: data.map((point) => `${point.elapsedTime}s`),
      axisLine: { lineStyle: { color: "#aeb5bd" } },
      axisLabel: { color: "#68727d", interval: Math.max(0, Math.floor(data.length / 6)) }
    },
    yAxis: {
      type: "value",
      axisLine: { show: false },
      splitLine: { lineStyle: { color: "#d9dde1" } },
      axisLabel: { color: "#68727d" }
    },
    series: [
      { name: "试样温度", type: "line", smooth: true, showSymbol: false, lineStyle: { width: 2 }, data: data.map((point) => point.specimenTemperature) },
      { name: "当前预应力", type: "line", smooth: true, showSymbol: false, lineStyle: { width: 2 }, data: data.map((point) => point.currentPrestress) },
      { name: "应变（缩放）", type: "line", smooth: true, showSymbol: false, lineStyle: { width: 2 }, data: data.map((point) => point.strain / 2.3) }
    ]
  };

  const height = compact ? 280 : 360;
  return (
    <div style={{ height, width: "100%" }}>
      <ReactECharts option={option} style={{ height: "100%", width: "100%" }} notMerge lazyUpdate />
    </div>
  );
}
