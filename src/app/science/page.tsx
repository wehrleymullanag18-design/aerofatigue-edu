import Image from "next/image";
import { BookOpen, CheckCircle2, ShieldAlert, XCircle } from "lucide-react";
import { PageIntro } from "@/components/ui";
import { assetPath } from "@/lib/asset-path";

export default function SciencePage() {
  return (
    <div className="shell py-14">
      <PageIntro eyebrow="科学声明" title="清楚区分：资料事实、教学模拟、未来验证" description="可信的教学平台首先要说清楚边界。本页集中说明数据、动画、指标和科研成果的使用规则。" icon={BookOpen} />
      <div className="mt-10 grid gap-5 lg:grid-cols-3">
        <section className="panel p-6">
          <CheckCircle2 className="text-emerald-400" size={28} />
          <h2 className="mt-4 text-2xl font-black">资料可确认</h2>
          <ul className="muted mt-4 space-y-3 pl-5 leading-7">
            <li className="list-disc">实体整机、控制面板与加载区照片</li>
            <li className="list-disc">高低温槽、作动平台、夹具与传感采集原理</li>
            <li className="list-disc">申请书中的系统工作流程和目标指标</li>
          </ul>
        </section>
        <section className="panel p-6">
          <ShieldAlert className="text-[#174a8b]" size={28} />
          <h2 className="mt-4 text-2xl font-black">教学模拟</h2>
          <ul className="muted mt-4 space-y-3 pl-5 leading-7">
            <li className="list-disc">传感器数值、实验曲线与故障时间点</li>
            <li className="list-disc">2.5D 动画、状态转换、评分与报告</li>
            <li className="list-disc">正常、警告和故障三种预设</li>
          </ul>
        </section>
        <section className="panel p-6">
          <XCircle className="text-red-400" size={28} />
          <h2 className="mt-4 text-2xl font-black">不能宣称</h2>
          <ul className="muted mt-4 space-y-3 pl-5 leading-7">
            <li className="list-disc">模拟数据等同于真实材料实验结论</li>
            <li className="list-disc">平台可替代实验室规程、检测或认证</li>
            <li className="list-disc">申请书预期成果已经自动视为验收完成</li>
          </ul>
        </section>
      </div>
      <section className="panel mt-5 grid overflow-hidden lg:grid-cols-[.9fr_1.1fr]">
        <Image src={assetPath("/assets/images/generated/system-overview-infographic.png")} alt="系统辅助设计图" width={1536} height={1024} className="h-full min-h-[380px] w-full object-cover" />
        <div className="p-7 md:p-10">
          <span className="tag border-[#174a8b] text-[#174a8b]">辅助设计图，不是实拍</span>
          <h2 className="mt-5 text-3xl font-black">申请书目标值如何使用？</h2>
          <p className="muted mt-4 text-lg leading-8">申请书写明高温环境可达到 80℃、低温环境可达到 10℃，以及温度和应力误差不高于 2%。本网站把它们作为资料中的目标值展示，并明确标注“未在本网站开发中独立复验”。</p>
          <div className="mt-6 border-l-4 border-[#d99b28] bg-[#fff8e5] p-5 text-lg font-bold leading-8 text-[#6f531b]">本平台不能代替真实设备操作规程、实验室安全培训、检测报告或正式工程验证。</div>
        </div>
      </section>
    </div>
  );
}
