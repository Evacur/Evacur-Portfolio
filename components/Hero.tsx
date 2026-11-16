"use client";

import Image from "next/image";
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
import { heroShots } from "@/lib/projects";

const NAME = "PABLO CUERVA";
const SUB = "Product designer · IA & SaaS · Paris";
const ease = [0.2, 0.7, 0.1, 1] as const;
const volet = [0.75, 0, 0.15, 1] as const;

// Chaque card a sa propre série d'images et son propre rythme, pour qu'elles ne changent jamais ensemble
const setA = heroShots.filter((_, k) => k % 2 === 0);
const setB = heroShots.filter((_, k) => k % 2 === 1);

/**
 * Comme la couverture du portfolio : le nom en très large d'un bord à l'autre,
 * deux cards arrondies et atténuées derrière (grande en haut à droite, petite en bas à gauche),
 * le métier en mono dessous. Au scroll, le nom s'efface en rétrécissant.
 */
export function Hero() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 20 });
  const sy = useSpring(my, { stiffness: 50, damping: 20 });
  const x1 = useTransform(sx, (v) => v * 26), y1 = useTransform(sy, (v) => v * 22);
  const x2 = useTransform(sx, (v) => v * -18), y2 = useTransform(sy, (v) => v * -16);

  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 300], [1, 0.6]);
  const nameY = useTransform(scrollY, [0, 300], [0, 40]);
  const nameOpacity = useTransform(scrollY, [0, 300], [1, 0]);

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
      className="relative flex h-[min(86svh,820px)] min-h-[520px] flex-col items-center justify-center gap-[max(18px,2.4vw)] overflow-hidden max-[760px]:h-[min(78svh,640px)] max-[760px]:min-h-[460px]"
    >
      <FloatCard
        shots={setA}
        x={x1} y={y1}
        delay={0.45}
        className="right-[5vw] top-[16%] w-[30vw] max-w-[600px] max-[760px]:right-4 max-[760px]:top-[14%] max-[760px]:w-[58vw]"
      />
      <FloatCard
        shots={setB}
        x={x2} y={y2}
        delay={0.6}
        className="left-[6vw] top-[50%] w-[17vw] max-w-[340px] max-[760px]:left-4 max-[760px]:top-[64%] max-[760px]:w-[40vw]"
      />

      <motion.h1
        aria-label="Pablo Cuerva"
        className="pointer-events-none relative z-[2] m-0 origin-top whitespace-nowrap font-display text-[9.6vw] font-extrabold leading-[0.86] tracking-[-0.03em] [font-stretch:125%]"
        style={{ scale, y: nameY, opacity: nameOpacity }}
      >
        {NAME.split("").map((c, k) => (
          <span key={k} aria-hidden="true" className="inline-block overflow-hidden pb-[0.04em] align-bottom">
            <motion.span
              className="inline-block"
              initial={{ y: "105%" }}
              animate={{ y: "0%" }}
              transition={{ duration: 1.1, ease, delay: k * 0.04 }}
            >
              {c === " " ? "\u00a0" : c}
            </motion.span>
          </span>
        ))}
      </motion.h1>

      <Scramble text={SUB} />

      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 1.1 }} className="relative z-[2]">
        <MagneticLink href="/work">Voir le travail</MagneticLink>
      </motion.div>
    </section>
  );
}

/** Le métier en mono : les lettres se déchiffrent à l'arrivée, et de nouveau au survol. */
function Scramble({ text }: { text: string }) {
  const reduce = useReducedMotion();
  const [out, setOut] = useState(text);
  const raf = useRef(0);

  const run = () => {
    if (reduce) return;
    cancelAnimationFrame(raf.current);
    const glyphs = "ABCDEFGHIJKLMNOPQRSTUVWXYZ/·&";
    const start = performance.now();
    const step = (now: number) => {
      const t = (now - start) / 900;
      setOut(text.split("").map((ch, k) => (ch === " " || k / text.length < t ? ch : glyphs[(Math.random() * glyphs.length) | 0])).join(""));
      if (t < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  };

  useEffect(() => {
    const t = window.setTimeout(run, 700);
    return () => { clearTimeout(t); cancelAnimationFrame(raf.current); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <motion.p
      aria-label={text}
      onPointerEnter={run}
      className="relative z-[2] m-0 font-mono text-[max(12px,1.15vw)] font-medium uppercase tracking-[0.08em] max-[760px]:text-[11px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.7 }}
    >
      <span aria-hidden="true">{out}</span>
    </motion.p>
  );
}

/** Une card arrondie et atténuée, qui change d'image à un rythme irrégulier, rien qu'à elle. */
function FloatCard({
  shots, x, y, delay, className,
}: {
  shots: typeof heroShots; x: MotionValue<number>; y: MotionValue<number>; delay: number; className: string;
}) {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const p = shots[i % shots.length];

  useEffect(() => {
    if (reduce) return;
    let t = 0;
    // Entre 0,6 et 1,3 s à chaque fois, tiré au hasard : les deux cards ne se synchronisent jamais
    const next = () => { t = window.setTimeout(() => { setI((v) => v + 1); next(); }, 600 + Math.random() * 700); };
    const first = window.setTimeout(next, 1500 + Math.random() * 500);
    return () => { clearTimeout(first); clearTimeout(t); };
  }, [reduce]);

  return (
    <motion.div className={`absolute z-[1] ${className}`} style={{ x, y }}>
      <Link href={`/work/${p.slug}`} aria-label={`${p.title}, voir le projet`} className="group block">
        <motion.span
          className="relative block aspect-[16/10] overflow-hidden rounded-[min(1.2vw,16px)] bg-line opacity-60 transition-opacity duration-500 group-hover:opacity-100 max-[760px]:rounded-[10px]"
          initial={{ clipPath: "inset(100% 0 0 0 round 16px)" }}
          animate={{ clipPath: "inset(0% 0 0 0 round 16px)" }}
          transition={{ duration: 1.2, ease: [0.65, 0, 0.15, 1], delay }}
        >
          <AnimatePresence initial={false}>
            <motion.span
              key={i}
              className="absolute inset-0 block"
              initial={{ clipPath: "inset(100% 0 0 0)" }}
              animate={{ clipPath: "inset(0% 0 0 0)", zIndex: 1 }}
              exit={{ zIndex: 0, opacity: 0.99, transition: { duration: 0.55 } }}
              transition={{ duration: 0.5, ease: volet }}
            >
              <Image src={p.src} alt="" fill priority={i === 0} sizes="(max-width: 760px) 60vw, 600px" className="object-cover" />
            </motion.span>
          </AnimatePresence>
        </motion.span>
      </Link>
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
