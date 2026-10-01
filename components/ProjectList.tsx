"use client";

import Link from "next/link";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useState } from "react";
import type { Project } from "@/lib/projects";
import { ProjectVisual } from "./ProjectVisual";

/** Vue liste : numéro, nom, type, année, et un aperçu qui suit la souris. */
export function ProjectList({ projects }: { projects: Project[] }) {
  const [hov, setHov] = useState(-1);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 500, damping: 40 });
  const sy = useSpring(y, { stiffness: 500, damping: 40 });

  const onMove = (e: React.MouseEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    x.set(e.clientX - r.left + 24);
    y.set(e.clientY - r.top - 140);
  };

  return (
    <section aria-label="Liste des projets" onMouseMove={onMove} className="absolute inset-0 flex items-center justify-center">
      <ol className="group/list w-[min(720px,calc(100%-48px))]">
        {projects.map((p, i) => (
          <li key={p.slug}>
            <Link
              href={`/travaux/${p.slug}`}
              onMouseEnter={() => setHov(i)}
              onMouseLeave={() => setHov(-1)}
              className="grid min-h-11 grid-cols-[48px_1fr_1fr_64px] items-center border-b border-line transition-opacity duration-300 group-hover/list:opacity-30 hover:!opacity-100 focus-visible:!opacity-100 max-[760px]:grid-cols-[36px_1fr_52px]"
            >
              <span className="text-mute tabular-nums">{p.n}</span>
              <span>{p.title}</span>
              <span className="text-mute max-[760px]:hidden">{p.kind}</span>
              <span className="text-right text-mute">{p.year}</span>
            </Link>
          </li>
        ))}
      </ol>

      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 z-[4] h-[280px] w-[220px] overflow-hidden transition-opacity duration-200 [@media(hover:none)]:hidden max-[760px]:hidden"
        style={{ x: sx, y: sy, opacity: hov >= 0 ? 1 : 0 }}
      >
        {projects.map((p, i) => (
          <span key={p.slug} className="absolute inset-0" style={{ opacity: i === hov ? 1 : 0 }}>
            <ProjectVisual project={p} />
          </span>
        ))}
      </motion.div>
    </section>
  );
}
