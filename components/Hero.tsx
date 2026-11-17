"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
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
import { useScramble } from "./useScramble";

const NAME = "Pablo Cuerva";
const SUB = "Product designer · IA & SaaS · Paris";
const ease = [0.2, 0.7, 0.1, 1] as const;
const volet = [0.75, 0, 0.15, 1] as const;

// Quatre cards, chacune avec sa série d'images et son rythme, pour qu'elles ne changent jamais ensemble.
// Une cinquième image ne sert qu'à l'empilement de départ.
const sets = [0, 1, 2, 3].map((n) => heroShots.filter((_, k) => k % 4 === n));
const parallax = [[26, 22], [-18, -16], [14, -12], [-22, 18]] as const;
const WORDS = NAME.split(" ");

/**
 * Les projets s'empilent au centre comme des tirages qu'on pose, puis s'écartent aux quatre coins
 * et le nom monte au milieu, d'un bord à l'autre. Au scroll, le nom s'efface en rétrécissant.
 */
export function Hero() {
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 50, damping: 20 });
  const sy = useSpring(my, { stiffness: 50, damping: 20 });
  // Passe à vrai quand la pile s'écarte : les cards s'atténuent et la cinquième disparaît
  const [settled, setSettled] = useState(false);
  useEffect(() => {
    const t = window.setTimeout(() => setSettled(true), 1200);
    return () => clearTimeout(t);
  }, []);

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
      className="hero relative flex h-[min(74svh,760px)] min-h-[480px] flex-col items-center justify-center gap-[max(10px,1.2vw)] overflow-hidden max-[760px]:h-[min(70svh,600px)] max-[760px]:min-h-[440px]"
    >
      {sets.map((shots, n) => (
        <StackCard key={n} n={n} shots={shots} sx={sx} sy={sy} settled={settled} />
      ))}
      <span aria-hidden="true" className={`hc hc-5 ${settled ? "opacity-0" : ""}`} style={{ "--i": 4 } as React.CSSProperties}>
        <Image src={heroShots[4].src} alt="" fill sizes="(max-width: 760px) 46vw, 520px" className="object-cover" />
      </span>

      <motion.h1
        aria-label="Pablo Cuerva"
        className="pointer-events-none relative z-[2] m-0 origin-top whitespace-nowrap text-center font-serif text-[14vw] font-normal leading-[0.9] tracking-[-0.035em] max-[760px]:text-[21vw]"
        style={{ scale, y: nameY, opacity: nameOpacity }}
      >
        {WORDS.map((w, wi) => {
          const start = WORDS.slice(0, wi).join(" ").length + (wi ? 1 : 0);
          return (
            <span key={wi} aria-hidden="true" className={`-mx-[0.05em] inline-block overflow-hidden px-[0.05em] pb-[0.08em] align-bottom ${wi ? "ml-[0.16em]" : ""}`}>
              {w.split("").map((c, k) => (
                <motion.span
                  key={k}
                  className="inline-block"
                  initial={{ y: "110%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 1.1, ease, delay: 1.45 + (start + k) * 0.04 }}
                >
                  {c}
                </motion.span>
              ))}
            </span>
          );
        })}
      </motion.h1>

      <Scramble text={SUB} />

    </section>
  );
}

/** Le métier en mono : les lettres se déchiffrent à l'arrivée, et de nouveau au survol. */
function Scramble({ text }: { text: string }) {
  const [out, run] = useScramble(text, 900, false);

  useEffect(() => {
    const t = window.setTimeout(run, 2100);
    return () => clearTimeout(t);
  }, [run]);

  return (
    <motion.p
      aria-label={text}
      onPointerEnter={run}
      className="relative z-[2] m-0 text-[max(14px,1.25vw)] text-mute max-[760px]:text-[14px]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4, delay: 2.1 }}
    >
      <span aria-hidden="true">{out}</span>
    </motion.p>
  );
}

/** Une card de la pile : elle se pose au centre, file à sa place, puis change d'image à son rythme. */
function StackCard({
  n, shots, sx, sy, settled,
}: {
  n: number; shots: typeof heroShots; sx: MotionValue<number>; sy: MotionValue<number>; settled: boolean;
}) {
  const reduce = useReducedMotion();
  const x = useTransform(sx, (v) => v * parallax[n][0]);
  const y = useTransform(sy, (v) => v * parallax[n][1]);
  const [i, setI] = useState(0);
  const p = shots[i % shots.length];

  useEffect(() => {
    if (reduce) return;
    let t = 0;
    // Entre 0,6 et 1,3 s à chaque fois, tiré au hasard : les cards ne se synchronisent jamais
    const next = () => { t = window.setTimeout(() => { setI((v) => v + 1); next(); }, 600 + Math.random() * 700); };
    const first = window.setTimeout(next, 2800 + Math.random() * 600);
    return () => { clearTimeout(first); clearTimeout(t); };
  }, [reduce]);

  return (
    <motion.div className="pointer-events-none absolute inset-0 z-[1]" style={{ x, y }}>
      {/* Flottement lent et continu, propre à chaque card (sur grand écran seulement) */}
      <span className={`hc-float hc-float-${n + 1} absolute inset-0 block`}>
      <Link
        href={`/work/${p.slug}`}
        aria-label={`${p.title}, voir le projet`}
        data-cur="ouvrir"
        className={`hc hc-${n + 1} pointer-events-auto`}
        style={{ "--i": n } as React.CSSProperties}
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
            <Image src={p.src} alt="" fill priority={i === 0} sizes="(max-width: 760px) 46vw, 520px" className="object-cover" />
          </motion.span>
        </AnimatePresence>
      </Link>
      </span>
    </motion.div>
  );
}
