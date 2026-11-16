"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTheme } from "./useTheme";

/**
 * En-tête des pages qui défilent (accueil, pages thème).
 * Sur l'accueil, le nom n'apparaît qu'une fois le grand titre passé.
 */
export function SiteHeader({ hideLogoUntilScroll = false }: { hideLogoUntilScroll?: boolean }) {
  const [scrolled, setScrolled] = useState(!hideLogoUntilScroll);
  const { dark, toggle } = useTheme();

  useEffect(() => {
    if (!hideLogoUntilScroll) return;
    const on = () => setScrolled(window.scrollY > 260);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [hideLogoUntilScroll]);

  return (
    <header
      className={`sticky top-0 z-20 flex items-center justify-between bg-bg px-6 transition-[border-color] duration-300 border-b ${scrolled ? "border-line" : "border-transparent"}`}
    >
      <Link
        href="/"
        className={`inline-flex min-h-14 items-center font-medium transition-[opacity,transform] duration-500 ease-out-soft ${scrolled ? "opacity-100" : "pointer-events-none translate-y-1.5 opacity-0"}`}
        tabIndex={scrolled ? 0 : -1}
      >
        Pablo Cuerva
      </Link>
      <nav aria-label="Navigation principale" className="flex items-center gap-6">
        <Link href="/work" className="u inline-flex min-h-14 items-center">Travaux</Link>
        <Link href="/#contact" className="u inline-flex min-h-14 items-center">Contact</Link>
        <button type="button" onClick={toggle} aria-label={dark ? "Passer en thème clair" : "Passer en thème sombre"} className="inline-flex min-h-14 items-center text-mute">
          ({dark ? "clair" : "sombre"})
        </button>
      </nav>
    </header>
  );
}
