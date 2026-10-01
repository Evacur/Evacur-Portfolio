import Image from "next/image";
import type { Project } from "@/lib/projects";

/** Visuel d'un projet : la vraie couverture si elle existe, sinon un aperçu neutre teinté. */
export function ProjectVisual({ project, priority = false }: { project: Project; priority?: boolean }) {
  if (project.cover) {
    return (
      <Image
        src={project.cover}
        alt=""
        fill
        priority={priority}
        sizes="(max-width: 760px) 80vw, 360px"
        className="object-cover"
      />
    );
  }
  return (
    <span className="absolute inset-0 flex items-center justify-center" style={{ background: project.tint }}>
      <span className="flex h-[62%] w-[64%] flex-col gap-[9px] rounded bg-white p-3.5 shadow-[0_24px_48px_-28px_rgba(0,0,0,.35)]">
        <span className="block h-[9px] w-[42%] rounded-sm" style={{ background: project.ink }} />
        <span className="block h-1.5 w-[80%] rounded-sm bg-[#E6E6E6]" />
        <span className="block h-1.5 w-[62%] rounded-sm bg-[#E6E6E6]" />
        <span className="block grow rounded-[3px]" style={{ background: project.tint }} />
      </span>
    </span>
  );
}
