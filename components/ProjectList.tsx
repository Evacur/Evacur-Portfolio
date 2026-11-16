"use client";

import Link from "next/link";
import type { Project } from "@/lib/projects";
import { useScramble } from "./useScramble";

/** Vue liste : numéro, thème, cas inclus, nombre de cas. Au survol, le titre se déchiffre comme le métier sur l'accueil. */
export function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <section aria-label="Liste des thèmes" className="absolute inset-0 flex items-center justify-center">
      <ol className="group/list w-[min(720px,calc(100%-48px))]">
        {projects.map((p) => <Row key={p.slug} p={p} />)}
      </ol>
    </section>
  );
}

function Row({ p }: { p: Project }) {
  const [title, runTitle] = useScramble(p.title, 600, false);
  const [kind, runKind] = useScramble(p.kind, 700, false);
  const run = () => { runTitle(); runKind(); };

  return (
    <li>
      <Link
        href={`/work/${p.slug}`}
        onPointerEnter={(e) => { if (e.pointerType === "mouse") run(); }}
        onFocus={run}
        aria-label={`${p.title}, ${p.kind}, ${p.year}`}
        data-cur="ouvrir"
        className="wk-row grid min-h-11 grid-cols-[48px_1fr_1fr_64px] items-center border-b border-line transition-opacity duration-300 group-hover/list:opacity-30 hover:!opacity-100 focus-visible:!opacity-100 max-[760px]:grid-cols-[36px_1fr_52px]"
      >
        <span aria-hidden="true" className="text-mute tabular-nums">{p.n}</span>
        <span aria-hidden="true" className="truncate">{title}</span>
        <span aria-hidden="true" className="truncate text-mute max-[760px]:hidden">{kind}</span>
        <span aria-hidden="true" className="text-right text-mute">{p.year}</span>
      </Link>
    </li>
  );
}
