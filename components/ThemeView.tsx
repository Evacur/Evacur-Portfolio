"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Media as MediaItem, Project } from "@/lib/projects";
import { scrollToTarget } from "./SmoothScroll";

const ease = [0.2, 0.7, 0.1, 1] as const;
const inout = [0.65, 0, 0.15, 1] as const;
const seen = { once: true, margin: "0px 0px -60px 0px" } as const;

/**
 * Visuel du chapitre : image, vidéo en boucle ou aplat en attendant.
 * Il se dévoile de haut en bas avec un léger dézoom, puis glisse doucement dans son cadre pendant le scroll.
 * Une vidéo ne joue que lorsqu'elle est à l'écran.
 */
function Media({ media, ratio, tint }: { media: MediaItem; ratio: string; tint: string }) {
  const reduce = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const visible = useInView(box, { margin: "100px 0px 100px 0px" });
  const { scrollYProgress } = useScroll({ target: box, offset: ["start end", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["-2.6%", "2.6%"]);

  useEffect(() => {
    const v = video.current;
    if (!v || reduce) return;
    if (visible) v.play().catch(() => {}); else v.pause();
  }, [visible, reduce]);

  const label = typeof media === "string" ? media : media.alt;
  const shape = typeof media === "string" ? ratio : "video" in media ? media.ratio : "16 / 9";
  // Une vidéo presque carrée resterait trop haute en pleine largeur : on la limite
  const [w, h] = shape.split("/").map(Number);
  const tall = w / h < 1.3;

  return (
    <figure className={`group/media m-0 flex flex-col gap-2.5 ${tall ? "w-full max-w-[min(100%,560px)]" : ""}`}>
      <motion.div
        ref={box}
        className="relative overflow-hidden rounded-[8px] bg-line"
        style={{ aspectRatio: shape }}
        initial={{ clipPath: "inset(0 0 100% 0 round 8px)" }}
        whileInView={{ clipPath: "inset(0 0 0% 0 round 8px)" }}
        viewport={seen}
        transition={{ duration: 1.1, ease: inout }}
      >
        <motion.span
          className="absolute inset-0 block"
          initial={{ scale: 1.12 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease }}
        >
          <motion.span
            className="absolute inset-x-0 -inset-y-[3%] block transition-transform duration-[900ms] ease-out-soft group-hover/media:scale-[1.015]"
            style={typeof media === "string" ? { background: tint } : reduce ? undefined : { y }}
          >
            {typeof media !== "string" && ("video" in media ? (
              <video
                ref={video}
                src={media.video}
                poster={media.poster}
                aria-label={media.alt}
                className="absolute inset-0 h-full w-full object-cover"
                controls={!!reduce}
                muted
                loop
                playsInline
                preload="metadata"
              />
            ) : (
              <Image src={media.src} alt={media.alt} fill sizes="(max-width: 640px) 100vw, 60vw" className="object-cover" />
            ))}
          </motion.span>
        </motion.span>
      </motion.div>
      <motion.figcaption
        className="text-mute"
        initial={{ opacity: 0, y: 6 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={seen}
        transition={{ duration: 0.8, ease, delay: 0.35 }}
      >
        {label}
      </motion.figcaption>
    </figure>
  );
}

/** Un bloc de texte qui monte à l'entrée dans l'écran. */
function Rise({ children, delay = 0, className }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 14 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={seen}
      transition={{ duration: 0.9, ease, delay }}
    >
      {children}
    </motion.div>
  );
}

/** Grand lien de fin de page : le titre roule au survol, la flèche glisse, un trait se dessine au-dessus. */
function NextLink({ label, title, href, onClick }: { label: string; title: string; href?: string; onClick?: () => void }) {
  const inner = (
    <>
      <span className="text-mute">{label}</span>
      <span className="flex items-baseline gap-[0.25em] font-serif text-[max(32px,5.8vw)] font-normal leading-none tracking-[-0.025em]">
        <span className="relative block overflow-hidden pb-[0.12em]">
          <span className="block transition-transform duration-700 ease-out-soft group-hover:-translate-y-[110%]">{title}</span>
          <span aria-hidden="true" className="absolute inset-0 block translate-y-[110%] transition-transform duration-700 ease-out-soft group-hover:translate-y-0">{title}</span>
        </span>
        <span aria-hidden="true" className="inline-block transition-transform duration-700 ease-out-soft group-hover:translate-x-[0.2em]">→</span>
      </span>
    </>
  );
  const cls = "group relative flex w-full flex-col items-start gap-2 py-[5vw] text-left";
  return href
    ? <Link href={href} className={cls}>{inner}</Link>
    : <button type="button" onClick={onClick} className={cls}>{inner}</button>;
}

/**
 * Page thème : le thème en grand, les cas en onglets, puis pour le cas choisi
 * un sommaire collant et 4 chapitres (texte à gauche, ses images à droite).
 */
export function ThemeView({ project, next }: { project: Project; next: Project }) {
  const [ci, setCi] = useState(0);
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);
  const c = project.cases[ci];
  const lastCase = ci === project.cases.length - 1;

  // Le sommaire suit la lecture : le chapitre passé aux 40 % de l'écran s'allume.
  useEffect(() => {
    const on = () => {
      let a = 0;
      refs.current.forEach((el, i) => { if (el && el.getBoundingClientRect().top < window.innerHeight * 0.4) a = i; });
      setActive(a);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [ci]);

  const pickCase = (i: number) => {
    if (i === ci) return;
    setCi(i);
    const el = document.getElementById("cas");
    if (el && el.getBoundingClientRect().top < 0) scrollToTarget(el, -72);
  };

  return (
    <article className="px-6 max-[640px]:px-4">
      <header className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-x-[4vw] gap-y-[2.4vw] pb-[4vw] pt-[4vw] max-[640px]:grid-cols-1 max-[640px]:gap-y-5 max-[640px]:pb-8 max-[640px]:pt-8">
        <Link href="/work" className="group col-span-full inline-flex w-fit items-center gap-1.5 text-mute transition-colors duration-300 hover:text-fg">
          <span aria-hidden="true" className="inline-block transition-transform duration-500 ease-out-soft group-hover:-translate-x-1">←</span>
          Travaux · Thème {project.n}
        </Link>
        <h1 className="col-span-full m-0 font-serif text-[max(42px,7.2vw)] font-normal leading-[0.95] tracking-[-0.025em]">
          {project.title.split(" ").map((word, wi, all) => {
            const start = all.slice(0, wi).join(" ").length + (wi ? 1 : 0);
            return (
              <span key={wi} aria-hidden="true" className="inline-block whitespace-nowrap">
                {word.split("").map((ch, i) => (
                  <span key={i} className="inline-block overflow-hidden pb-[0.08em] align-bottom">
                    <motion.span className="inline-block" initial={{ y: "110%" }} animate={{ y: "0%" }} transition={{ duration: 1, ease, delay: (start + i) * 0.03 }}>
                      {ch}
                    </motion.span>
                  </span>
                ))}
                {wi < all.length - 1 && " "}
              </span>
            );
          })}
          <span className="sr-only">{project.title}</span>
        </h1>
        <motion.p
          className="m-0 max-w-[40ch] text-[15px] leading-[1.45]"
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.45 }}
        >
          {project.pitch}
        </motion.p>
        <motion.dl
          className="m-0 grid grid-cols-2 gap-x-4 gap-y-2.5"
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.55 }}
        >
          {[["Client", c.client], ["Année", c.year], ["Rôle", c.role], ["Durée", c.duration]].map(([k, v], n) => (
            <div key={k}>
              <dt className="text-[11px] text-mute">{k}</dt>
              {/* La valeur roule quand on change de cas */}
              <dd className="m-0 mt-0.5 overflow-hidden">
                <AnimatePresence mode="popLayout" initial={false}>
                  <motion.span
                    key={ci + v}
                    className="block"
                    initial={{ y: "100%" }} animate={{ y: "0%" }} exit={{ y: "-100%" }}
                    transition={{ duration: 0.6, ease, delay: n * 0.04 }}
                  >
                    {v}
                  </motion.span>
                </AnimatePresence>
              </dd>
            </div>
          ))}
        </motion.dl>
        <motion.div
          id="cas" role="tablist" aria-label="Cas" className="col-span-full flex flex-wrap gap-2"
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.65 }}
        >
          {project.cases.map((k, i) => (
            <button
              key={k.slug + i}
              type="button"
              role="tab"
              aria-selected={i === ci}
              onClick={() => pickCase(i)}
              className={`relative inline-flex min-h-9 items-center rounded-full border px-3.5 transition-colors duration-500 active:scale-[0.97] ${i === ci ? "border-transparent text-bg" : "border-line text-mute hover:border-fg hover:text-fg"}`}
            >
              {/* La pastille noire glisse d'un cas à l'autre */}
              {i === ci && <motion.span layoutId="case-pill" className="absolute -inset-px rounded-full bg-fg" transition={{ duration: 0.6, ease: inout }} />}
              <span className="relative">Cas {i + 1} · {k.name}</span>
            </button>
          ))}
        </motion.div>
      </header>

      <nav aria-label="Chapitres" className="sticky top-14 z-10 flex gap-x-6 overflow-x-auto border-y border-line bg-bg [scrollbar-width:none] max-[640px]:-mx-4 max-[640px]:gap-x-5 max-[640px]:px-4">
        {c.chapters.map((ch, i) => (
          <a
            key={ch.title}
            href={`#ch-${i}`}
            aria-current={i === active ? "true" : undefined}
            className={`relative flex-none py-3 transition-colors duration-300 hover:text-fg ${i === active ? "text-fg" : "text-mute"}`}
            onClick={(e) => { e.preventDefault(); const el = refs.current[i]; if (el) scrollToTarget(el, -100); }}
          >
            <span className="tabular-nums">{String(i + 1).padStart(2, "0")}</span> {ch.title}
            {/* Le trait suit le chapitre en cours de lecture */}
            {i === active && <motion.span layoutId="chapter-line" className="absolute inset-x-0 -bottom-px h-px bg-fg" transition={{ duration: 0.6, ease: inout }} />}
          </a>
        ))}
      </nav>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={ci}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.7, ease } }}
          exit={{ opacity: 0, y: -12, transition: { duration: 0.25, ease: "easeIn" } }}
        >
          {c.chapters.map((ch, i) => (
            <section
              key={ch.title}
              id={`ch-${i}`}
              ref={(el) => { refs.current[i] = el; }}
              className="relative grid scroll-mt-28 grid-cols-[minmax(0,.8fr)_minmax(0,1.4fr)] gap-[4vw] py-[5vw] max-[640px]:grid-cols-1 max-[640px]:gap-6 max-[640px]:py-10"
            >
              <div className="sticky top-32 flex flex-col gap-2.5 self-start max-[640px]:static">
                <Rise><span className="text-[11px] text-mute tabular-nums">{String(i + 1).padStart(2, "0")}</span></Rise>
                {/* Le titre monte derrière un masque ; c'est le h2, jamais masqué, qui détecte l'entrée à l'écran */}
                <motion.h2
                  className="m-0 overflow-hidden pb-[0.1em] font-serif text-[max(28px,3.2vw)] font-normal leading-[1.05] tracking-[-0.015em]"
                  initial="hide" whileInView="show" viewport={seen}
                >
                  <motion.span className="block" variants={{ hide: { y: "110%" }, show: { y: "0%" } }} transition={{ duration: 1, ease, delay: 0.05 }}>
                    {ch.title}
                  </motion.span>
                </motion.h2>
                <Rise delay={0.15}><p className="m-0">{ch.lede}</p></Rise>
                {ch.body.map((b, j) => <Rise key={j} delay={0.22 + j * 0.07}><p className="m-0 text-mute">{b}</p></Rise>)}
              </div>
              {/* Deux légendes sans image : côte à côte. Dès qu'il y a de vraies images, elles passent en pleine largeur. */}
              <div className={`grid gap-[max(16px,2vw)] ${ch.media.length === 2 && ch.media.every((m) => typeof m === "string") ? "grid-cols-2 max-[640px]:grid-cols-1" : ""}`}>
                {ch.media.map((m, j) => (
                  <Media key={typeof m === "string" ? m : m.alt} media={m} ratio={ch.media.length === 2 ? "4 / 5" : "16 / 10"} tint={j % 2 ? project.tint : "color-mix(in srgb, var(--fg) 7%, var(--bg))"} />
                ))}
              </div>
              {/* Le filet de fin de chapitre se dessine de gauche à droite */}
              <motion.span
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-px origin-left bg-line"
                initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: inout }}
              />
            </section>
          ))}
        </motion.div>
      </AnimatePresence>

      {lastCase
        ? <NextLink label="Thème suivant" title={next.title} href={`/work/${next.slug}`} />
        : <NextLink label="Cas suivant" title={project.cases[ci + 1].name} onClick={() => { setCi(ci + 1); scrollToTarget(0); }} />}
    </article>
  );
}
