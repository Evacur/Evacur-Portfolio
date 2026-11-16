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
  type MotionValue,
} from "motion/react";
import { projects } from "@/lib/projects";
import { ProjectVisual } from "./ProjectVisual";

const NAME = "PABLO CUERVA";
const ease = [0.2, 0.7, 0.1, 1] as const;
const volet = [0.75, 0, 0.15, 1] as const;
/** Temps d'affichage d'un projet dans une card avant de passer au suivant. */
const SWITCH_MS = 1100;

/**
 * Arrivée : le nom monte lettre par lettre, deux cards s'ouvrent puis flottent.
 * Chaque card fait défiler les projets, en décalé l'une de l'autre.
 * Au scroll, le nom s'efface en rétrécissant.
 */
export function Hero() {
  // Parallaxe douce des cards, à la souris uniquement
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 20 });
  const sy = useSpring(my, { stiffness: 50, damping: 20 });
  const x1 = useTransform(sx, (v) => v * 28), y1 = useTransform(sy, (v) => v * 28);
  const x2 = useTransform(sx, (v) => v * -18), y2 = useTransform(sy, (v) => v * -18);

  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 300], [1, 0.5]);
  const nameY = useTransform(scrollY, [0, 300], [0, 40]);
  const nameOpacity = useTransform(scrollY, [0, 300], [1, 0]);
  // Les cards s'écartent légèrement au scroll
  const lift1 = useTransform(scrollY, [0, 500], [0, -60]);
  const lift2 = useTransform(scrollY, [0, 500], [0, 40]);

  const onMove = (e: React.PointerEvent<HTMLElement>) => {
    if (e.pointerType !== "mouse") return;
    const r = e.currentTarget.getBoundingClientRect();
    mx.set((e.clientX - r.left) / r.width - 0.5);
    my.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => { mx.set(0); my.set(0); };

  return (
    <section
      aria-label="Introduction"
      onPointerMove={onMove}
      onPointerLeave={onLeave}
      className="relative flex h-[min(82dvh,760px)] min-h-[460px] flex-col max-[760px]:h-[min(76dvh,640px)] items-center justify-center gap-[max(14px,2vw)] overflow-hidden px-4"
    >
      <FloatCard
        start={1}
        offset={0}
        x={x1} y={y1} lift={lift1}
        delay={0.5}
        bob={0}
        className="right-[6vw] top-[2%] w-[22vw] max-w-[340px] max-[760px]:right-[5vw] max-[760px]:top-[9%] max-[760px]:w-[52vw]"
      />
      <FloatCard
        start={3}
        offset={SWITCH_MS / 2}
        x={x2} y={y2} lift={lift2}
        delay={0.65}
        bob={-3.5}
        className="bottom-[14%] left-[7vw] w-[18vw] max-w-[280px] max-[760px]:bottom-[9%] max-[760px]:left-[5vw] max-[760px]:w-[40vw]"
      />

      <motion.h1
        aria-label="Pablo Cuerva"
        className="pointer-events-none relative z-[2] m-0 origin-top whitespace-nowrap text-[11.2vw] font-bold leading-[0.9] tracking-[-0.045em] max-[760px]:text-[12.4vw]"
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
              {c === " " ? "\u00a0" : c}
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
        <MagneticLink href="/work">Voir le travail</MagneticLink>
      </motion.div>
    </section>
  );
}

/** Une card qui flotte et fait défiler les projets avec un volet. */
function FloatCard({
  start, offset, x, y, lift, delay, bob, className,
}: {
  start: number; offset: number;
  x: MotionValue<number>; y: MotionValue<number>; lift: MotionValue<number>;
  delay: number; bob: number; className: string;
}) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(start);
  const p = projects[i % projects.length];

  useEffect(() => {
    if (reduce) return;
    let interval = 0;
    // Premier changement après l'ouverture, puis à rythme régulier. Les deux cards avancent
    // d'un projet en décalé (départs 1 et 3) : elles ne montrent jamais le même.
    const first = window.setTimeout(() => {
      setI((v) => v + 1);
      interval = window.setInterval(() => setI((v) => v + 1), SWITCH_MS);
    }, 1700 + offset);
    return () => { clearTimeout(first); clearInterval(interval); };
  }, [reduce, offset]);

  return (
    <motion.div className={`absolute z-[1] ${className}`} style={{ x, y }}>
      <motion.div style={{ y: lift }}>
        <motion.div
          animate={reduce ? undefined : { y: [0, -8, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: bob }}
        >
          <Link
            href={`/work/${p.slug}`}
            aria-label={`${p.title}, voir le thème`}
            className="group block"
          >
            <motion.span
              className="relative block aspect-[16/10] overflow-hidden bg-line"
              initial={{ clipPath: "inset(0 0 100% 0)" }}
              animate={{ clipPath: "inset(0 0 0% 0)" }}
              transition={{ duration: 1.2, ease: [0.65, 0, 0.15, 1], delay }}
            >
              <AnimatePresence initial={false}>
                <motion.span
                  key={i}
                  className="absolute inset-0 block"
                  initial={{ clipPath: "inset(100% 0 0 0)" }}
                  animate={{ clipPath: "inset(0% 0 0 0)" }}
                  exit={{ opacity: 1 }}
                  transition={{ duration: 0.6, ease: volet }}
                >
                  <span className="absolute inset-0 block transition-transform duration-700 ease-out-soft group-hover:scale-[1.04]">
                    <ProjectVisual project={p} />
                  </span>
                </motion.span>
              </AnimatePresence>
            </motion.span>
          </Link>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

/** Bouton qui suit légèrement le curseur, le libellé roule et la flèche glisse au survol. */
function MagneticLink({ href, children }: { href: string; children: React.ReactNode }) {
  const ref = useRef<HTMLAnchorElement>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 220, damping: 18 });
  const sy = useSpring(y, { stiffness: 220, damping: 18 });

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || !ref.current) return;
    const r = ref.current.getBoundingClientRect();
    x.set((e.clientX - r.left - r.width / 2) * 0.25);
    y.set((e.clientY - r.top - r.height / 2) * 0.35);
  };
  const reset = () => { x.set(0); y.set(0); };

  return (
    <span className="-m-3 inline-block p-3" onPointerMove={onMove} onPointerLeave={reset}>
      <motion.span className="inline-block" style={{ x: sx, y: sy }}>
        <Link
          ref={ref}
          href={href}
          className="group inline-flex min-h-11 items-center gap-2 overflow-hidden rounded-full bg-fg px-5 font-medium text-bg transition-transform duration-300 ease-out-soft active:scale-[0.97]"
        >
          <span className="relative block overflow-hidden">
            <span className="block transition-transform duration-500 ease-out-soft group-hover:-translate-y-full">{children}</span>
            <span aria-hidden="true" className="absolute inset-0 block translate-y-full transition-transform duration-500 ease-out-soft group-hover:translate-y-0">{children}</span>
          </span>
          <span aria-hidden="true" className="inline-block transition-transform duration-400 ease-out-soft group-hover:translate-x-1">→</span>
        </Link>
      </motion.span>
    </span>
  );
}
