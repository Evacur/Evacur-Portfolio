"use client";

import Link from "next/link";
import { MotionConfig } from "motion/react";
import { useEffect, useState } from "react";
import { projects } from "@/lib/projects";
import { Clock } from "./Clock";
import { Loader } from "./Loader";
import { ProjectList } from "./ProjectList";

const NAV = [
  { href: "/work", label: "Travaux" },
  { href: "/#faq", label: "FAQ" },
  { href: "/#contact", label: "Contact" },
];

const noop = () => {};
const corner = "absolute z-[5] inline-flex min-h-11 items-center px-6";

/** Work : un seul écran, sans scroll. La liste des thèmes, au centre. */
export function WorkScreen() {
  const [dark, setDark] = useState(false);
  const [menu, setMenu] = useState(false);

  useEffect(() => { setDark(document.documentElement.classList.contains("dark")); }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try { localStorage.setItem("theme", next ? "dark" : "light"); } catch {}
  };


  return (
    <MotionConfig reducedMotion="user">
      <main className="relative h-dvh min-h-[560px] overflow-hidden">
        <Loader onDone={noop} />
        <h1 className="sr-only">Travaux de Pablo Cuerva, product designer à Paris</h1>

        {/* Haut */}
        <Link href="/" className={`${corner} left-0 top-3 font-medium`}>Pablo Cuerva</Link>

        <nav aria-label="Navigation principale" className="absolute left-1/2 top-3 z-[5] flex -translate-x-1/2 gap-7 max-[760px]:hidden">
          {NAV.map((l) => (
            <Link key={l.href} href={l.href} aria-current={l.href === "/work" ? "page" : undefined} className="u inline-flex min-h-11 items-center">
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
        <ProjectList projects={projects} />

        {/* Bas */}
        <span className="absolute bottom-3 left-1/2 z-[5] inline-flex min-h-11 -translate-x-1/2 items-center gap-1 whitespace-nowrap text-mute max-[480px]:hidden">
          Product designer, Paris <Clock />
        </span>
        <span className={`${corner} bottom-3 right-0 text-mute`}>2026 ©</span>

        {/* Menu mobile */}
        {menu && (
          <div id="menu-mobile" className="fixed inset-0 z-20 flex flex-col items-center justify-center gap-2 bg-bg">
            {NAV.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setMenu(false)} aria-current={l.href === "/work" ? "page" : undefined} className="u inline-flex min-h-11 items-center">
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
