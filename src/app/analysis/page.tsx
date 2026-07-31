import { ChartNoAxesCombined } from "lucide-react";
import { AnalysisDashboard } from "@/components/analysis-dashboard";
import { PageIntro } from "@/components/ui";

export default function AnalysisPage() {
  return (
    <div className="shell py-14">
      <PageIntro eyebrow="数据分析教学" title="看趋势、找阶段、辨边界" description="使用固定种子生成平滑、可重复的教学模拟数据，帮助学生理解温度、预应力、应变和循环阶段之间的关系。" icon={ChartNoAxesCombined} />
      <div className="mt-10"><AnalysisDashboard /></div>
    </div>
  );
}
