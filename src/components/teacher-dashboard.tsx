"use client";

import { Download, Save, Trash2 } from "lucide-react";
import { useEffect, useState } from "react";
import { questions } from "@/data/questions";
import { scoringRules } from "@/data/scoring";
import { useLabStore } from "@/store/lab-store";

type TaskConfig = {
  name: string;
  timeLimit: number;
  showHints: boolean;
  faultExam: boolean;
  hotMax: number;
  coldMin: number;
};

const initialTask: TaskConfig = {
  name: "预应力—温度循环规范操作",
  timeLimit: 20,
  showHints: true,
  faultExam: true,
  hotMax: 80,
  coldMin: 10
};

export function TeacherDashboard() {
  const [task, setTask] = useState(initialTask);
  const [saved, setSaved] = useState(false);
  const { logs, safetyErrors } = useLabStore();

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const raw = localStorage.getItem("aerofatigue-teacher-task");
        if (raw) setTask({ ...initialTask, ...JSON.parse(raw) });
      } catch {
        setTask(initialTask);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  function save() {
    try { localStorage.setItem("aerofatigue-teacher-task", JSON.stringify(task)); } catch {}
    setSaved(true);
    window.setTimeout(() => setSaved(false), 1800);
  }

  function exportScores() {
    const content = [
      "学生,任务,操作时长,安全得分,错误次数,数据位置",
      `本地演示学生,${task.name},${logs.length * 8}秒,${Math.max(0, 30 - safetyErrors * 8)},${safetyErrors},当前浏览器`
    ].join("\n");
    const url = URL.createObjectURL(new Blob([content], { type: "text/csv;charset=utf-8" }));
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "teacher-scores.csv";
    anchor.click();
    URL.revokeObjectURL(url);
  }

  function resetRecords() {
    if (!window.confirm("只重置当前浏览器中的教师任务设置，不会删除 materials 原始资料。是否继续？")) return;
    try { localStorage.removeItem("aerofatigue-teacher-task"); } catch {}
    setTask(initialTask);
  }

  return (
    <div className="space-y-5">
      <div className="border-l-4 border-[#174a8b] bg-[#e8eff8] p-4 font-semibold text-[#294d73]">当前为本地演示版，数据保存在当前浏览器或电脑中。不含真实账号、班级或云端数据库。</div>
      <div className="grid gap-5 xl:grid-cols-[1fr_.9fr]">
        <section className="panel p-6">
          <p className="task-code">任务配置 / 本地</p>
          <h2 className="mt-2 text-3xl font-black">创建实验任务</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="md:col-span-2"><span className="mb-2 block font-bold">任务名称</span><input className="w-full rounded-[6px] border border-[#9fa7af] bg-white px-4 py-3 outline-none focus:border-[#174a8b]" value={task.name} onChange={(event) => setTask({ ...task, name: event.target.value })} /></label>
            <label><span className="mb-2 block font-bold">时间限制（分钟）</span><input type="number" min={5} max={120} className="w-full rounded-[6px] border border-[#9fa7af] bg-white px-4 py-3 outline-none focus:border-[#174a8b]" value={task.timeLimit} onChange={(event) => setTask({ ...task, timeLimit: Number(event.target.value) })} /></label>
            <label><span className="mb-2 block font-bold">高温上限（℃）</span><input type="number" className="w-full rounded-[6px] border border-[#9fa7af] bg-white px-4 py-3 outline-none focus:border-[#e86f2a]" value={task.hotMax} onChange={(event) => setTask({ ...task, hotMax: Number(event.target.value) })} /></label>
            <label><span className="mb-2 block font-bold">低温下限（℃）</span><input type="number" className="w-full rounded-[6px] border border-[#9fa7af] bg-white px-4 py-3 outline-none focus:border-[#2b8ca3]" value={task.coldMin} onChange={(event) => setTask({ ...task, coldMin: Number(event.target.value) })} /></label>
            <div className="panel-soft space-y-3 p-4">
              <label className="flex items-center gap-3"><input type="checkbox" checked={task.showHints} onChange={(event) => setTask({ ...task, showHints: event.target.checked })} /> 显示操作提示</label>
              <label className="flex items-center gap-3"><input type="checkbox" checked={task.faultExam} onChange={(event) => setTask({ ...task, faultExam: event.target.checked })} /> 启用故障考核</label>
            </div>
          </div>
          <div className="mt-5 flex flex-wrap gap-3">
            <button className="lab-button flex items-center gap-2" onClick={save}><Save size={18} /> {saved ? "已保存" : "保存到本地"}</button>
            <button className="lab-button flex items-center gap-2" onClick={exportScores}><Download size={18} /> 导出成绩 CSV</button>
            <button className="lab-button danger-button flex items-center gap-2" onClick={resetRecords}><Trash2 size={18} /> 重置本地设置</button>
          </div>
        </section>

        <section className="panel p-6">
          <p className="task-code">评分规则</p>
          <h2 className="mt-2 text-3xl font-black">评分规则</h2>
          <div className="mt-6 grid grid-cols-2 gap-3">
            {[["操作", scoringRules.operation], ["安全", scoringRules.safety], ["数据理解", scoringRules.analysis], ["报告", scoringRules.report]].map(([label, value]) => (
              <div className="panel-soft p-4" key={label}><span className="muted">{label}</span><strong className="mt-1 block text-3xl">{value} 分</strong></div>
            ))}
          </div>
          <div className="mt-5 border-l-4 border-[#d99b28] bg-[#fff8e5] p-4 text-[#6f531b]">
            <strong>通过条件</strong>
            <p className="mt-2 leading-7">总分不少于 {scoringRules.passScore} 分，且安全分不少于 {scoringRules.minimumSafety} 分。安全联锁每次扣 {scoringRules.deductions.safetyInterlock} 分。</p>
          </div>
        </section>
      </div>

      <div className="grid gap-5 xl:grid-cols-2">
        <section className="panel p-6">
          <p className="task-code">本地学习记录</p>
          <h2 className="mt-2 text-3xl font-black">本地成绩概览</h2>
          <div className="mt-5 overflow-x-auto">
            <table className="w-full text-left">
              <thead><tr className="border-b-2 border-[#141a22] bg-[#eef0f1] text-[#174a8b]"><th className="p-3">学生</th><th className="p-3">操作数</th><th className="p-3">安全错误</th><th className="p-3">安全分</th></tr></thead>
              <tbody><tr className="border-b border-[#d4d8dc]"><td className="p-3 font-bold">本地演示学生</td><td className="p-3">{logs.length}</td><td className="p-3">{safetyErrors}</td><td className="p-3">{Math.max(0, 30 - safetyErrors * 8)}</td></tr></tbody>
            </table>
          </div>
          <h3 className="mt-6 text-xl font-black">最近操作</h3>
          <div className="mt-3 space-y-2">{logs.slice(0, 5).map((log) => <div className="panel-soft p-3 text-sm" key={log.id}><strong>{log.action}</strong><span className="muted ml-3">{log.message}</span></div>)}</div>
        </section>
        <section className="panel p-6">
          <p className="task-code">题库预览</p>
          <h2 className="mt-2 text-3xl font-black">题库预览</h2>
          <p className="muted mt-3">题目集中维护在 `src/data/questions.ts`，当前本地演示版提供结构化预览。</p>
          <div className="mt-5 space-y-3">
            {questions.map((question, index) => <div className="panel-soft p-4" key={question.id}><div className="flex gap-3"><span className="tag">{index + 1}</span><div><strong>{question.title}</strong><p className="muted mt-2 text-sm">{question.type} · {question.options.length} 个选项</p></div></div></div>)}
          </div>
        </section>
      </div>
    </div>
  );
}
