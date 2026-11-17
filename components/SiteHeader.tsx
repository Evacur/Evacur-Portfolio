"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Coords } from "./Coords";

/**
 * En-tête commun à toutes les pages. « Travaux » reste souligné sur la liste et dans les expertises.
 * Sur l'accueil, le nom n'apparaît qu'une fois le grand titre passé.
 */
export function SiteHeader({ hideLogoUntilScroll = false, current, className = "" }: { hideLogoUntilScroll?: boolean; current?: "work"; className?: string }) {
  const [scrolled, setScrolled] = useState(!hideLogoUntilScroll);

  useEffect(() => {
    if (!hideLogoUntilScroll) return;
    const on = () => setScrolled(window.scrollY > 260);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, [hideLogoUntilScroll]);

  return (
    <header
      className={`${className || "sticky top-0"} z-20 flex items-center justify-between bg-bg px-6 max-[640px]:px-4 transition-[border-color] duration-300 border-b ${scrolled ? "border-line" : "border-transparent"}`}
    >
      <Link
        href="/"
        className={`inline-flex min-h-14 items-center font-medium transition-[opacity,transform] duration-500 ease-out-soft ${scrolled ? "opacity-100" : "pointer-events-none translate-y-1.5 opacity-0"}`}
        tabIndex={scrolled ? 0 : -1}
      >
        Pablo Cuerva
      </Link>
      {/* Coordonnées du curseur, toujours visibles au centre de l'en-tête */}
      <Coords className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" />
      <nav aria-label="Navigation principale" className="flex items-center gap-6 max-[640px]:gap-3.5">
        <Link href="/work" aria-current={current === "work" ? "page" : undefined} className="u inline-flex min-h-14 items-center">Travaux</Link>
        <Link href="/#faq" className="u inline-flex min-h-14 items-center">FAQ</Link>
        <Link href="/#contact" className="u inline-flex min-h-14 items-center">Contact</Link>
      </nav>
    </header>
  );
}
