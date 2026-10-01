"use client";

import Link from "next/link";
import { MotionConfig } from "motion/react";
import { useCallback, useEffect, useState } from "react";
import { projects } from "@/lib/projects";
import { Clock } from "./Clock";
import { Gallery } from "./Gallery";
import { Loader } from "./Loader";
import { ProjectList } from "./ProjectList";

const NAV = [
  { href: "/", label: "Travaux" },
  { href: "/a-propos", label: "À propos" },
  { href: "/contact", label: "Contact" },
];

const corner = "absolute z-[5] inline-flex min-h-11 items-center px-6";

export function Home() {
  const [ready, setReady] = useState(false);
  const [idx, setIdx] = useState(0);
  const [prev, setPrev] = useState(-1);
  const [view, setView] = useState<"gallery" | "list">("gallery");
  const [dark, setDark] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => { setDark(document.documentElement.classList.contains("dark")); }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem("theme", next ? "dark" : "light"); } catch {}
  };

  const go = useCallback((i: number) => {
    const j = Math.max(0, Math.min(projects.length - 1, i));
    setIdx((cur) => {
      if (j !== cur) setPrev(cur);
      return j;
    });
  }, []);

  const onReady = useCallback(() => setReady(true), []);

  // Flèches du clavier pour changer de projet
  useEffect(() => {
    if (view !== "gallery") return;
    const onKey = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLElement && e.target.closest("input, textarea, [contenteditable]")) return;
      if (e.key === "ArrowRight" || e.key === "ArrowDown") { e.preventDefault(); setIdx((c) => { const j = Math.min(projects.length - 1, c + 1); if (j !== c) setPrev(c); return j; }); }
      if (e.key === "ArrowLeft" || e.key === "ArrowUp") { e.preventDefault(); setIdx((c) => { const j = Math.max(0, c - 1); if (j !== c) setPrev(c); return j; }); }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [view]);

  return (
    <MotionConfig reducedMotion="user">
      <main className="relative h-dvh min-h-[560px] overflow-hidden">
        <Loader onDone={onReady} />
        <h1 className="sr-only">Pablo Cuerva, product designer à Paris</h1>

        {/* Haut */}
        <Link href="/" className={`${corner} left-0 top-3`}>Pablo Cuerva</Link>

        <nav aria-label="Navigation principale" className="absolute left-1/2 top-3 z-[5] flex -translate-x-1/2 gap-7 max-[760px]:hidden">
          {NAV.map((l) => (
            <Link key={l.href} href={l.href} aria-current={l.href === "/" ? "page" : undefined} className="u inline-flex min-h-11 items-center">
              {l.label}
            </Link>
          ))}
        </nav>
        <button
          type="button"
          aria-expanded={menu}
          aria-controls="menu-mobile"
          onClick={() => setMenu((m) => !m)}
          className="absolute left-1/2 top-3 z-[21] inline-flex min-h-11 -translate-x-1/2 items-center min-[761px]:hidden"
        >
          {menu ? "Fermer" : "Menu"}
        </button>

        <button type="button" onClick={toggleTheme} aria-label={dark ? "Passer en thème clair" : "Passer en thème sombre"} className={`${corner} right-0 top-3`}>
          ({dark ? "clair" : "sombre"})
        </button>

        {/* Centre */}
        {view === "gallery"
          ? <Gallery projects={projects} idx={idx} prev={prev} ready={ready} go={go} />
          : <ProjectList projects={projects} />}

        {/* Bas */}
        <button type="button" onClick={() => setView(view === "gallery" ? "list" : "gallery")} className={`${corner} bottom-3 left-0`}>
          ({view === "gallery" ? "voir la liste" : "voir la galerie"})
        </button>
        <span className="absolute bottom-3 left-1/2 z-[5] inline-flex min-h-11 -translate-x-1/2 items-center gap-1 whitespace-nowrap text-mute max-[480px]:hidden">
          Product designer, Paris <Clock />
        </span>
        <span className={`${corner} bottom-3 right-0 text-mute`}>2026 ©</span>

        {/* Menu mobile */}
        {menu && (
          <div id="menu-mobile" className="fixed inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-bg">
            {NAV.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setMenu(false)} aria-current={l.href === "/" ? "page" : undefined} className="u inline-flex min-h-11 items-center">
                {l.label}
              </Link>
            ))}
            <span className="mt-6 inline-flex items-center gap-1 text-mute">Product designer, Paris <Clock /></span>
          </div>
        )}
      </main>
    </MotionConfig>
  );
}
