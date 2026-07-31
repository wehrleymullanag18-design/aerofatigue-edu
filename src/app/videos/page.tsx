import { Film, VideoOff } from "lucide-react";
import { PageIntro } from "@/components/ui";

const videos = [
  ["设备整体视频", "device-overview.mp4"],
  ["试样安装视频", "specimen-installation.mp4"],
  ["循环加载视频", "cycling-motion.mp4"],
  ["操作界面视频", "control-interface-demo.mp4"]
];

export default function VideosPage() {
  return (
    <div className="shell py-14">
      <PageIntro eyebrow="真实视频接口" title="真实设备视频待补充" description="当前资料明确没有真实设备视频。第一版使用实拍照片与标注清晰的 2.5D 教学动画，不创建破损播放器。" icon={Film} />
      <div className="mt-10 grid gap-5 md:grid-cols-2">
        {videos.map(([label, filename]) => (
          <section className="panel grid min-h-64 place-items-center p-7 text-center" key={filename}>
            <div>
              <VideoOff className="mx-auto text-slate-500" size={42} />
              <h2 className="mt-4 text-2xl font-black">{label}</h2>
              <p className="muted mt-2">真实设备视频待补充。</p>
              <code className="mt-4 inline-block border border-[#9fa7af] bg-[#eef0f1] px-3 py-2 text-[#174a8b]">{filename}</code>
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
