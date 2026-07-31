"use client";

import { Download, Printer, RotateCcw } from "lucide-react";
import Link from "next/link";
import { calculateScore } from "@/data/scoring";
import { workflow } from "@/data/teaching";
import { toJson } from "@/lib/simulation";
import { useLabStore } from "@/store/lab-store";

function download(content: string, filename: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function ReportView() {
  const { data, logs, safetyErrors, state } = useLabStore();
  const completedSteps = Math.min(workflow.length, logs.filter((entry) => entry.level === "success").length);
  const score = calculateScore(completedSteps, workflow.length, safetyErrors);
  const latest = data.at(-1);
  const report = {
    reportType: "虚拟实验教学报告",
    experimentId: "AF-EDU-2026-001",
    generatedAt: new Date().toISOString(),
    state,
    parameters: { hotTemperature: 80, coldTemperature: 10, prestress: 500, targetCycles: 6 },
    score,
    safetyErrors,
    logs,
    simulation: JSON.parse(toJson(data))
  };
  const csv = [
    "实验编号,总分,安全分,错误次数,是否通过",
    `AF-EDU-2026-001,${score.total},${score.safety},${safetyErrors},${score.passed ? "是" : "否"}`
  ].join("\n");

  return (
    <div className="space-y-5">
      <div className="no-print flex flex-wrap gap-3">
        <button className="lab-button flex items-center gap-2" onClick={() => window.print()}><Printer size={18} /> 浏览器打印 / 保存 PDF</button>
        <button className="lab-button flex items-center gap-2" onClick={() => download(JSON.stringify(report, null, 2), "virtual-experiment-report.json", "application/json")}><Download size={18} /> 导出 JSON</button>
        <button className="lab-button flex items-center gap-2" onClick={() => download(csv, "student-score.csv", "text/csv;charset=utf-8")}><Download size={18} /> 导出成绩 CSV</button>
        <Link href="/lab" className="lab-button flex items-center gap-2"><RotateCcw size={18} /> 返回实验</Link>
      </div>
      <article className="report-sheet mx-auto max-w-[1050px] overflow-hidden border border-[#8f98a3] bg-[#fcfcfa] shadow-[0_2px_8px_rgba(20,26,34,.06)]">
        <header className="border-b-2 border-[#141a22] bg-[#eef0f1] p-8 md:p-12">
          <p className="task-code">AF-EDU-2026-001 / 教学报告</p>
          <h1 className="mt-3 text-4xl font-black">虚拟实验教学报告</h1>
          <p className="mt-4 border-l-4 border-[#d99b28] bg-[#fff8e5] p-3 font-semibold text-[#674e1c]">本报告由虚拟实验教学系统生成，所含数据为教学模拟数据，不作为真实试验、检测、认证或工程决策依据。</p>
        </header>
        <div className="space-y-8 p-8 md:p-12">
          <section className="grid gap-4 md:grid-cols-3">
            {[["实验编号", "AF-EDU-2026-001"], ["报告状态", state === "completed" ? "实验已完成" : "演示记录"], ["数据点", String(data.length)]].map(([label, value]) => (
              <div className="panel-soft p-4" key={label}><span className="muted text-sm">{label}</span><strong className="mt-2 block text-xl">{value}</strong></div>
            ))}
          </section>
          <section>
            <h2 className="text-2xl font-black">实验设定</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[["高温目标", "80 ℃"], ["低温目标", "10 ℃"], ["预应力", "500 N（教学）"], ["目标循环", "6 次"]].map(([label, value]) => <div className="panel-soft p-4" key={label}><span className="muted text-sm">{label}</span><strong className="mt-1 block">{value}</strong></div>)}
            </div>
          </section>
          <section>
            <h2 className="text-2xl font-black">结果摘要</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {[["当前循环", `${latest?.cycle ?? 0} / 6`], ["试样温度", `${latest?.specimenTemperature ?? "—"} ℃`], ["当前预应力", `${latest?.currentPrestress ?? "—"} N`], ["应变", `${latest?.strain ?? "—"} με`]].map(([label, value]) => <div className="panel-soft p-4" key={label}><span className="muted text-sm">{label}</span><strong className="mt-1 block text-xl">{value}</strong></div>)}
            </div>
          </section>
          <section>
            <h2 className="text-2xl font-black">模块评分</h2>
            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
              {[["操作", score.operation], ["安全", score.safety], ["分析", score.analysis], ["报告", score.report], ["总分", score.total]].map(([label, value]) => <div className="panel-soft p-4 text-center" key={label}><span className="muted text-sm">{label}</span><strong className="mt-1 block text-3xl">{value}</strong></div>)}
            </div>
            <p className={`mt-4 border-l-4 p-4 font-black ${score.passed ? "border-[#258260] bg-[#edf5f1] text-[#216d51]" : "border-[#d99b28] bg-[#fff8e5] text-[#735419]"}`}>
              安全考核：{score.passed ? "通过" : "尚未通过"} · 安全错误 {safetyErrors} 次
            </p>
          </section>
          <section>
            <h2 className="text-2xl font-black">操作记录</h2>
            <div className="mt-4 overflow-x-auto">
              <table className="w-full border-collapse text-left">
                <thead><tr className="border-b-2 border-[#141a22] bg-[#eef0f1] text-[#174a8b]"><th className="p-3">时间</th><th className="p-3">操作</th><th className="p-3">结果</th></tr></thead>
                <tbody>{logs.slice().reverse().map((log) => <tr className="border-b border-[#d4d8dc]" key={log.id}><td className="mono p-3">{log.time}</td><td className="p-3 font-bold">{log.action}</td><td className="muted p-3">{log.message}</td></tr>)}</tbody>
              </table>
            </div>
          </section>
          <section>
            <h2 className="text-2xl font-black">教师评语</h2>
            <div className="mt-4 min-h-28 border border-dashed border-[#8f98a3] p-4 text-[#737d87]">请在打印后填写，或由教师模式记录。</div>
          </section>
          <footer className="border-t border-[#9fa7af] pt-5 text-sm font-semibold text-[#72561d]">本报告由虚拟实验教学系统生成，所含数据为教学模拟数据，不作为真实试验、检测、认证或工程决策依据。</footer>
        </div>
      </article>
    </div>
  );
}
