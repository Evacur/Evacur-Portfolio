"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Media as MediaItem, Project } from "@/lib/projects";
import { scrollToTarget } from "./SmoothScroll";

const ease = [0.2, 0.7, 0.1, 1] as const;
const inout = [0.65, 0, 0.15, 1] as const;
const seen = { once: true, margin: "0px 0px -60px 0px" } as const;

/**
 * Le visuel du chapitre en cours, dans un cadre qui reste en place : image, vidéo en boucle ou aplat en attendant.
 * Le nouveau visuel monte en volet par-dessus l'ancien.
 */
function Pinned({ media, id, tint }: { media: MediaItem; id: string; tint: string }) {
  const reduce = useReducedMotion();
  const shape = typeof media !== "string" && "video" in media ? media.ratio : "16 / 10";
  const [w, h] = shape.split("/").map(Number);
  // Un visuel presque carré est montré en entier plutôt que rogné
  const fit = w / h < 1.3 ? "object-contain" : "object-cover";
  return (
    <div className="relative aspect-[16/10] overflow-hidden rounded-[8px] bg-line">
      <AnimatePresence initial={false}>
        <motion.div
          key={id}
          className="absolute inset-0"
          style={typeof media === "string" ? { background: tint } : undefined}
          initial={{ clipPath: "inset(100% 0 0 0)" }}
          animate={{ clipPath: "inset(0% 0 0 0)", zIndex: 1 }}
          exit={{ zIndex: 0, opacity: 0.99, transition: { duration: 0.85 } }}
          transition={{ duration: 0.8, ease: [0.75, 0, 0.15, 1] }}
        >
          <motion.div className="absolute inset-0" initial={{ scale: 1.1 }} animate={{ scale: 1 }} transition={{ duration: 1.4, ease }}>
            {typeof media !== "string" && ("video" in media ? (
              <video
                src={media.video}
                poster={media.poster}
                aria-label={media.alt}
                className={`absolute inset-0 h-full w-full ${fit}`}
                autoPlay={!reduce}
                controls={!!reduce}
                muted
                loop
                playsInline
                preload="metadata"
              />
            ) : (
              <Image src={media.src} alt={media.alt} fill priority sizes="(max-width: 640px) 100vw, 60vw" className={fit} />
            ))}
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
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
      <span className="flex items-baseline gap-[0.25em] text-[max(28px,5vw)] font-semibold leading-none tracking-[-0.04em]">
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
 * un sommaire collant et 4 chapitres. Le texte défile à gauche, l'image reste en place à droite
 * et change quand on passe d'un chapitre (ou d'un visuel) à l'autre.
 */
export function ThemeView({ project, next }: { project: Project; next: Project }) {
  const [ci, setCi] = useState(0);
  const [active, setActive] = useState(0);
  const [shot, setShot] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);
  const c = project.cases[ci];
  const lastCase = ci === project.cases.length - 1;

  // Le chapitre qui passe le milieu de l'écran s'allume. S'il a plusieurs visuels,
  // sa hauteur est découpée en autant de paliers : le visuel change à chaque palier.
  useEffect(() => {
    const on = () => {
      const mid = window.innerHeight * (window.innerWidth <= 640 ? 0.66 : 0.5);
      let a = 0, m = 0;
      refs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        if (r.top < mid) {
          a = i;
          const n = Math.max(1, c.chapters[i]?.media.length ?? 1);
          m = Math.min(n - 1, Math.max(0, Math.floor(((mid - r.top) / r.height) * n)));
        }
      });
      setActive(a);
      setShot(m);
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    window.addEventListener("resize", on);
    return () => { window.removeEventListener("scroll", on); window.removeEventListener("resize", on); };
  }, [ci, c]);

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
            onClick={(e) => { e.preventDefault(); const el = refs.current[i]; if (el) scrollToTarget(el, -Math.round(window.innerHeight * 0.3)); }}
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
          <div className="grid grid-cols-[minmax(0,.9fr)_minmax(0,1.3fr)] gap-x-[4vw] border-b border-line max-[640px]:grid-cols-1">
            <div>
              {c.chapters.map((ch, i) => (
                <section
                  key={ch.title}
                  id={`ch-${i}`}
                  ref={(el) => { refs.current[i] = el; }}
                  style={{ "--n": Math.max(1, ch.media.length) } as React.CSSProperties}
                  className={`min-h-[calc(var(--n)*62svh+16svh)] transition-opacity duration-700 max-[640px]:min-h-[calc(var(--n)*46svh+10svh)] ${i === active ? "" : "opacity-30"}`}
                >
                  {/* Le texte reste en place tant que son chapitre défile */}
                  <div className="sticky top-[max(150px,calc(50svh-90px))] flex flex-col gap-2.5 py-8 max-[640px]:top-[calc(62.5vw+176px)] max-[640px]:py-5">
                    <Rise><span className="font-mono text-[11px] uppercase tracking-[0.06em] text-mute tabular-nums">{String(i + 1).padStart(2, "0")}</span></Rise>
                    {/* Le titre monte derrière un masque ; c'est le h2, jamais masqué, qui détecte l'entrée à l'écran */}
                    <motion.h2
                      className="m-0 overflow-hidden pb-[0.1em] font-serif text-[max(30px,3.8vw)] font-normal leading-[1.02] tracking-[-0.015em]"
                      initial="hide" whileInView="show" viewport={seen}
                    >
                      <motion.span className="block" variants={{ hide: { y: "110%" }, show: { y: "0%" } }} transition={{ duration: 1, ease, delay: 0.05 }}>
                        {ch.title}
                      </motion.span>
                    </motion.h2>
                    <Rise delay={0.15}><p className="m-0 max-w-[44ch]">{ch.lede}</p></Rise>
                    {ch.body.map((b, j) => <Rise key={j} delay={0.22 + j * 0.07}><p className="m-0 max-w-[44ch] text-mute">{b}</p></Rise>)}
                  </div>
                </section>
              ))}
            </div>

            {/* L'image reste en place et change avec le chapitre en cours */}
            {(() => {
              const list = c.chapters[active]?.media ?? [];
              const m = list[Math.min(shot, list.length - 1)] ?? "";
              const label = typeof m === "string" ? m : m.alt;
              return (
                <div className="sticky top-[max(120px,calc(50svh-17vw+20px))] flex flex-col gap-2.5 self-start pb-10 max-[640px]:top-[104px] max-[640px]:z-[5] max-[640px]:order-first max-[640px]:-mx-4 max-[640px]:bg-bg max-[640px]:px-4 max-[640px]:pb-3 max-[640px]:pt-4">
                  <Pinned media={m} id={`${ci}-${active}-${shot}`} tint={(active + shot) % 2 ? project.tint : "color-mix(in srgb, var(--fg) 7%, var(--bg))"} />
                  <div className="flex items-start justify-between gap-4 text-mute">
                    <span className="min-h-[2lh] max-[640px]:line-clamp-2">{label}</span>
                    <span className="flex-none font-mono text-[11px] uppercase tracking-[0.06em] tabular-nums">
                      {String(active + 1).padStart(2, "0")} / {String(c.chapters.length).padStart(2, "0")}
                      {list.length > 1 && <span className="ml-2 text-fg">{shot + 1}/{list.length}</span>}
                    </span>
                  </div>
                </div>
              );
            })()}
          </div>
        </motion.div>
      </AnimatePresence>

      {lastCase
        ? <NextLink label="Thème suivant" title={next.title} href={`/work/${next.slug}`} />
        : <NextLink label="Cas suivant" title={project.cases[ci + 1].name} onClick={() => { setCi(ci + 1); scrollToTarget(0); }} />}
    </article>
  );
}
