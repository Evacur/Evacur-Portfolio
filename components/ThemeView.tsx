"use client";

import Link from "next/link";
import Image from "next/image";
import { AnimatePresence, motion, useInView, useReducedMotion, useScroll, useTransform } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Chapter, Media as MediaItem, Project } from "@/lib/projects";
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
  const shape = typeof media === "string" ? ratio : media.ratio ?? "16 / 9";
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

/** Lien de fin de page, précédent ou suivant : le titre roule au survol, la flèche glisse. */
function EndLink({ label, title, href, onClick, back }: { label: string; title: string; href?: string; onClick?: () => void; back?: boolean }) {
  const arrow = (
    <span aria-hidden="true" className={`inline-block transition-transform duration-700 ease-out-soft ${back ? "group-hover:-translate-x-[0.2em]" : "group-hover:translate-x-[0.2em]"}`}>{back ? "←" : "→"}</span>
  );
  const inner = (
    <>
      <span className="text-mute">{label}</span>
      <span className="flex items-baseline gap-[0.25em] font-serif text-[max(28px,3.8vw)] font-normal leading-none tracking-[-0.025em]">
        {back && arrow}
        <span className="relative block overflow-hidden pb-[0.12em]">
          <span className="block transition-transform duration-700 ease-out-soft group-hover:-translate-y-[110%]">{title}</span>
          <span aria-hidden="true" className="absolute inset-0 block translate-y-[110%] transition-transform duration-700 ease-out-soft group-hover:translate-y-0">{title}</span>
        </span>
        {!back && arrow}
      </span>
    </>
  );
  const cls = `group flex flex-col gap-2 ${back ? "items-start text-left" : "items-end text-right max-[640px]:items-start max-[640px]:text-left"}`;
  return href
    ? <Link href={href} className={cls}>{inner}</Link>
    : <button type="button" onClick={onClick} className={cls}>{inner}</button>;
}

/** Le texte d'un chapitre : numéro, titre, phrase de synthèse, puis les blocs. */
function ChapterText({ ch, n, title, lede = true }: { ch: Chapter; n: number; title?: string; lede?: boolean }) {
  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col gap-2.5">
        <Rise><span className="text-[11px] text-mute tabular-nums">{String(n).padStart(2, "0")}</span></Rise>
        {/* Le titre monte derrière un masque ; c'est le h2, jamais masqué, qui détecte l'entrée à l'écran */}
        <motion.h2
          className="m-0 overflow-hidden pb-[0.1em] font-serif text-[max(28px,3.2vw)] font-normal leading-[1.05] tracking-[-0.015em]"
          initial="hide" whileInView="show" viewport={seen}
        >
          <motion.span className="block" variants={{ hide: { y: "110%" }, show: { y: "0%" } }} transition={{ duration: 1, ease, delay: 0.05 }}>
            {title ?? ch.title}
          </motion.span>
        </motion.h2>
        {lede && <Rise delay={0.15}><p className="m-0 max-w-[46ch] text-[15px] leading-[1.45]">{ch.lede}</p></Rise>}
      </div>
      <ChapterBody ch={ch} />
    </div>
  );
}

function ChapterBody({ ch, className = "" }: { ch: Chapter; className?: string }) {
  return (
    <div className={`flex max-w-[62ch] flex-col gap-3.5 ${className}`}>
      {ch.body.map((b, j) => <Rise key={j} delay={0.2 + j * 0.06}><p className="m-0 text-mute">{b}</p></Rise>)}
      {ch.sources && (
        <Rise delay={0.4}>
          <p className="m-0 flex flex-wrap gap-x-3 gap-y-1 text-[11px] text-mute">
            <span>{ch.sources.length > 1 ? "Sources" : "Source"}</span>
            {ch.sources.map((src) => (
              <a key={src.href} href={src.href} target="_blank" rel="noopener noreferrer" className="underline decoration-line underline-offset-4 transition-colors duration-300 hover:text-fg">{src.label}</a>
            ))}
          </p>
        </Rise>
      )}
    </div>
  );
}

/** Filet qui se dessine de gauche à droite, en tête de section. */
function Rule() {
  return (
    <motion.span
      aria-hidden="true"
      className="absolute inset-x-0 top-0 h-px origin-left bg-line"
      initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }} viewport={{ once: true }} transition={{ duration: 1.2, ease: inout }}
    />
  );
}

const isReal = (m: MediaItem) => typeof m !== "string";
const mediaKey = (m: MediaItem) => (typeof m === "string" ? m : m.alt);
const section = "relative py-[5vw] max-[640px]:py-10";
const neutral = "color-mix(in srgb, var(--fg) 7%, var(--bg))";

/** Les écrans d'un cas, sur deux colonnes. Le premier (ou le dernier d'un nombre impair) prend toute la largeur. */
function Gallery({ items, tint, wideFirst }: { items: MediaItem[]; tint: string; wideFirst?: boolean }) {
  const odd = items.length % 2 === 1;
  return (
    <div className="grid grid-cols-2 items-start gap-[max(16px,2vw)] max-[640px]:grid-cols-1">
      {items.map((m, j) => {
        const wide = odd && (wideFirst ? j === 0 : j === items.length - 1);
        return (
          <div key={mediaKey(m)} className={wide ? "col-span-full" : ""}>
            <Media media={m} ratio="16 / 10" tint={j % 2 ? tint : neutral} />
          </div>
        );
      })}
    </div>
  );
}

/**
 * Page thème : le thème en grand, les cas en onglets, puis le cas choisi.
 * Cas de recherche : contexte et son écran, problème et décisions côte à côte en texte,
 * les écrans, puis les résultats. Cas visuel : trois textes courts, puis les écrans.
 */
export function ThemeView({ project, prev, next }: { project: Project; prev: Project; next: Project }) {
  const [ci, setCi] = useState(0);
  const c = project.cases[ci];
  const [contexte, probleme, decisions, resultats] = c.chapters;
  const all = c.chapters.flatMap((ch) => ch.media);
  const visual = project.layout === "visuel";
  // Cas visuel : tous les écrans, ou les emplacements tant qu'aucune image n'existe
  const screens = all.some(isReal) ? all.filter(isReal) : all;
  // Cas de recherche : le premier visuel accompagne le contexte, les autres vraies images suivent
  const lead = contexte.media[0];
  const rest = all.filter((m) => m !== lead && isReal(m));

  // Cas en rangs : un écran par section, les écrans en plus rejoignent la dernière
  const rows = [0, 1, 2].map((i) => (i < 2 ? screens.slice(i, i + 1) : screens.slice(2)));

  const pickCase = (i: number) => {
    if (i === ci) return;
    setCi(i);
    const el = document.getElementById("cas");
    if (el && el.getBoundingClientRect().top < 0) scrollToTarget(el, -72);
  };

  return (
    <article className="px-6 max-[640px]:px-4">
      <header className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] items-end gap-x-[4vw] gap-y-[2.4vw] pt-[4vw] max-[900px]:grid-cols-1 max-[640px]:gap-y-5 max-[640px]:pt-8">
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
          className="m-0 grid grid-cols-[auto_auto_auto_auto] justify-between gap-x-6 gap-y-2.5 max-[640px]:grid-cols-2 max-[640px]:justify-start"
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
          id="cas" role="tablist" aria-label="Cas" className="col-span-full mt-[1.4vw] flex flex-wrap gap-x-8 border-t border-line max-[640px]:mt-2 max-[640px]:gap-x-6"
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease, delay: 0.65 }}
        >
          {project.cases.map((k, i) => (
            <button
              key={k.slug + i}
              type="button"
              role="tab"
              aria-selected={i === ci}
              onClick={() => pickCase(i)}
              className={`relative py-3.5 transition-colors duration-300 hover:text-fg ${i === ci ? "text-fg" : "text-mute"}`}
            >
              {/* Le trait glisse d'un cas à l'autre, sur le filet */}
              {i === ci && <motion.span layoutId="case-line" className="absolute inset-x-0 -top-px h-px bg-fg" transition={{ duration: 0.6, ease: inout }} />}
              <span className="mr-1.5 text-[11px] tabular-nums text-mute">{String(i + 1).padStart(2, "0")}</span>{k.name}
            </button>
          ))}
        </motion.div>
      </header>

      <AnimatePresence mode="wait" initial={false}>
        <motion.div
          key={ci}
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0, transition: { duration: 0.7, ease } }}
          exit={{ opacity: 0, y: -12, transition: { duration: 0.25, ease: "easeIn" } }}
        >
          {project.layout === "rangs" ? (
            [[contexte, undefined], [probleme, "Problème"], [decisions, "Choix"]].map(([ch, title], i) => (
              <section key={i} className={`${section} grid grid-cols-2 gap-[4vw] max-[900px]:grid-cols-1 max-[900px]:gap-8`}>
                {i > 0 && <Rule />}
                <ChapterText ch={ch as Chapter} n={i + 1} title={title as string | undefined} />
                <div className="sticky top-24 flex flex-col gap-[max(16px,2vw)] self-start max-[900px]:static">
                  {rows[i].map((m, j) => <Media key={mediaKey(m)} media={m} ratio="16 / 10" tint={j % 2 ? project.tint : neutral} />)}
                </div>
              </section>
            ))
          ) : visual ? (
            <>
              <section className={`${section} grid grid-cols-3 gap-[4vw] max-[900px]:grid-cols-1 max-[900px]:gap-10`}>
                <ChapterText ch={contexte} n={1} lede={false} />
                <ChapterText ch={probleme} n={2} title="Problème" lede={false} />
                <ChapterText ch={decisions} n={3} title="Choix" lede={false} />
              </section>
              <section className={`${section} pt-0 max-[640px]:pt-0`}>
                <Gallery items={screens} tint={project.tint} wideFirst />
              </section>
            </>
          ) : (
            <>
              <section className={`${section} grid grid-cols-2 gap-[4vw] max-[900px]:grid-cols-1 max-[900px]:gap-8`}>
                <ChapterText ch={contexte} n={1} />
                {lead && (
                  <div className="sticky top-24 self-start max-[900px]:static">
                    <Media media={lead} ratio="16 / 10" tint={neutral} />
                  </div>
                )}
              </section>
              <section className={`${section} grid grid-cols-2 max-[900px]:grid-cols-1 max-[900px]:gap-10`}>
                <Rule />
                <div className="pr-[4vw] max-[900px]:pr-0"><ChapterText ch={probleme} n={2} /></div>
                <div className="border-l border-line pl-[4vw] max-[900px]:border-l-0 max-[900px]:border-t max-[900px]:pl-0 max-[900px]:pt-10"><ChapterText ch={decisions} n={3} /></div>
              </section>
              {rest.length > 0 && (
                <section className={`${section} pt-0 max-[640px]:pt-0`}>
                  <Gallery items={rest} tint={project.tint} />
                </section>
              )}
              <section className={`${section} grid grid-cols-[minmax(0,.8fr)_minmax(0,1.4fr)] gap-[4vw] max-[900px]:grid-cols-1 max-[900px]:gap-6`}>
                <Rule />
                <ChapterText ch={{ ...resultats, body: [], sources: undefined }} n={4} lede={false} />
                <div className="flex flex-col gap-[max(20px,2.4vw)]">
                  <Rise><p className="m-0 max-w-[26ch] font-serif text-[max(24px,2.6vw)] leading-[1.12] tracking-[-0.015em]">{resultats.lede}</p></Rise>
                  <ChapterBody ch={resultats} />
                </div>
              </section>
            </>
          )}
        </motion.div>
      </AnimatePresence>

      <nav aria-label="Précédent et suivant" className="flex items-end justify-between gap-8 border-t border-line py-[5vw] max-[640px]:flex-col max-[640px]:items-start max-[640px]:py-10">
        <EndLink back label="Thème précédent" title={prev.title} href={`/work/${prev.slug}`} />
        <EndLink label="Thème suivant" title={next.title} href={`/work/${next.slug}`} />
      </nav>
    </article>
  );
}
