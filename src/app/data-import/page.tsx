import { FileSpreadsheet, UploadCloud } from "lucide-react";
import { PageIntro, SimulationNotice } from "@/components/ui";

export default function DataImportPage() {
  return (
    <div className="shell py-14">
      <PageIntro eyebrow="真实数据回放接口" title="先校验，再决定能否绘图" description="功能预留，待获得真实设备 CSV 或 Excel 数据后启用。当前页面只说明字段和校验流程，不会伪造或自动认定真实数据。" icon={FileSpreadsheet} />
      <div className="mt-10 grid gap-5 lg:grid-cols-[1.1fr_.9fr]">
        <section className="panel p-7">
          <div className="blueprint-field grid min-h-72 place-items-center border-2 border-dashed border-[#8f98a3] text-center">
            <div>
              <UploadCloud className="mx-auto text-[#174a8b]" size={46} />
              <h2 className="mt-4 text-2xl font-black">真实数据导入尚未启用</h2>
              <p className="muted mx-auto mt-3 max-w-md leading-7">待项目组提供正式数据、字段定义和单位后，再开放 CSV / Excel 文件选择。</p>
              <button disabled className="lab-button mt-5">选择文件（功能预留）</button>
            </div>
          </div>
        </section>
        <section className="panel p-7">
          <h2 className="text-2xl font-black">未来导入检查</h2>
          <ol className="muted mt-5 space-y-3 pl-5 leading-7">
            {["预览列名与数据来源", "识别时间、温度、预应力、应变与循环次数字段", "确认单位与设备量程", "检查缺失值、格式和非有限数值", "选择“真实导入”或“教学模拟”来源标签", "通过审核后绘制曲线"].map((item) => <li className="list-decimal" key={item}>{item}</li>)}
          </ol>
          <div className="mt-6"><SimulationNotice /></div>
        </section>
      </div>
    </div>
  );
}
