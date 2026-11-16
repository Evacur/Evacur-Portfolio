"use client";

import Link from "next/link";
import type { Project } from "@/lib/projects";

/** Vue liste : numéro, thème, cas inclus, nombre de cas, et au survol un volet noir qui monte derrière la ligne. */
export function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <section aria-label="Liste des thèmes" className="absolute inset-0 flex items-center justify-center">
      <ol className="group/list w-[min(720px,calc(100%-48px))]">
        {projects.map((p) => (
          <li key={p.slug}>
            <Link
              href={`/work/${p.slug}`}
              className="wk-row relative grid min-h-11 px-3 max-[760px]:px-0 grid-cols-[48px_1fr_1fr_64px] items-center border-b border-line transition-opacity duration-300 group-hover/list:opacity-30 hover:!opacity-100 focus-visible:!opacity-100 max-[760px]:grid-cols-[36px_1fr_52px]"
            >
              <span className="text-mute tabular-nums">{p.n}</span>
              <span className="wk-title relative"><span aria-hidden="true" className="wk-arrow">→</span>{p.title}</span>
              <span className="text-mute max-[760px]:hidden">{p.kind}</span>
              <span className="text-right text-mute">{p.year}</span>
            </Link>
          </li>
        ))}
      </ol>
    </section>
  );
}
