import { GraduationCap } from "lucide-react";
import { TeacherDashboard } from "@/components/teacher-dashboard";
import { PageIntro } from "@/components/ui";

export default function TeacherPage() {
  return (
    <div className="shell py-14">
      <PageIntro eyebrow="教师模式" title="任务、评分与操作记录集中管理" description="第一版采用本地存储，无需账号和服务器。教师可以设置任务范围、提示与故障考核，查看本地成绩和日志并导出 CSV。" icon={GraduationCap} />
      <div className="mt-10"><TeacherDashboard /></div>
    </div>
  );
}
