"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useRef } from "react";
import type { Project } from "@/lib/projects";
import { ProjectVisual } from "./ProjectVisual";

const STRIPS = 6;
const SHOW = "inset(0% 0% 0% 0%)";
const HIDE = "inset(100% 0% 0% 0%)";

type Props = {
  projects: Project[];
  idx: number;
  prev: number;
  ready: boolean;
  go: (i: number) => void;
};

export function Gallery({ projects, idx, prev, ready, go }: Props) {
  const lastWheel = useRef(0);
  const touchX = useRef<number | null>(null);
  const cur = projects[idx];

  const onWheel = (e: React.WheelEvent) => {
    const now = Date.now();
    if (now - lastWheel.current < 900) return;
    const d = Math.abs(e.deltaX) > Math.abs(e.deltaY) ? e.deltaX : e.deltaY;
    if (Math.abs(d) < 8) return;
    lastWheel.current = now;
    go(idx + (d > 0 ? 1 : -1));
  };

  const onTouchStart = (e: React.TouchEvent) => { touchX.current = e.touches[0].clientX; };
  const onTouchEnd = (e: React.TouchEvent) => {
    if (touchX.current === null) return;
    const dx = e.changedTouches[0].clientX - touchX.current;
    touchX.current = null;
    if (Math.abs(dx) > 40) go(idx + (dx < 0 ? 1 : -1));
  };

  return (
    <section
      aria-label="Projets"
      onWheel={onWheel}
      className="absolute inset-0 flex flex-col items-center justify-center gap-5 pb-4"
    >
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={ready ? { opacity: 1, y: 0 } : undefined}
        transition={{ duration: 1.2, ease: [0.2, 0.7, 0.1, 1], delay: 0.2 }}
        className="frame relative overflow-hidden touch-pan-y"
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}
      >
        {projects.map((p, i) => {
          const on = i === idx;
          const isPrev = i === prev && !on;
          const visible = on || isPrev;
          return (
            <Link
              key={p.slug}
              href={`/travaux/${p.slug}`}
              aria-label={`Ouvrir le projet ${p.title}`}
              aria-hidden={!on}
              tabIndex={on ? 0 : -1}
              draggable={false}
              className="group absolute inset-0 block overflow-hidden transition-transform duration-[1100ms] ease-[cubic-bezier(.7,0,.15,1)]"
              style={{
                zIndex: on ? 3 : isPrev ? 2 : 1,
                transform: isPrev ? "translateY(-2%)" : "none",
                pointerEvents: on ? "auto" : "none",
              }}
            >
              {Array.from({ length: STRIPS }, (_, j) => (
                <span
                  key={j}
                  className="strip"
                  style={{
                    left: `${(j * 100) / STRIPS}%`,
                    // léger recouvrement pour éviter les fils clairs entre bandes
                    width: `calc(${100 / STRIPS}% + 0.5px)`,
                    clipPath: visible ? SHOW : HIDE,
                    transitionDelay: on ? `${j * 70}ms` : "0ms",
                  }}
                >
                  <span
                    className="strip-pic transition-transform duration-[1400ms] ease-out-soft group-hover:scale-[1.03]"
                    style={{ left: `${-j * 100}%` }}
                  >
                    <ProjectVisual project={p} priority={i === 0} />
                  </span>
                </span>
              ))}
            </Link>
          );
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={ready ? { opacity: 1 } : undefined}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="flex items-center gap-7 whitespace-nowrap max-[480px]:flex-col max-[480px]:gap-0"
      >
        <div role="group" aria-label="Choisir un projet" className="flex gap-0.5">
          {projects.map((p, i) => (
            <button
              key={p.slug}
              type="button"
              aria-pressed={i === idx}
              aria-label={`Projet ${p.n} : ${p.title}`}
              onClick={() => go(i)}
              className={`min-h-11 min-w-[30px] tabular-nums transition-colors duration-300 hover:text-fg ${i === idx ? "text-fg" : "text-mute"}`}
            >
              {p.n}
            </button>
          ))}
        </div>

        <span className="inline-flex h-[18px] min-w-[140px] flex-col overflow-hidden" aria-live="polite">
          <span className="sr-only">{cur.title}</span>
          {projects.map((p) => (
            <span
              key={p.slug}
              aria-hidden="true"
              className="block leading-[18px] transition-transform duration-[900ms] ease-inout"
              style={{ transform: `translateY(${-idx * 100}%)` }}
            >
              {p.title}
            </span>
          ))}
        </span>

        <Link href={`/travaux/${cur.slug}`} className="u inline-flex min-h-11 items-center">
          (voir le projet)
        </Link>
      </motion.div>
    </section>
  );
}
