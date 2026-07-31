"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  BarChart3,
  Check,
  CheckCircle2,
  ClipboardCheck,
  Download,
  FileText,
  Home,
  ListChecks,
  Lock,
  Pause,
  Play,
  RefreshCcw,
  ShieldAlert,
  Siren
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { workflow } from "@/data/teaching";
import { calculateScore } from "@/data/scoring";
import { toCsv, toJson } from "@/lib/simulation";
import type { LabAction, LabState } from "@/lib/state-machine";
import { stateLabels } from "@/lib/state-machine";
import { useLabStore } from "@/store/lab-store";
import { MachineVisual } from "./machine-visual";
import { RealtimeChart } from "./realtime-chart";
import { TelemetryConductor } from "./telemetry-conductor";
import { SimulationNotice } from "./ui";

const actionByStep: Record<string, LabAction> = {
  connect: "connect",
  home: "home",
  "open-door": "openDoor",
  "select-specimen": "selectSpecimen",
  "select-fixture": "selectFixture",
  load: "install",
  clamp: "clamp",
  "close-door": "closeDoor",
  parameters: "setParameters",
  heat: "heat",
  cool: "cool",
  environment: "confirmEnvironment",
  prestress: "prestress",
  check: "check",
  start: "start"
};

const enabledStates: Record<string, LabState[]> = {
  connect: ["offline"],
  home: ["connected"],
  "open-door": ["ready"],
  "select-specimen": ["door-open"],
  "select-fixture": ["specimen-selecting"],
  load: ["specimen-selecting"],
  clamp: ["specimen-loading"],
  "close-door": ["specimen-clamped"],
  parameters: ["door-closed"],
  heat: ["parameter-setting"],
  cool: ["heating"],
  environment: ["cooling"],
  prestress: ["environment-ready"],
  check: ["prestressing"],
  start: ["experiment-ready"]
};

const checklist = [
  { number: "01", label: "连接设备", ids: ["connect"] },
  { number: "02", label: "设备归零", ids: ["home"] },
  { number: "03", label: "打开防护门", ids: ["open-door"] },
  { number: "04", label: "选择试样", ids: ["select-specimen"] },
  { number: "05", label: "安装与夹紧", ids: ["select-fixture", "load", "clamp"] },
  { number: "06", label: "关闭防护门", ids: ["close-door"] },
  { number: "07", label: "设置参数", ids: ["parameters"] },
  { number: "08", label: "预热与预冷", ids: ["heat", "cool", "environment"] },
  { number: "09", label: "施加预应力", ids: ["prestress"] },
  { number: "10", label: "启动循环", ids: ["check", "start"] },
  { number: "11", label: "数据分析", ids: [] },
  { number: "12", label: "生成报告", ids: [] }
] as const;

const runningStates: LabState[] = ["running-hot", "running-cold", "moving-to-cold", "moving-to-hot"];
const postStartStates: LabState[] = [...runningStates, "paused", "completed", "warning", "fault", "emergency-stop"];

function download(content: string, filename: string, type: string) {
  const url = URL.createObjectURL(new Blob([content], { type }));
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function LabConsole() {
  const searchParams = useSearchParams();
  const store = useLabStore();
  const [hydrated, setHydrated] = useState(false);
  const [clock, setClock] = useState("--:--:--");
  const [drawer, setDrawer] = useState<"trend" | "logs" | "safety">("trend");
  const [reviewIndex, setReviewIndex] = useState<number | null>(null);
  const setMode = useLabStore((state) => state.setMode);
  const tick = useLabStore((state) => state.tick);
  const running = runningStates.includes(store.state);
  const resolvedReviewIndex = reviewIndex === null ? store.data.length - 1 : Math.min(reviewIndex, Math.max(0, store.data.length - 1));
  const visibleData = reviewIndex === null ? store.data : store.data.slice(0, resolvedReviewIndex + 1);
  const current = visibleData.at(-1);
  const displayState = reviewIndex !== null && current ? current.machineState : store.state;
  const progress = current?.progress ?? 0;
  const score = useMemo(
    () =>
      calculateScore(
        Math.min(workflow.length, store.logs.filter((log) => log.level === "success").length),
        workflow.length,
        store.safetyErrors
      ),
    [store.logs, store.safetyErrors]
  );

  useEffect(() => {
    const updateClock = () => setClock(new Date().toLocaleTimeString("zh-CN", { hour12: false }));
    const timer = window.setTimeout(() => {
      setHydrated(true);
      updateClock();
    }, 0);
    const clockTimer = window.setInterval(updateClock, 1000);
    return () => {
      window.clearTimeout(timer);
      window.clearInterval(clockTimer);
    };
  }, []);

  useEffect(() => {
    const mode = searchParams.get("mode");
    if (mode === "learn" || mode === "practice" || mode === "exam") setMode(mode);
  }, [searchParams, setMode]);

  useEffect(() => {
    if (!running) return;
    const id = window.setInterval(tick, 450);
    return () => window.clearInterval(id);
  }, [running, tick]);

  const completedStep = (id: string) => {
    const context = store.context;
    const values: Record<string, boolean> = {
      connect: context.connected,
      home: context.homed,
      "open-door": context.specimenSelected,
      "select-specimen": context.specimenSelected,
      "select-fixture": context.fixtureSelected,
      load: context.specimenInstalled,
      clamp: context.specimenClamped,
      "close-door": context.doorClosed && context.specimenClamped,
      parameters: context.parametersSet,
      heat: context.hotReady,
      cool: context.coldReady,
      environment: context.hotReady && context.coldReady,
      prestress: context.prestressApplied,
      check: store.state === "experiment-ready" || postStartStates.includes(store.state),
      start: postStartStates.includes(store.state)
    };
    return values[id] ?? false;
  };

  const safetyItems = [
    ["防护门", store.context.doorClosed, store.context.doorClosed ? "已关闭" : "未关闭"],
    ["试样夹紧", store.context.specimenClamped, store.context.specimenClamped ? "夹紧确认" : "待确认"],
    ["环境准备", store.context.hotReady && store.context.coldReady, store.context.hotReady && store.context.coldReady ? "冷热槽就绪" : "未完成"],
    ["传感器", store.state !== "fault", store.state === "fault" ? "故障预设触发" : "教学模拟正常"],
    ["运动机构", !["fault", "emergency-stop"].includes(store.state), store.state === "emergency-stop" ? "急停锁止" : "状态正常"],
    ["报警状态", !current?.alarmCode && store.state !== "emergency-stop", current?.alarmCode || (store.state === "emergency-stop" ? "E-STOP" : "无报警")]
  ] as const;

  return (
    <div className="space-y-3">
      {hydrated && <span data-testid="lab-ready" className="sr-only">控制台已就绪</span>}

      <section className="grid border border-[#313b47] bg-[#141a22] text-white lg:grid-cols-[1.35fr_repeat(4,auto)]">
        <div className="flex min-h-14 items-center gap-3 border-b border-white/15 px-4 lg:border-b-0 lg:border-r">
          <span className="mono border border-white/30 px-2 py-1 text-[10px] font-black">AF-EDU-01</span>
          <div>
            <strong className="block text-sm">AeroFatigue 实验操作台</strong>
            <span className="text-[11px] text-slate-400">预应力—温度循环疲劳</span>
          </div>
        </div>
        {[
          ["当前模式", store.mode === "learn" ? "学习" : store.mode === "practice" ? "练习" : "考核"],
          ["设备状态", stateLabels[store.state]],
          ["实验编号", "TCF-2026-01"],
          ["当前时间", clock]
        ].map(([label, value]) => (
          <div key={label} className="min-w-[130px] border-r border-white/15 px-4 py-2.5 last:border-r-0">
            <span className="block text-[10px] font-bold text-slate-400">{label}</span>
            <strong className="mono mt-1 block text-xs">{value}</strong>
          </div>
        ))}
      </section>

      <div className="flex flex-wrap items-center gap-2 border border-[#c8cdd3] bg-[#fcfcfa] px-3 py-2">
        <span className="mr-1 text-xs font-black text-[#5d6873]">操作模式</span>
        {(["learn", "practice", "exam"] as const).map((mode) => (
          <button
            key={mode}
            onClick={() => setMode(mode)}
            className={`min-h-8 border px-3 text-xs font-black ${
              store.mode === mode ? "border-[#174a8b] bg-[#174a8b] text-white" : "border-[#aeb5bd] bg-white"
            }`}
          >
            {mode === "learn" ? "学习" : mode === "practice" ? "练习" : "考核"}
          </button>
        ))}
        <span className="ml-2 text-xs font-black text-[#5d6873]">教学预设</span>
        {(["normal", "warning", "fault"] as const).map((preset) => (
          <button
            key={preset}
            onClick={() => store.setPreset(preset)}
            className={`min-h-8 border px-3 text-xs font-black ${
              store.preset === preset
                ? preset === "normal"
                  ? "border-[#258260] bg-[#e7f2ed] text-[#1d6a4d]"
                  : preset === "warning"
                    ? "border-[#d99b28] bg-[#fff4d8] text-[#765413]"
                    : "border-[#bd3434] bg-[#fae8e8] text-[#8d2222]"
                : "border-[#aeb5bd] bg-white"
            }`}
          >
            {preset === "normal" ? "正常" : preset === "warning" ? "警告" : "故障"}
          </button>
        ))}
        <button className="control-button ml-auto flex min-h-8 items-center gap-2 !px-3 !py-1 text-xs" onClick={() => { setReviewIndex(null); store.restart(); }}>
          <RefreshCcw size={14} /> 重新实验
        </button>
        <Link href="/" className="control-button flex min-h-8 items-center gap-2 !px-3 !py-1 text-xs">
          <Home size={14} /> 返回课程首页
        </Link>
      </div>

      <div className="grid items-start gap-3 xl:grid-cols-[245px_minmax(0,1fr)_310px] 2xl:grid-cols-[285px_minmax(0,1fr)_355px]">
        <aside className="border border-[#b8bec5] bg-[#fcfcfa] xl:max-h-[min(650px,calc(100vh-250px))] xl:overflow-y-auto">
          <div className="border-b border-[#141a22] px-4 py-3">
            <span className="task-code">工作检查单</span>
            <p className="mt-2 text-xs font-semibold text-[#5f6974]">按顺序执行 · 状态机安全联锁</p>
          </div>
          <div>
            {checklist.map((group) => {
              const allCompleted =
                group.ids.length > 0
                  ? group.ids.every((id) => completedStep(id))
                  : group.number === "11"
                    ? store.data.length > 0
                    : store.state === "completed";
              const active = group.ids.some((id) => enabledStates[id]?.includes(store.state)) ||
                (group.number === "11" && store.data.length > 0 && store.state !== "completed") ||
                (group.number === "12" && store.state === "completed");
              const locked = !allCompleted && !active;

              return (
                <div
                  key={group.number}
                  className={`relative grid grid-cols-[42px_1fr] border-b border-[#d7dade] last:border-b-0 ${
                    active ? "bg-[#e8eff8]" : ""
                  }`}
                >
                  <div className={`flex flex-col items-center border-r py-3 ${
                    active ? "border-[#174a8b] bg-[#174a8b] text-white" : "border-[#d7dade]"
                  }`}>
                    <strong className="mono text-sm">{group.number}</strong>
                    {allCompleted ? <CheckCircle2 className="mt-2 text-[#258260]" size={15} /> : locked ? <Lock className="mt-2 text-[#9aa1a8]" size={13} /> : null}
                  </div>
                  <div className="min-w-0 px-3 py-2.5">
                    <strong className={`block text-sm ${locked ? "text-[#8a929a]" : ""}`}>{group.label}</strong>
                    {group.ids.length > 0 && (
                      <div className="mt-1.5 flex flex-wrap gap-1">
                        {group.ids.map((id) => {
                          const step = workflow.find((item) => item.id === id);
                          if (!step) return null;
                          const enabled = hydrated && (enabledStates[id]?.includes(store.state) ?? false);
                          const completed = completedStep(id);
                          return (
                            <button
                              key={id}
                              data-testid={`step-${id}`}
                              disabled={!enabled}
                              title={enabled ? step.hint : `当前状态“${stateLabels[store.state]}”不满足此步骤前置条件`}
                              className={`border px-2 py-1 text-left text-[11px] font-bold ${
                                completed
                                  ? "border-[#94b9a8] bg-[#edf5f1] text-[#1f6d50]"
                                  : enabled
                                    ? "border-[#174a8b] bg-white text-[#174a8b]"
                                    : "border-[#d7dade] bg-[#f5f5f2] text-[#92999f]"
                              }`}
                              onClick={() => store.runAction(actionByStep[id], step.label)}
                            >
                              {completed && <Check className="mr-1 inline" size={11} />}
                              {step.label}
                            </button>
                          );
                        })}
                      </div>
                    )}
                    {group.number === "11" && <Link className="mt-1 block text-xs font-bold text-[#174a8b]" href="/analysis">查看实时数据 →</Link>}
                    {group.number === "12" && <Link className="mt-1 block text-xs font-bold text-[#174a8b]" href="/report">进入报告工卡 →</Link>}
                  </div>
                </div>
              );
            })}
          </div>
          <button
            disabled={!hydrated}
            className="flex w-full items-center gap-2 border-t border-[#d99b28] bg-[#fff8e5] px-3 py-3 text-left text-xs font-black text-[#765413] disabled:opacity-50"
            onClick={store.unsafeStart}
            data-testid="safety-interlock"
          >
            <ShieldAlert size={17} /> 安全联锁演示：防护门未关尝试启动
          </button>
        </aside>

        <main className="min-w-0">
          <MachineVisual point={current} historical={reviewIndex !== null} />
          <p className="mt-2 border-l-4 border-[#174a8b] bg-[#e8eff8] px-3 py-2 text-sm font-bold text-[#244766]" aria-live="polite">
            {reviewIndex !== null && current ? `历史回放：T+${current.elapsedTime}s · ${current.phase}` : store.lastMessage}
          </p>
        </main>

        <aside className="border border-[#9fa7af] bg-[#fcfcfa]">
          <div className="border-b border-[#141a22] bg-[#eef0f1] px-4 py-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <span className="text-[10px] font-black tracking-[.1em] text-[#606a75]">实验仪表坞</span>
                <h2 className="mt-1 text-lg font-black">{reviewIndex !== null ? `历史 · ${stateLabels[displayState]}` : stateLabels[store.state]}</h2>
              </div>
              <span className={`h-4 w-4 border-2 border-white outline outline-1 ${
                store.state === "emergency-stop" || current?.alarmCode ? "bg-[#bd3434] outline-[#bd3434]" : running ? "bg-[#258260] outline-[#258260]" : "bg-[#7d8790] outline-[#7d8790]"
              }`} />
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-[11px] font-bold text-[#5f6973]">
                <span>当前阶段：{current?.phase ?? stateLabels[displayState]}</span><span>{progress.toFixed(1)}%</span>
              </div>
              <div className="mt-1 h-2 border border-[#9fa7af] bg-white p-px">
                <div className="h-full bg-[#174a8b]" style={{ width: `${progress}%` }} />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2">
            {[
              ["试样温度", current?.specimenTemperature.toFixed(1) ?? "—", "℃", "text-[#e86f2a]"],
              ["当前预应力", current?.currentPrestress.toFixed(1) ?? "—", "N", "text-[#174a8b]"],
              ["当前应变", current?.strain.toFixed(1) ?? "—", "με", "text-[#258260]"],
              ["循环次数", String(current?.cycle ?? 0), `/ ${current?.targetCycles ?? 6}`, "text-[#141a22]"]
            ].map(([label, value, unit, color], index) => (
              <div key={label} className={`min-h-[104px] border-b border-[#d4d8dc] p-3 ${index % 2 === 0 ? "border-r" : ""}`}>
                <span className="text-[11px] font-bold text-[#68727d]">{label}</span>
                <strong className={`metric-value mt-2 block text-[clamp(1.65rem,2vw,2.25rem)] leading-none ${color}`}>{value}</strong>
                <span className="mono mt-1 block text-xs font-bold text-[#68727d]">{unit}</span>
              </div>
            ))}
          </div>

          <div className="p-4">
            <div className="flex items-center justify-between border-b border-[#c8cdd3] pb-2">
              <h3 className="text-sm font-black">运行操作</h3>
              <span className="mono text-xs text-[#68727d]">得分 {score.total}</span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <button data-testid="pause" disabled={!running} className="control-button flex items-center gap-2 text-sm" onClick={() => { setReviewIndex(null); store.runAction("pause", "暂停"); }}><Pause size={16} /> 暂停</button>
              <button data-testid="resume" disabled={store.state !== "paused"} className="control-button flex items-center gap-2 text-sm" onClick={() => { setReviewIndex(null); store.runAction("resume", "继续"); }}><Play size={16} /> 继续</button>
              <button data-testid="finish" disabled={!running} className="control-button flex items-center gap-2 text-sm" onClick={() => { setReviewIndex(null); store.runAction("complete", "完成循环"); }}><FileText size={16} /> 完成演示</button>
              <button data-testid="reset" disabled={!["emergency-stop", "completed", "fault", "warning"].includes(store.state)} className="control-button flex items-center gap-2 text-sm" onClick={() => { setReviewIndex(null); store.runAction("reset", "系统复位"); }}><RefreshCcw size={16} /> 系统复位</button>
            </div>
            <button
              data-testid="emergency-stop"
              disabled={store.state === "offline" || store.state === "emergency-stop"}
              className="danger-button mt-3 flex min-h-14 w-full items-center justify-center gap-3 border-2 text-base font-black disabled:opacity-45"
              onClick={() => { setReviewIndex(null); store.runAction("emergencyStop", "紧急停止"); }}
            >
              <span className="grid h-8 w-8 place-items-center border border-white/70 bg-[#8e2323]"><Siren size={18} /></span>
              紧急停止
            </button>
            {store.state === "completed" && (
              <Link href="/report" className="primary-button mt-3 flex min-h-11 items-center justify-center gap-2 border px-4 font-black">
                <FileText size={17} /> 打开实验报告
              </Link>
            )}
          </div>
        </aside>
      </div>

      <section className="border border-[#b8bec5] bg-[#fcfcfa]">
        <div className="flex overflow-x-auto border-b border-[#aeb5bd] bg-[#e9ebec]" role="tablist" aria-label="实验信息抽屉">
          {[
            ["trend", "趋势曲线", BarChart3],
            ["logs", "操作记录", ListChecks],
            ["safety", "安全检查", ClipboardCheck]
          ].map(([id, label, Icon]) => (
            <button
              key={id as string}
              role="tab"
              aria-selected={drawer === id}
              onClick={() => setDrawer(id as typeof drawer)}
              className={`flex min-h-11 items-center gap-2 border-r border-[#b8bec5] px-5 text-sm font-black ${
                drawer === id ? "bg-[#fcfcfa] text-[#174a8b] shadow-[inset_0_3px_0_#174a8b]" : "text-[#59636d]"
              }`}
            >
              <Icon size={16} /> {label as string}
            </button>
          ))}
        </div>

        {drawer === "trend" && (
          <div className="p-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <h2 className="font-black">温度、预应力与应变趋势</h2>
                <p className="muted mt-1 text-xs">当前实验最重要的三组教学模拟数据</p>
              </div>
              <div className="flex gap-2">
                <button disabled={!store.data.length} className="control-button min-h-9 !px-3 !py-1 text-xs" onClick={() => download(toCsv(store.data), "aerofatigue-demo.csv", "text/csv;charset=utf-8")}><Download className="mr-1 inline" size={14} /> CSV</button>
                <button disabled={!store.data.length} className="control-button min-h-9 !px-3 !py-1 text-xs" onClick={() => download(toJson(store.data), "aerofatigue-demo.json", "application/json")}><Download className="mr-1 inline" size={14} /> JSON</button>
              </div>
            </div>
            {store.data.length ? (
              <RealtimeChart data={visibleData} compact />
            ) : (
              <div className="blueprint-field mt-4 grid h-[230px] place-items-center border border-dashed border-[#9fa7af] text-center">
                <div><p className="font-black">等待实验启动</p><p className="muted mt-2 text-sm">完成检查单后，曲线将在此绘制。</p></div>
              </div>
            )}
            <div className="mt-3">
              <TelemetryConductor
                points={store.data}
                activeIndex={reviewIndex}
                onChange={setReviewIndex}
                onLive={() => setReviewIndex(null)}
                label="实验同步时间轴"
              />
            </div>
            <SimulationNotice />
          </div>
        )}

        {drawer === "logs" && (
          <div className="max-h-[340px] overflow-y-auto p-5">
            <div className="mx-auto max-w-5xl">
              {store.logs.map((log) => (
                <div key={log.id} className={`grid grid-cols-[86px_16px_1fr] gap-3 border-b border-[#e0e2e4] py-3 text-sm ${
                  log.level === "danger" ? "text-[#8e2424]" : ""
                }`}>
                  <span className="mono text-xs text-[#68727d]">{log.time}</span>
                  <span className={`mt-1 h-3 w-3 border-2 border-white outline outline-1 ${
                    log.level === "danger" ? "bg-[#bd3434] outline-[#bd3434]" : log.level === "warning" ? "bg-[#d99b28] outline-[#d99b28]" : log.level === "success" ? "bg-[#258260] outline-[#258260]" : "bg-[#174a8b] outline-[#174a8b]"
                  }`} />
                  <div><strong>{log.action}</strong><p className="muted mt-1">{log.message}</p></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {drawer === "safety" && (
          <div className="grid md:grid-cols-2 xl:grid-cols-3">
            {safetyItems.map(([label, ok, note]) => (
              <div key={label} className="grid min-h-24 grid-cols-[38px_1fr] items-center border-b border-r border-[#d4d8dc] p-4">
                <span className={`grid h-7 w-7 place-items-center border ${ok ? "border-[#258260] bg-[#edf5f1] text-[#258260]" : "border-[#d99b28] bg-[#fff8e5] text-[#9a6c14]"}`}>
                  {ok ? <Check size={16} /> : <ShieldAlert size={16} />}
                </span>
                <div><strong className="text-sm">{label}</strong><p className="muted mt-1 text-xs">{note}</p></div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
