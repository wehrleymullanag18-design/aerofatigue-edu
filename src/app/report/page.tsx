import { FileText } from "lucide-react";
import { ReportView } from "@/components/report-view";
import { PageIntro } from "@/components/ui";

export default function ReportPage() {
  return (
    <div className="shell py-14">
      <PageIntro eyebrow="实验报告" title="把操作过程变成可复盘记录" description="报告汇总实验设定、操作日志、安全错误、模块评分和教学模拟数据，可打印为 A4，也可导出 JSON 与成绩 CSV。" icon={FileText} />
      <div className="mt-10"><ReportView /></div>
    </div>
  );
}
