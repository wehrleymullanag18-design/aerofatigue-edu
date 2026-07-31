"use client";

import Image from "next/image";
import { ChevronLeft, ChevronRight, CircleHelp, MapPin, X } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { deviceParts } from "@/data/device-parts";
import { assetPath } from "@/lib/asset-path";

const images = [
  { src: assetPath("/assets/images/original/device-overview.jpg"), label: "设备整体" },
  { src: assetPath("/assets/images/original/control-interface.jpg"), label: "控制界面" },
  { src: assetPath("/assets/images/original/loading-module.jpg"), label: "加载模块" }
];

export function DeviceExplorer() {
  const [activeImage, setActiveImage] = useState(images[0].src);
  const [activeId, setActiveId] = useState(deviceParts[0].id);
  const [learned, setLearned] = useState<string[]>([]);
  const active = deviceParts.find((part) => part.id === activeId) ?? deviceParts[0];
  const activeIndex = deviceParts.findIndex((part) => part.id === active.id);
  const hotspots = useMemo(
    () => deviceParts.filter((part) => part.image === activeImage && part.x !== undefined && part.y !== undefined),
    [activeImage]
  );

  useEffect(() => {
    const timer = window.setTimeout(() => {
      try {
        const stored = JSON.parse(localStorage.getItem("aerofatigue-learned") ?? "[]");
        if (Array.isArray(stored)) setLearned(stored.filter((id): id is string => typeof id === "string"));
      } catch {
        setLearned([]);
      }
    }, 0);
    return () => window.clearTimeout(timer);
  }, []);

  function selectPart(id: string) {
    const selected = deviceParts.find((part) => part.id === id);
    if (!selected) return;
    setActiveId(id);
    setActiveImage(selected.image);
    setLearned((previous) => {
      const next = previous.includes(id) ? previous : [...previous, id];
      try { localStorage.setItem("aerofatigue-learned", JSON.stringify(next)); } catch {}
      return next;
    });
  }

  function move(direction: -1 | 1) {
    const next = (activeIndex + direction + deviceParts.length) % deviceParts.length;
    selectPart(deviceParts[next].id);
  }

  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1.55fr)_minmax(330px,.45fr)]">
      <section className="overflow-hidden border border-[#9fa7af] bg-[#fcfcfa]">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#141a22] bg-[#eef0f1] p-4">
          <div>
            <span className="task-code">设备认知工卡 / 01</span>
            <p className="mt-2 font-bold">点击实拍图定位部件</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {images.map((image) => (
              <button
                key={image.src}
                onClick={() => setActiveImage(image.src)}
                className={`border px-3 py-2 text-sm font-bold ${activeImage === image.src ? "border-[#174a8b] bg-[#174a8b] text-white" : "border-[#9fa7af] bg-white text-[#44505c]"}`}
              >
                {image.label}
              </button>
            ))}
          </div>
        </div>
        <div className="relative bg-white">
          <Image
            key={activeImage}
            src={activeImage}
            alt="真实设备部件认知照片"
            width={1000}
            height={700}
            priority
            className="h-auto max-h-[650px] w-full object-contain"
          />
          {hotspots.map((part) => (
            <button
              className="hotspot"
              style={{ left: `${part.x}%`, top: `${part.y}%` }}
              key={part.id}
              title={part.name}
              aria-label={`查看${part.name}`}
              aria-pressed={part.id === active.id}
              onClick={() => selectPart(part.id)}
            >
              <span className="sr-only">{part.name}</span>
            </button>
          ))}
        </div>
        <div className="flex flex-wrap items-center gap-3 border-t border-[#aeb5bd] p-4">
          <span className="tag"><MapPin size={14} /> 已学习 {learned.length} / {deviceParts.length} 个部件</span>
          <div className="h-2 min-w-40 flex-1 border border-[#9fa7af] bg-white p-px">
            <div className="h-full bg-[#174a8b] transition-all" style={{ width: `${(learned.length / deviceParts.length) * 100}%` }} />
          </div>
          <span className="muted text-sm">无可靠坐标的部件仅在目录展示</span>
        </div>
      </section>

      <aside className="space-y-4">
        <section className="border border-[#9fa7af] bg-[#fcfcfa] p-5" aria-live="polite">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-black text-[#174a8b]">{active.system}</p>
              <h2 className="mt-2 text-2xl font-black">{active.name}</h2>
            </div>
            <button aria-label="关闭详情" className="grid h-9 w-9 place-items-center border border-[#9fa7af]" onClick={() => setActiveId(deviceParts[0].id)}><X size={18} /></button>
          </div>
          <span className={`mt-4 inline-flex border px-3 py-1 text-sm font-bold ${active.confirmed ? "border-[#8db7a4] bg-[#edf5f1] text-[#216d51]" : "border-[#d8b665] bg-[#fff8e5] text-[#7a5918]"}`}>
            {active.status}
          </span>
          <dl className="mt-5 border-t border-[#b8bec5]">
            {[
              ["主要功能", active.function],
              ["输入", active.input],
              ["输出", active.output],
              ["流程作用", active.role],
              ["安全与精度", active.safety],
              ["部件关系", active.relation]
            ].map(([label, value]) => (
              <div key={label} className="border-b border-[#d7dade] py-3">
                <dt className="text-xs font-black text-[#174a8b]">{label}</dt>
                <dd className="muted mt-1 leading-6">{value}</dd>
              </div>
            ))}
          </dl>
          <div className="mt-5 grid grid-cols-2 gap-3">
            <button className="lab-button flex items-center justify-center gap-2" onClick={() => move(-1)}><ChevronLeft size={18} /> 上一个</button>
            <button className="lab-button flex items-center justify-center gap-2" onClick={() => move(1)}>下一个 <ChevronRight size={18} /></button>
          </div>
        </section>
        <section className="max-h-[410px] overflow-y-auto border border-[#9fa7af] bg-[#fcfcfa] p-3">
          <h3 className="px-2 py-2 text-lg font-black">部件目录</h3>
          <div className="grid">
            {deviceParts.map((part, index) => (
              <button
                key={part.id}
                onClick={() => selectPart(part.id)}
                className={`flex items-center gap-3 border-t border-[#d7dade] px-3 py-2.5 text-left text-sm transition ${part.id === active.id ? "bg-[#e8eff8] text-[#174a8b]" : "hover:bg-[#f0f1ef]"}`}
              >
                <span className="mono grid h-7 w-7 shrink-0 place-items-center border border-[#9fa7af] bg-white text-xs font-black">{String(index + 1).padStart(2, "0")}</span>
                <span className="font-bold">{part.name}</span>
                {!part.confirmed && <CircleHelp className="ml-auto text-[#d99b28]" size={15} />}
              </button>
            ))}
          </div>
        </section>
      </aside>
    </div>
  );
}
