"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, Plane, X } from "lucide-react";
import { useState } from "react";

const nav = [
  ["/", "课程首页"],
  ["/device", "设备认知"],
  ["/lab", "虚拟实验"],
  ["/analysis", "数据分析"],
  ["/report", "实验报告"],
  ["/teacher", "教师模式"],
  ["/presentation", "答辩模式"],
  ["/science", "科学声明"]
] as const;

export function AppHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const isLab = pathname === "/lab";
  return (
    <header className={`sticky top-0 z-50 border-b ${isLab ? "border-[#2c3743] bg-[#141a22] text-white" : "border-[#bfc5cc] bg-[#fcfcfa]/95 text-[#141a22]"} backdrop-blur`}>
      <div className="shell flex h-16 items-center gap-5">
        <Link href="/" className="mr-auto flex items-center gap-3" onClick={() => setOpen(false)}>
          <span className={`grid h-9 w-9 place-items-center border ${isLab ? "border-white/35 bg-white/5" : "border-[#174a8b] bg-[#174a8b] text-white"} rounded-[5px]`}>
            <Plane size={20} />
          </span>
          <span>
            <strong className="block text-[16px] tracking-[.02em]">AeroFatigue Edu</strong>
            <small className={`hidden text-[11px] sm:block ${isLab ? "text-slate-400" : "text-[#68727d]"}`}>预应力—温度循环疲劳实验教学</small>
          </span>
        </Link>
        <nav className="hidden h-full items-center xl:flex" aria-label="主导航">
          {nav.map(([href, label], index) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`flex h-full items-center border-x border-transparent px-3 text-sm font-bold transition ${
                  active
                    ? isLab ? "border-white/10 bg-white/10 text-white" : "border-[#c7d2df] bg-[#e8eff8] text-[#174a8b]"
                    : isLab ? "text-slate-300 hover:bg-white/5" : "text-[#46515d] hover:bg-[#eef1f3]"
                }`}
              >
                <span className="mono mr-1.5 text-[10px] opacity-60">{String(index + 1).padStart(2, "0")}</span>{label}
              </Link>
            );
          })}
        </nav>
        <span className={`hidden border px-2.5 py-1 text-xs font-bold lg:inline-flex ${isLab ? "border-[#51606f] text-slate-300" : "border-[#9da7b1] bg-white text-[#40505d]"} rounded-[3px]`}>
          本地教学模拟
        </span>
        <button
          className={`grid h-10 w-10 place-items-center rounded-[5px] border xl:hidden ${isLab ? "border-[#51606f]" : "border-[#9da7b1]"}`}
          onClick={() => setOpen(!open)}
          aria-label="打开导航"
          aria-expanded={open}
        >
          {open ? <X /> : <Menu />}
        </button>
      </div>
      {open && (
        <nav className={`shell grid gap-1 border-t py-3 xl:hidden ${isLab ? "border-[#2c3743]" : "border-[#c8cdd3]"}`} aria-label="移动端导航">
          {nav.map(([href, label], index) => (
            <Link key={href} href={href} className={`rounded-[4px] px-4 py-3 text-base font-semibold ${isLab ? "hover:bg-white/5" : "hover:bg-[#e8eff8]"}`} onClick={() => setOpen(false)}>
              <span className="mono mr-3 text-xs opacity-60">{String(index + 1).padStart(2, "0")}</span>{label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
