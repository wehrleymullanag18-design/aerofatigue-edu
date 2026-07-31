import { Suspense } from "react";
import { LabConsole } from "@/components/lab-console";

export default function LabPage() {
  return (
    <div className="lab-shell py-3">
      <Suspense fallback={<div className="panel p-8">正在加载实验操作台…</div>}>
        <LabConsole />
      </Suspense>
    </div>
  );
}
