"use client";

import Link from "next/link";
import { motion, useMotionValue, useScroll, useSpring, useTransform } from "motion/react";
import { projects } from "@/lib/projects";
import { ProjectVisual } from "./ProjectVisual";

const NAME = "PABLO CUERVA";
const ease = [0.2, 0.7, 0.1, 1] as const;

/**
 * Arrivée : le nom monte lettre par lettre, deux visuels s'ouvrent puis flottent
 * et suivent la souris avec retard. Au scroll, le nom s'efface en rétrécissant.
 */
export function Hero() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const x1 = useTransform(sx, (v) => v * 22), y1 = useTransform(sy, (v) => v * 22);
  const x2 = useTransform(sx, (v) => v * -14), y2 = useTransform(sy, (v) => v * -14);

  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 300], [1, 0.5]);
  const nameY = useTransform(scrollY, [0, 300], [0, 40]);
  const nameOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  const onMove = (e: React.MouseEvent) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { mx.set(0); my.set(0); };

  const floats = [
    { p: projects[1], cls: "right-[6vw] top-[8%] w-[28vw] max-w-[420px]", x: x1, y: y1, delay: 0.5, bob: 0 },
    { p: projects[3], cls: "left-[7vw] bottom-[14%] w-[18vw] max-w-[280px]", x: x2, y: y2, delay: 0.65, bob: -3.5 },
  ];

  return (
    <section
      aria-label="Introduction"
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="relative flex h-[min(82dvh,760px)] min-h-[420px] flex-col items-center justify-center gap-[2vw] overflow-hidden"
    >
      {floats.map((f, i) => (
        <motion.div key={i} aria-hidden="true" className={`absolute aspect-[16/10] opacity-60 ${f.cls}`} style={{ x: f.x, y: f.y }}>
          <motion.div
            className="relative h-full w-full overflow-hidden"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)", y: [0, -8, 0] }}
            transition={{
              clipPath: { duration: 1.2, ease: [0.65, 0, 0.15, 1], delay: f.delay },
              y: { duration: 7, repeat: Infinity, ease: "easeInOut", delay: f.bob },
            }}
          >
            <ProjectVisual project={f.p} />
          </motion.div>
        </motion.div>
      ))}

      <motion.h1
        aria-label="Pablo Cuerva"
        className="relative z-[2] m-0 origin-top whitespace-nowrap text-[11.2vw] font-bold leading-[0.9] tracking-[-0.045em]"
        style={{ scale, y: nameY, opacity: nameOpacity }}
      >
        {NAME.split("").map((c, i) => (
          <span key={i} aria-hidden="true" className="inline-block overflow-hidden pb-[0.04em] align-bottom">
            <motion.span
              className="inline-block"
              initial={{ y: "105%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1.1, ease, delay: i * 0.04 }}
            >
              {c === " " ? " " : c}
            </motion.span>
          </span>
        ))}
      </motion.h1>

      <motion.p
        className="relative z-[2] m-0 text-[max(11px,1.1vw)] font-medium uppercase tracking-[0.12em]"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease, delay: 0.8 }}
      >
        Product designer · IA et SaaS
      </motion.p>

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.9 }} className="relative z-[2]">
        <Link href="/work" className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-fg px-5 font-medium text-bg">
          Voir le travail <span className="inline-block transition-transform duration-400 ease-out-soft group-hover:translate-x-1">→</span>
        </Link>
      </motion.div>
    </section>
  );
}
