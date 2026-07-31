"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, Expand, Pause, Play, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { presentationSlides } from "@/data/presentation";
import { assetPath } from "@/lib/asset-path";

export function PresentationDeck() {
  const router = useRouter();
  const stageRef = useRef<HTMLElement>(null);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const [duration, setDuration] = useState<3 | 5 | 8>(5);
  const slide = presentationSlides[index];

  const move = useCallback((delta: number) => {
    setIndex((current) => Math.max(0, Math.min(presentationSlides.length - 1, current + delta)));
  }, []);

  useEffect(() => {
    function onKey(event: KeyboardEvent) {
      if (event.key === "ArrowRight") move(1);
      if (event.key === "ArrowLeft") move(-1);
      if (event.key === " ") {
        event.preventDefault();
        setPaused((value) => !value);
      }
      if (event.key === "Escape" && !document.fullscreenElement) router.push("/");
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [move, router]);

  async function fullscreen() {
    if (stageRef.current?.requestFullscreen) await stageRef.current.requestFullscreen();
  }

  return (
    <section ref={stageRef} className="presentation-stage grid min-h-[calc(100vh-64px)] grid-rows-[auto_1fr_auto] overflow-hidden">
      <div className="flex flex-wrap items-center gap-3 border-b border-[#9fa7af] bg-[#fcfcfa] px-5 py-3">
        <span className="task-code mr-2">答辩演示</span>
        <strong className="mr-auto">{duration} 分钟讲解工卡</strong>
        <div className="flex gap-2">
          {([3, 5, 8] as const).map((value) => (
            <button key={value} onClick={() => setDuration(value)} className={`border px-3 py-1.5 text-sm font-black ${duration === value ? "border-[#174a8b] bg-[#174a8b] text-white" : "border-[#9fa7af] bg-white"}`}>{value} 分钟</button>
          ))}
        </div>
        <button className="grid h-9 w-9 place-items-center border border-[#9fa7af] bg-white" onClick={fullscreen} aria-label="全屏"><Expand size={17} /></button>
        <button className="grid h-9 w-9 place-items-center border border-[#9fa7af] bg-white" onClick={() => router.push("/")} aria-label="退出答辩"><X size={17} /></button>
      </div>

      <div className="shell grid items-center gap-8 py-8 lg:grid-cols-[.9fr_1.1fr]">
        <div key={index} className="border-l-4 border-[#174a8b] pl-6">
          <p className="text-xs font-black text-[#174a8b]">{String(index + 1).padStart(2, "0")} / {presentationSlides.length} · {slide.eyebrow}</p>
          <h1 className="mt-4 text-[clamp(2.5rem,5vw,5rem)] font-black leading-[1.03] tracking-[-.045em]">{slide.title}</h1>
          <p className="muted mt-7 max-w-3xl text-[clamp(1.1rem,1.7vw,1.55rem)] font-semibold leading-[1.6]">{slide.body}</p>
          <div className="mt-8 border-y border-[#9fa7af] bg-[#fcfcfa] px-5 py-4 text-lg font-black text-[#174a8b]">{slide.metric}</div>
          {index === 5 && <div className="mt-6 border-l-4 border-[#bd3434] bg-[#fae8e8] p-5 font-black text-[#8a2424]">安全联锁：防护门未关闭 → 启动被阻止 → 记录安全扣分</div>}
          {index === 9 && <p className="mt-8 text-2xl font-black leading-relaxed text-[#174a8b]">从认识设备，到规范操作；<br />从安全训练，到数据理解。</p>}
        </div>
        <div className="relative">
          <figure className="relative overflow-hidden border border-[#9fa7af] bg-[#dde1e6]">
            <Image
              src={assetPath(index === 1 ? "/assets/images/original/device-overview.jpg" : index === 2 ? "/assets/images/original/control-interface.jpg" : "/assets/images/original/loading-module.jpg")}
              alt="真实设备答辩展示"
              width={1000}
              height={700}
              className="aspect-[4/3] w-full object-cover"
              priority
            />
            <div className="absolute inset-x-0 top-0 flex justify-between border-b border-white/30 bg-[#141a22]/88 px-4 py-3 text-xs font-bold text-white">
              <span>实体设备 / 教学标注</span><span className="mono">FIG-{String(index + 1).padStart(2, "0")}</span>
            </div>
            <div className={`absolute left-[43%] top-[45%] h-20 w-14 border-2 border-white bg-[#174a8b]/70 ${!paused && index === 6 ? "motion-carriage" : ""} ${paused ? "motion-paused" : ""}`} />
            <figcaption className="absolute inset-x-0 bottom-0 border-t border-white/30 bg-[#141a22]/90 px-4 py-3 text-sm font-bold text-white">真实设备资料照片 · 覆盖层用于答辩说明</figcaption>
          </figure>
        </div>
      </div>

      <div className="border-t border-[#9fa7af] bg-[#fcfcfa] px-5 py-4">
        <div className="shell flex items-center gap-3">
          <button disabled={index === 0} className="lab-button flex items-center gap-2" onClick={() => move(-1)}><ChevronLeft /> 上一步</button>
          <button className="lab-button grid h-12 w-12 place-items-center !p-0" onClick={() => setPaused(!paused)} aria-label={paused ? "继续" : "暂停"}>{paused ? <Play /> : <Pause />}</button>
          <div className="mx-3 h-2 flex-1 border border-[#9fa7af] bg-white p-px"><div className="h-full bg-[#174a8b] transition-all" style={{ width: `${((index + 1) / presentationSlides.length) * 100}%` }} /></div>
          <span className="muted hidden font-bold md:inline">← → 切换 · 空格暂停 · ESC 退出</span>
          <button disabled={index === presentationSlides.length - 1} className="lab-button flex items-center gap-2" onClick={() => move(1)}>下一步 <ChevronRight /></button>
        </div>
      </div>
    </section>
  );
}
