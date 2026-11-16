"use client";

import { motion, useAnimationControls } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const volet = [0.75, 0, 0.15, 1] as const;

/**
 * Changement de page : un volet noir monte et couvre l'écran, la page change dessous,
 * puis le volet continue vers le haut et découvre la nouvelle page.
 * Ne joue pas pour les ancres de la même page, les liens externes, ni si le système demande moins de mouvement.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const curtain = useAnimationControls();
  const busy = useRef(false);
  const failsafe = useRef(0);

  // La nouvelle page est là : le volet s'en va par le haut
  useEffect(() => {
    if (!busy.current) return;
    clearTimeout(failsafe.current);
    curtain.start({ clipPath: "inset(0% 0% 100% 0%)", transition: { duration: 0.7, ease: volet, delay: 0.08 } }).then(() => {
      curtain.set({ clipPath: "inset(100% 0% 0% 0%)" });
      busy.current = false;
    });
  }, [pathname, curtain]);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as HTMLElement).closest?.("a");
      if (!a || a.target === "_blank" || a.hasAttribute("download")) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin || url.pathname === window.location.pathname) return;
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
      e.preventDefault();
      if (busy.current) return;
      busy.current = true;
      // Le compteur de chargement de Work ne se rejoue pas derrière le volet
      try { sessionStorage.setItem("loaded", "1"); } catch {}
      const go = () => router.push(url.pathname + url.search + url.hash);
      curtain.start({ clipPath: "inset(0% 0% 0% 0%)", transition: { duration: 0.55, ease: volet } }).then(go);
      // Si la page ne change pas, on ne laisse jamais l'écran couvert
      failsafe.current = window.setTimeout(() => {
        curtain.set({ clipPath: "inset(100% 0% 0% 0%)" });
        busy.current = false;
      }, 5000);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router, curtain]);

  return (
    <>
      {children}
      <motion.div
        aria-hidden="true"
        className="pointer-events-none fixed inset-0 z-[100] bg-fg"
        initial={{ clipPath: "inset(100% 0% 0% 0%)" }}
        animate={curtain}
      />
    </>
  );
}
