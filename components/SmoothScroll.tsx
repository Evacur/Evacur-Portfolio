"use client";

import Lenis from "lenis";
import "lenis/dist/lenis.css";
import { useEffect } from "react";

declare global {
  interface Window { __lenis?: Lenis }
}

/** Scroll fluide à la molette (Lenis). Rien ne change au doigt, ni si le système demande moins de mouvement. */
export function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ lerp: 0.11, wheelMultiplier: 1, autoRaf: true, anchors: { offset: -56 } });
    window.__lenis = lenis;
    return () => { lenis.destroy(); delete window.__lenis; };
  }, []);
  return null;
}

/** Va à un élément ou à une position, avec le scroll fluide s'il tourne, sinon avec le scroll natif. */
export function scrollToTarget(target: HTMLElement | number, offset = 0) {
  if (window.__lenis) { window.__lenis.scrollTo(target, { offset, duration: 1.1 }); return; }
  const top = typeof target === "number" ? target : target.getBoundingClientRect().top + window.scrollY;
  const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  window.scrollTo({ top: top + offset, behavior: reduce ? "auto" : "smooth" });
}
