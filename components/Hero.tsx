"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { projects, type Project } from "@/lib/projects";
import { ProjectVisual } from "./ProjectVisual";

const NAME = "PABLO CUERVA";
const ease = [0.2, 0.7, 0.1, 1] as const;

// Graisse des lettres : pleine au repos, fine sous le curseur (Geist est une fonte variable).
const W_REST = 720;
const W_NEAR = 220;
const RADIUS = 260; // px autour du curseur
// Traînée d'images : une nouvelle tous les SPACING px parcourus, chacune vit LIFE ms.
const SPACING = 140;
const LIFE = 900;
const MAX_TRAIL = 5;

type Drop = { id: number; x: number; y: number; p: Project; r: number };

/**
 * Arrivée : le nom monte lettre par lettre puis une vague le traverse.
 * Au survol, les lettres s'affinent autour du curseur et les projets
 * apparaissent en traînée derrière le nom, qui s'inverse dessus.
 * Au scroll, le nom s'efface en rétrécissant.
 */
export function Hero() {
  const reduce = useReducedMotion();
  const sectionRef = useRef<HTMLElement>(null);
  const letters = useRef<(HTMLSpanElement | null)[]>([]);
  const pointer = useRef<{ x: number; y: number } | null>(null);
  const weights = useRef<number[]>(NAME.split("").map(() => W_REST));
  const raf = useRef(0);

  const [trail, setTrail] = useState<Drop[]>([]);
  const [hovering, setHovering] = useState(false);
  const hoveringRef = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const counter = useRef(0);
  const timers = useRef<number[]>([]);

  // Parallaxe douce des deux visuels de fond
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 20 });
  const sy = useSpring(my, { stiffness: 60, damping: 20 });
  const x1 = useTransform(sx, (v) => v * 40), y1 = useTransform(sy, (v) => v * 40);
  const x2 = useTransform(sx, (v) => v * -26), y2 = useTransform(sy, (v) => v * -26);

  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 300], [1, 0.5]);
  const nameY = useTransform(scrollY, [0, 300], [0, 40]);
  const nameOpacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Boucle d'animation : chaque lettre glisse vers la graisse visée.
  const tick = () => {
    let moving = false;
    const p = pointer.current;
    letters.current.forEach((el, i) => {
      if (!el) return;
      let target = W_REST;
      if (p) {
        const r = el.getBoundingClientRect();
        const d = Math.hypot(r.left + r.width / 2 - p.x, r.top + r.height / 2 - p.y);
        const t = Math.max(0, 1 - d / RADIUS);
        target = W_REST + (W_NEAR - W_REST) * t * t * (3 - 2 * t);
      }
      const w = weights.current[i] + (target - weights.current[i]) * 0.14;
      weights.current[i] = w;
      el.style.fontWeight = String(Math.round(w));
      if (Math.abs(target - w) > 0.5) moving = true;
    });
    raf.current = moving || pointer.current ? requestAnimationFrame(tick) : 0;
  };
  const wake = () => { if (!raf.current) raf.current = requestAnimationFrame(tick); };

  // Une vague traverse le nom après l'arrivée, pour montrer qu'il réagit (aussi sur mobile).
  useEffect(() => {
    if (reduce) return;
    let start = 0, id = 0;
    const sweep = (now: number) => {
      if (!start) start = now;
      const k = Math.min(1, (now - start) / 1500);
      const first = letters.current[0]?.getBoundingClientRect();
      const lastL = letters.current[NAME.length - 1]?.getBoundingClientRect();
      if (first && lastL && !hoveringRef.current) {
        const from = first.left - RADIUS, to = lastL.right + RADIUS;
        pointer.current = { x: from + (to - from) * k, y: first.top + first.height / 2 };
        wake();
      }
      if (k < 1) id = requestAnimationFrame(sweep);
      else if (!hoveringRef.current) pointer.current = null;
    };
    const t = window.setTimeout(() => { id = requestAnimationFrame(sweep); }, 1500);
    return () => { clearTimeout(t); cancelAnimationFrame(id); };
  }, [reduce]);

  useEffect(() => () => {
    cancelAnimationFrame(raf.current);
    timers.current.forEach(clearTimeout);
  }, []);

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
    if (reduce || e.pointerType !== "mouse") return;

    hoveringRef.current = true;
    if (!hovering) setHovering(true);
    pointer.current = { x: e.clientX, y: e.clientY };
    wake();

    // Traînée : on pose un projet dès que la souris a assez avancé
    const x = e.clientX - r.left, y = e.clientY - r.top;
    if (last.current && Math.hypot(x - last.current.x, y - last.current.y) < SPACING) return;
    last.current = { x, y };
    const id = counter.current++;
    const drop: Drop = { id, x, y, p: projects[id % projects.length], r: (Math.random() - 0.5) * 8 };
    setTrail((t) => [...t.slice(-(MAX_TRAIL - 1)), drop]);
    timers.current.push(window.setTimeout(() => setTrail((t) => t.filter((d) => d.id !== id)), LIFE));
  };

  const onLeave = () => {
    mx.set(0); my.set(0);
    pointer.current = null;
    hoveringRef.current = false;
    last.current = null;
    setHovering(false);
    wake();
  };

  const floats = [
    { p: projects[1], cls: "right-[6vw] top-[8%] w-[28vw] max-w-[420px]", x: x1, y: y1, delay: 0.5, bob: 0 },
    { p: projects[3], cls: "left-[7vw] bottom-[14%] w-[18vw] max-w-[280px]", x: x2, y: y2, delay: 0.65, bob: -3.5 },
  ];

  return (
    <section
      ref={sectionRef}
      aria-label="Introduction"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="relative flex h-[min(82dvh,760px)] min-h-[420px] flex-col items-center justify-center gap-[2vw] overflow-hidden"
    >
      {/* Visuels de fond : ils s'estompent quand la traînée prend le relais */}
      {floats.map((f, i) => (
        <motion.div
          key={i}
          aria-hidden="true"
          className={`absolute aspect-[16/10] ${f.cls}`}
          style={{ x: f.x, y: f.y }}
          animate={{ opacity: hovering ? 0.18 : 0.6 }}
          transition={{ duration: 0.6 }}
        >
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

      {/* Traînée de projets sous le curseur */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1]">
        <AnimatePresence>
          {trail.map((d) => (
            <motion.div
              key={d.id}
              className="absolute w-[min(15vw,220px)] -translate-x-1/2 -translate-y-1/2"
              style={{ left: d.x, top: d.y, rotate: d.r }}
              initial={{ opacity: 0, scale: 0.6, clipPath: "inset(50% 50% 50% 50%)" }}
              animate={{ opacity: 1, scale: 1, clipPath: "inset(0% 0% 0% 0%)" }}
              exit={{ opacity: 0, scale: 0.92, y: 16 }}
              transition={{ duration: 0.55, ease }}
            >
              <span className="relative block aspect-[18/23] overflow-hidden">
                <ProjectVisual project={d.p} />
              </span>
              <span className="mt-1.5 flex gap-2 text-[11px] leading-none text-mute">
                <span className="tabular-nums">{d.p.n}</span>
                {d.p.title}
              </span>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* Blanc + différence : noir sur fond clair, clair sur fond sombre, inversé sur les images */}
      <motion.h1
        aria-label="Pablo Cuerva"
        className="pointer-events-none relative z-[2] m-0 origin-top whitespace-nowrap text-[11.2vw] font-bold leading-[0.9] tracking-[-0.045em] text-white mix-blend-difference"
        style={{ scale, y: nameY, opacity: nameOpacity }}
      >
        {NAME.split("").map((c, i) => (
          <span key={i} aria-hidden="true" className="inline-block overflow-hidden pb-[0.04em] align-bottom">
            <motion.span
              ref={(el) => { letters.current[i] = el; }}
              className="inline-block"
              style={{ fontWeight: W_REST }}
              initial={{ y: "105%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1.1, ease, delay: i * 0.04 }}
            >
              {c === " " ? " " : c}
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
