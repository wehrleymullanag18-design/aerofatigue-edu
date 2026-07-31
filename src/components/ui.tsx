import { AlertTriangle, Database, type LucideIcon } from "lucide-react";
import { project } from "@/data/project";

export function SimulationNotice({ animation = false }: { animation?: boolean }) {
  return (
    <div className="sim-notice" role="note">
      {animation ? <AlertTriangle size={19} /> : <Database size={19} />}
      <span>{animation ? project.animationStatement : project.statement}</span>
    </div>
  );
}

export function PageIntro({
  eyebrow,
  title,
  description
}: {
  eyebrow: string;
  title: string;
  description: string;
  icon?: LucideIcon;
}) {
  return (
    <div className="max-w-5xl border-l-4 border-[#174a8b] pl-5">
      <p className="eyebrow">{eyebrow}</p>
      <h1 className="section-title mt-2">{title}</h1>
      <p className="muted mt-4 max-w-4xl text-lg leading-8">{description}</p>
    </div>
  );
}
