"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import type { Project } from "@/lib/projects";

const ease = [0.2, 0.7, 0.1, 1] as const;

/** Visuel en attente : se dévoile de haut en bas avec un léger dézoom. */
function Media({ label, ratio, tint }: { label: string; ratio: string; tint: string }) {
  return (
    <figure className="m-0 flex flex-col gap-2">
      <motion.div
        className="relative overflow-hidden rounded-[4px]"
        style={{ aspectRatio: ratio }}
        initial={{ clipPath: "inset(0 0 100% 0)" }}
        whileInView={{ clipPath: "inset(0 0 0% 0)" }}
        viewport={{ once: true, margin: "0px 0px -60px 0px" }}
        transition={{ duration: 1.1, ease: [0.65, 0, 0.15, 1] }}
      >
        <motion.span
          className="absolute inset-0"
          style={{ background: tint }}
          initial={{ scale: 1.12 }}
          whileInView={{ scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.6, ease }}
        />
      </motion.div>
      <figcaption className="text-mute">{label}</figcaption>
    </figure>
  );
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
    setCi(i);
    const top = document.getElementById("cas")?.getBoundingClientRect().top ?? 0;
    if (top < 0) window.scrollBy({ top: top - 72, behavior: "smooth" });
  };

  return (
    <article className="px-6">
      <header className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-x-[4vw] gap-y-[2.4vw] pb-[4vw] pt-[4vw] max-[640px]:grid-cols-1">
        <Link href="/work" className="col-span-full text-mute">← Travaux · Thème {project.n}</Link>
        <h1 className="col-span-full m-0 text-[max(36px,6vw)] font-semibold leading-[0.95] tracking-[-0.04em]">
          {project.title.split("").map((ch, i) => (
            <span key={i} aria-hidden="true" className="inline-block overflow-hidden align-bottom">
              <motion.span className="inline-block" initial={{ y: "105%" }} animate={{ y: "0%" }} transition={{ duration: 1, ease, delay: i * 0.03 }}>
                {ch === " " ? " " : ch}
              </motion.span>
            </span>
          ))}
          <span className="sr-only">{project.title}</span>
        </h1>
        <p className="m-0 max-w-[40ch] text-[15px] leading-[1.45]">{project.pitch}</p>
        <dl className="m-0 grid grid-cols-2 gap-x-4 gap-y-2.5">
          {[["Client", c.client], ["Année", c.year], ["Rôle", c.role], ["Durée", c.duration]].map(([k, v]) => (
            <div key={k}><dt className="text-[11px] text-mute">{k}</dt><dd className="m-0 mt-0.5">{v}</dd></div>
          ))}
        </dl>
        <div id="cas" role="tablist" aria-label="Cas" className="col-span-full flex flex-wrap gap-2">
          {project.cases.map((k, i) => (
            <button
              key={k.slug + i}
              type="button"
              role="tab"
              aria-selected={i === ci}
              onClick={() => pickCase(i)}
              className={`inline-flex min-h-9 items-center rounded-full border px-3.5 transition-colors duration-300 ${i === ci ? "border-fg bg-fg text-bg" : "border-line text-mute hover:text-fg"}`}
            >
              Cas {i + 1} · {k.name}
            </button>
          ))}
        </div>
      </header>

      <nav aria-label="Chapitres" className="sticky top-14 z-10 flex flex-wrap gap-x-6 border-y border-line bg-bg py-3">
        {c.chapters.map((ch, i) => (
          <a
            key={ch.title}
            href={`#ch-${i}`}
            className={`transition-colors duration-300 ${i === active ? "text-fg" : "text-mute"}`}
            onClick={(e) => { e.preventDefault(); refs.current[i]?.scrollIntoView({ behavior: "smooth", block: "start" }); }}
          >
            {String(i + 1).padStart(2, "0")} {ch.title}
          </a>
        ))}
      </nav>

      <div key={ci}>
        {c.chapters.map((ch, i) => (
          <section
            key={ch.title}
            id={`ch-${i}`}
            ref={(el) => { refs.current[i] = el; }}
            className="grid scroll-mt-28 grid-cols-[minmax(0,.8fr)_minmax(0,1.4fr)] gap-[4vw] border-b border-line py-[5vw] max-[640px]:grid-cols-1"
          >
            <div className="sticky top-32 flex flex-col gap-2.5 self-start max-[640px]:static">
              <span className="text-[11px] text-mute tabular-nums">{String(i + 1).padStart(2, "0")}</span>
              <h2 className="m-0 text-[max(22px,2.4vw)] font-semibold leading-[1.05] tracking-[-0.02em]">{ch.title}</h2>
              <p className="m-0">{ch.lede}</p>
              {ch.body.map((b, j) => <p key={j} className="m-0 text-mute">{b}</p>)}
            </div>
            <div className={`grid gap-[2vw] ${ch.media.length === 2 ? "grid-cols-2 max-[640px]:grid-cols-1" : ""}`}>
              {ch.media.map((m, j) => (
                <Media key={m} label={m} ratio={ch.media.length === 2 ? "4 / 5" : "16 / 10"} tint={j % 2 ? project.tint : "color-mix(in srgb, var(--fg) 7%, var(--bg))"} />
              ))}
            </div>
          </section>
        ))}
      </div>

      {lastCase ? (
        <Link href={`/work/${next.slug}`} className="group flex flex-col gap-1.5 py-[5vw]">
          <span className="text-mute">Thème suivant</span>
          <span className="text-[max(28px,5vw)] font-semibold leading-none tracking-[-0.04em]">
            {next.title} <span className="inline-block transition-transform duration-500 ease-out-soft group-hover:translate-x-2">→</span>
          </span>
        </Link>
      ) : (
        <button type="button" onClick={() => { setCi(ci + 1); window.scrollTo({ top: 0, behavior: "smooth" }); }} className="group flex w-full flex-col items-start gap-1.5 py-[5vw] text-left">
          <span className="text-mute">Cas suivant</span>
          <span className="text-[max(28px,5vw)] font-semibold leading-none tracking-[-0.04em]">
            {project.cases[ci + 1].name} <span className="inline-block transition-transform duration-500 ease-out-soft group-hover:translate-x-2">→</span>
          </span>
        </button>
      )}
    </article>
  );
}
