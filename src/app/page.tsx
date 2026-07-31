import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Check, Clock3, FileCheck2 } from "lucide-react";
import { learningObjectives } from "@/data/teaching";
import { modes, project, projectStatus, verifiedFacts } from "@/data/project";
import { assetPath } from "@/lib/asset-path";

const taskNames = ["认识设备", "操作练习", "正式考核", "答辩演示"];

export default function HomePage() {
  return (
    <>
      <section className="border-b border-[#bfc5cc] bg-[#fcfcfa]">
        <div className="shell grid min-h-[620px] gap-0 py-10 lg:grid-cols-[.92fr_1.08fr]">
          <div className="relative z-10 border border-[#aeb5bd] bg-[#fcfcfa] p-7 md:p-10 lg:border-r-0">
            <div className="flex items-center justify-between border-b border-[#141a22] pb-4">
              <span className="task-code">实验任务 AF-EDU-01</span>
              <span className="mono text-xs font-bold text-[#5b6671]">REV. 2026-07</span>
            </div>
            <div className="mt-8">
              <p className="eyebrow">航空材料实验教学任务单</p>
              <h1 className="mt-3 max-w-[760px] text-[clamp(2.35rem,3.6vw,3.65rem)] font-black leading-[1.06] tracking-[-.035em]">
                <span className="sr-only">AeroFatigue Edu — </span>
                <span className="block">预应力—温度</span>
                <span className="block">循环疲劳</span>
              </h1>
              <p className="mt-3 text-[clamp(1.25rem,2vw,1.8rem)] font-bold text-[#174a8b]">虚拟实验教学平台</p>
              <p className="muted mt-6 max-w-2xl text-lg font-semibold leading-8">{project.slogan}</p>
            </div>

            <dl className="mt-8 grid border-y border-[#c8cdd3] sm:grid-cols-2">
              {[
                ["课程名称", "温度循环疲劳实验"],
                ["预计时长", "45–60 分钟"],
                ["适用课程", "材料力学 · 疲劳与断裂"],
                ["考核项目", "流程规范 · 安全联锁 · 数据理解"]
              ].map(([label, value], index) => (
                <div key={label} className={`px-0 py-4 sm:px-4 ${index % 2 === 0 ? "sm:border-r" : ""} ${index < 2 ? "border-b" : ""} border-[#c8cdd3]`}>
                  <dt className="text-xs font-bold text-[#6b747e]">{label}</dt>
                  <dd className="mt-1.5 font-bold">{value}</dd>
                </div>
              ))}
            </dl>

            <div className="mt-7">
              <h2 className="flex items-center gap-2 text-sm font-black text-[#174a8b]"><FileCheck2 size={17} /> 本任务完成后</h2>
              <ul className="mt-3 grid gap-2 sm:grid-cols-2">
                {learningObjectives.slice(0, 6).map((item) => (
                  <li className="flex items-start gap-2 text-sm font-semibold leading-6" key={item}>
                    <Check className="mt-1 shrink-0 text-[#258260]" size={15} />{item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link href="/lab?mode=practice" className="control-button primary-button inline-flex items-center gap-2 px-5">
                启动操作练习 <ArrowRight size={18} />
              </Link>
              <Link href="/device?mode=learn" className="control-button inline-flex items-center gap-2 px-5">先认识设备</Link>
            </div>
          </div>

          <figure className="relative min-h-[500px] overflow-hidden border border-[#aeb5bd] bg-[#dde1e6]">
            <Image
              src={assetPath("/assets/images/original/device-overview.jpg")}
              alt="真实预应力温度循环疲劳设备总览"
              fill
              priority
              className="object-cover"
              sizes="(min-width: 1024px) 55vw, 100vw"
            />
            <div className="absolute inset-x-0 top-0 flex items-center justify-between border-b border-white/30 bg-[#141a22]/88 px-4 py-3 text-white">
              <span className="mono text-xs font-bold">实体设备 / 总体视图</span>
              <span className="text-xs">资料照片 01</span>
            </div>
            <div className="absolute left-[8%] top-[24%] border-l-2 border-white bg-[#141a22]/85 px-3 py-2 text-xs font-bold text-white">
              <span className="block text-[#9cc8ff]">A-01</span>上位机与温度控制
            </div>
            <div className="absolute right-[5%] top-[42%] border-r-2 border-[#e86f2a] bg-[#141a22]/85 px-3 py-2 text-right text-xs font-bold text-white">
              <span className="block text-[#f7b287]">A-02</span>实验加载测试区
            </div>
            <div className="absolute bottom-[8%] right-[7%] border-r-2 border-[#2b8ca3] bg-[#141a22]/85 px-3 py-2 text-right text-xs font-bold text-white">
              <span className="block text-[#8ed0df]">A-03</span>循环制冷组件
            </div>
            <figcaption className="absolute inset-x-0 bottom-0 border-t border-white/30 bg-[#141a22]/90 px-4 py-3 text-xs font-semibold text-slate-200">
              真实设备资料照片 · 页面叠加标注用于教学认知
            </figcaption>
          </figure>
        </div>
      </section>

      <section className="shell py-14">
        <div className="flex flex-wrap items-end justify-between gap-4 border-b border-[#141a22] pb-4">
          <div>
            <span className="task-code">任务入口</span>
            <h2 className="mt-3 text-3xl font-black">选择本次实验任务</h2>
          </div>
          <p className="muted max-w-xl text-sm leading-6">四种模式共用同一套设备资料、状态机和安全规则，操作记录在当前浏览器本地保存。</p>
        </div>
        <div className="grid gap-x-8 gap-y-0 lg:grid-cols-2">
          {modes.map((mode, index) => (
            <Link
              href={mode.href}
              key={mode.id}
              className="group grid min-h-[150px] grid-cols-[70px_1fr_auto] items-center border-b border-[#b8bec5] bg-[#fcfcfa] px-4 transition hover:bg-[#e8eff8]"
            >
              <span className="mono text-3xl font-black text-[#174a8b]">{String(index + 1).padStart(2, "0")}</span>
              <span className="border-l border-[#b8bec5] pl-5">
                <h3 className="text-xs font-bold text-[#68727d]">{mode.title}</h3>
                <span className="mt-1 block text-2xl font-black">{taskNames[index]}</span>
                <span className="muted mt-2 block text-sm">{mode.caption}</span>
              </span>
              <ArrowRight className="text-[#174a8b] transition group-hover:translate-x-1" />
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-[#bfc5cc] bg-[#e6e8e8] py-14">
        <div className="shell grid gap-10 lg:grid-cols-[.7fr_1.3fr]">
          <div>
            <span className="task-code">设备依据</span>
            <h2 className="mt-4 text-3xl font-black">真实设备是数字实验的视觉主体</h2>
            <p className="muted mt-4 text-base leading-7">平台使用整机、控制界面和加载模块实拍建立教学映射；未能从照片确认的位置保持“待项目人员确认”。</p>
            <Link href="/device" className="mt-6 inline-flex items-center gap-2 font-black text-[#174a8b]">打开设备工卡 <ArrowRight size={17} /></Link>
          </div>
          <div className="grid border border-[#aeb5bd] bg-[#fcfcfa] sm:grid-cols-2 xl:grid-cols-4">
            {verifiedFacts.map((fact, index) => (
              <div key={fact.label} className={`p-5 ${index < 3 ? "xl:border-r" : ""} ${index % 2 === 0 ? "sm:border-r xl:border-r" : ""} border-[#c8cdd3]`}>
                <span className="mono text-xs font-bold text-[#174a8b]">D-{String(index + 1).padStart(2, "0")}</span>
                <strong className="mt-3 block text-xl">{fact.value}</strong>
                <span className="muted mt-2 block text-sm leading-6">{fact.note}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="shell py-14">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_.8fr]">
          <div className="border border-[#aeb5bd] bg-[#fcfcfa]">
            <div className="flex items-center justify-between border-b border-[#aeb5bd] px-5 py-3">
              <h2 className="font-black">课程学习目标</h2>
              <span className="mono text-xs text-[#68727d]">OBJ / 08</span>
            </div>
            <div className="grid md:grid-cols-2">
              {learningObjectives.map((item, index) => (
                <div key={item} className="flex items-start gap-3 border-b border-[#d4d8dc] p-4 md:odd:border-r">
                  <span className="mono font-black text-[#174a8b]">{String(index + 1).padStart(2, "0")}</span>
                  <span className="font-semibold leading-6">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="space-y-0 border border-[#aeb5bd] bg-[#fcfcfa]">
            {projectStatus.map((group, index) => (
              <div className="grid grid-cols-[44px_1fr] border-b border-[#c8cdd3] p-5 last:border-b-0" key={group.status}>
                <span className={`mt-1 h-3 w-3 ${index === 0 ? "bg-[#258260]" : index === 1 ? "bg-[#174a8b]" : "bg-[#8b949e]"}`} />
                <div>
                  <h3 className="font-black">{group.status}</h3>
                  <ul className="muted mt-3 space-y-1.5 text-sm">
                    {group.items.map((item) => <li key={item}>— {item}</li>)}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
        <p className="mt-6 flex items-center gap-2 text-sm font-bold text-[#755b1d]"><Clock3 size={16} /> 平台当前不连接真实设备；模拟数据不代表正式实验结论。</p>
      </section>
    </>
  );
}
