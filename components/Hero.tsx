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
} from "motion/react";
import { heroShots } from "@/lib/projects";

const NAME = "PABLO CUERVA";
const ease = [0.2, 0.7, 0.1, 1] as const;
const volet = [0.75, 0, 0.15, 1] as const;
/** Temps d'affichage d'un projet dans la card avant de passer au suivant. */
const SWITCH_MS = 1100;
const pad = (n: number) => String(n).padStart(2, "0");

/**
 * Variante C : une seule grande card portrait au centre, derrière le nom.
 * Elle fait défiler les projets avec un volet et suit un peu la souris.
 * Un compteur en bas à droite. Au scroll, le nom s'efface en rétrécissant.
 */
export function Hero() {
  const reduce = useReducedMotion();
  const [i, setI] = useState(0);
  const shot = heroShots[i % heroShots.length];

  useEffect(() => {
    if (reduce) return;
    let interval = 0;
    const first = window.setTimeout(() => {
      setI((v) => v + 1);
      interval = window.setInterval(() => setI((v) => v + 1), SWITCH_MS);
    }, 1800);
    return () => { clearTimeout(first); clearInterval(interval); };
  }, [reduce]);

  // La card suit la souris avec un ressort doux (pas au doigt)
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const cx = useSpring(useTransform(mx, (v) => v * 40), { stiffness: 60, damping: 20 });
  const cy = useSpring(useTransform(my, (v) => v * 30), { stiffness: 60, damping: 20 });

  const { scrollY } = useScroll();
  const scale = useTransform(scrollY, [0, 300], [1, 0.5]);
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
      className="relative grid h-[min(84svh,780px)] min-h-[520px] place-items-center overflow-hidden px-4 max-[760px]:h-[min(78svh,640px)] max-[760px]:min-h-[460px]"
    >
      {/* La card, dans la même cellule que le texte, donc toujours centrée derrière le nom */}
      <motion.div className="col-start-1 row-start-1 w-[min(30vw,420px)] max-[760px]:w-[62vw]" style={{ x: cx, y: cy }}>
        <Link href={`/work/${shot.slug}`} aria-label={`${shot.title}, voir le projet`} className="group block">
          <motion.span
            className="relative block aspect-[4/5] overflow-hidden bg-line"
            initial={{ clipPath: "inset(100% 0 0 0)" }}
            animate={{ clipPath: "inset(0% 0 0 0)" }}
            transition={{ duration: 1.2, ease: [0.65, 0, 0.15, 1], delay: 0.45 }}
          >
            <AnimatePresence initial={false}>
              <motion.span
                key={i}
                className="absolute inset-0 block"
                initial={{ clipPath: "inset(100% 0 0 0)" }}
                animate={{ clipPath: "inset(0% 0 0 0)", zIndex: 1 }}
                // L'ancienne image reste dessous le temps que la nouvelle la recouvre
                exit={{ zIndex: 0, opacity: 0.99, transition: { duration: 0.65 } }}
                transition={{ duration: 0.6, ease: volet }}
              >
                <span className="absolute inset-0 block transition-transform duration-700 ease-out-soft group-hover:scale-[1.04]">
                  <Image src={shot.src} alt="" fill priority={i === 0} sizes="(max-width: 760px) 140vw, 940px" className="object-cover" />
                </span>
              </motion.span>
            </AnimatePresence>
          </motion.span>
        </Link>
      </motion.div>

      <div className="pointer-events-none relative z-[2] col-start-1 row-start-1 flex flex-col items-center gap-[max(14px,2vw)]">
        <motion.h1
          aria-label="Pablo Cuerva"
          className="m-0 origin-top whitespace-nowrap text-[11.2vw] font-bold leading-[0.9] tracking-[-0.045em] max-[760px]:text-[12.4vw]"
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

        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.9 }} className="pointer-events-auto">
          <MagneticLink href="/work">Voir le travail</MagneticLink>
        </motion.div>
      </div>

      {/* Sous la card, hors de l'image pour rester lisible : le métier à gauche, le compteur à droite */}
      <motion.p
        className="absolute bottom-5 left-6 m-0 text-[11px] font-medium uppercase leading-[18px] tracking-[0.12em] max-[760px]:left-4"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.9, ease, delay: 0.8 }}
      >
        Product designer · IA et SaaS
      </motion.p>

      {/* Compteur : le chiffre roule à chaque changement */}
      <motion.p
        aria-hidden="true"
        className="absolute bottom-5 right-6 m-0 flex gap-1 leading-[18px] text-mute tabular-nums max-[760px]:right-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        <span className="relative block h-[18px] w-[2ch] overflow-hidden">
          <AnimatePresence initial={false}>
            <motion.span
              key={i}
              className="absolute inset-0"
              initial={{ y: "100%" }}
              animate={{ y: "0%" }}
              exit={{ y: "-100%" }}
              transition={{ duration: 0.5, ease }}
            >
              {pad((i % heroShots.length) + 1)}
            </motion.span>
          </AnimatePresence>
        </span>
        <span>/ {pad(heroShots.length)}</span>
      </motion.p>
    </section>
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
