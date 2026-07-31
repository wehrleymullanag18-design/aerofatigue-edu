import { Boxes } from "lucide-react";
import { DeviceExplorer } from "@/components/device-explorer";
import { DeviceQuiz } from "@/components/device-quiz";
import { PageIntro } from "@/components/ui";

export default function DevicePage() {
  return (
    <div className="shell py-14">
      <PageIntro
        eyebrow="设备结构认知"
        title="先看懂设备，再开始操作"
        description="基于资料中的真实设备照片建立学习热点。已能从照片确认的位置直接标注；无法可靠确认的位置明确显示“位置待项目人员确认”，不做猜测。"
        icon={Boxes}
      />
      <div className="mt-10">
        <DeviceExplorer />
      </div>
      <div className="mt-8">
        <DeviceQuiz />
      </div>
    </div>
  );
}
