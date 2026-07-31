"use client";

import Link from "next/link";
import { DatabaseZap, FileSpreadsheet } from "lucide-react";
import { generateSeries } from "@/lib/simulation";
import { TelemetryWorkspace } from "./telemetry-workspace";

const data = generateSeries(undefined, 150);

export function AnalysisDashboard() {
  const maxTemperature = Math.max(...data.map((point) => point.specimenTemperature));
  const minTemperature = Math.min(...data.map((point) => point.specimenTemperature));
  const prestressDeviation = Math.max(...data.map((point) => Math.abs(point.currentPrestress - point.targetPrestress)));
  const meanStrain = data.reduce((sum, point) => sum + point.strain, 0) / data.length;
  return (
    <div className="space-y-5">
      <div className="grid border border-[#9fa7af] bg-[#fcfcfa] sm:grid-cols-2 xl:grid-cols-4">
        {[
          ["试样最高温度", `${maxTemperature.toFixed(1)} ℃`, "高温阶段峰值"],
          ["试样最低温度", `${minTemperature.toFixed(1)} ℃`, "低温阶段谷值"],
          ["最大预应力偏差", `${prestressDeviation.toFixed(2)} N`, "教学模型连续扰动"],
          ["平均应变", `${meanStrain.toFixed(0)} με`, "仅供数据理解"]
        ].map(([label, value, note], index) => (
          <section className="border-b border-r border-[#d4d8dc] p-5" key={label}>
            <span className="muted text-sm font-bold">{label}</span>
            <strong className={`metric-value mt-3 block text-3xl ${index === 0 ? "text-[#e86f2a]" : index === 1 ? "text-[#2b8ca3]" : index === 3 ? "text-[#258260]" : "text-[#174a8b]"}`}>{value}</strong>
            <small className="muted mt-2 block">{note}</small>
          </section>
        ))}
      </div>
      <TelemetryWorkspace data={data} />
      <div className="grid gap-4 lg:grid-cols-[.8fr_1.2fr]">
        <section className="border border-[#9fa7af] border-t-4 border-t-[#174a8b] bg-[#fcfcfa] p-6">
          <DatabaseZap className="text-[#174a8b]" />
          <h2 className="mt-4 text-2xl font-black">怎么读这些曲线？</h2>
          <ol className="muted mt-4 space-y-3 pl-5 leading-7">
            <li className="list-decimal">先看试样温度是否随冷热阶段平滑变化。</li>
            <li className="list-decimal">再看当前预应力是否围绕设定值小幅连续变化。</li>
            <li className="list-decimal">最后比较应变与温度、载荷的趋势关系。</li>
          </ol>
          <p className="mt-5 border-l-4 border-[#d99b28] bg-[#fff8e5] p-4 font-semibold text-[#6f531b]">不得用该教学模型推算材料疲劳寿命或工程安全结论。</p>
        </section>
        <section className="border border-[#9fa7af] bg-[#fcfcfa] p-6">
          <FileSpreadsheet className="text-[#2b8ca3]" />
          <h2 className="mt-4 text-2xl font-black">真实数据回放</h2>
          <p className="muted mt-3 leading-7">功能预留，待获得真实设备 CSV 或 Excel 数据后启用。当前不会把上传文件自动认定为真实实验结论。</p>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="panel-soft p-4"><strong>必需字段</strong><p className="muted mt-2 text-sm leading-6">时间、温度、预应力、应变、循环次数</p></div>
            <div className="panel-soft p-4"><strong>导入检查</strong><p className="muted mt-2 text-sm leading-6">列名、单位、缺失值、格式与来源标签</p></div>
          </div>
          <Link href="/data-import" className="lab-button mt-5 inline-flex items-center gap-2">查看导入框架</Link>
        </section>
      </div>
    </div>
  );
}
