"use client";

import { motion, useAnimationControls } from "motion/react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useRef } from "react";

const out = [0.2, 0.7, 0.1, 1] as const;

/**
 * Changement de page en fondu : la page en cours s'efface en glissant vers le haut,
 * la suivante monte à sa place. Pas de panneau, on reste dans le fond de page.
 * Ne joue pas pour les ancres de la même page, les liens externes, ni si le système demande moins de mouvement.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const page = useAnimationControls();
  const busy = useRef(false);
  const failsafe = useRef(0);

  // La nouvelle page est là : elle monte en apparaissant
  useEffect(() => {
    if (!busy.current) return;
    clearTimeout(failsafe.current);
    page.set({ opacity: 0, y: 28 });
    page.start({ opacity: 1, y: 0, transition: { duration: 0.75, ease: out } }).then(() => { busy.current = false; });
  }, [pathname, page]);

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
      // Le compteur de chargement de Work ne se rejoue pas après un fondu
      try { sessionStorage.setItem("loaded", "1"); } catch {}
      page.start({ opacity: 0, y: -20, transition: { duration: 0.36, ease: [0.5, 0, 0.8, 0.4] } })
        .then(() => router.push(url.pathname + url.search + url.hash));
      // Si la page ne change pas, on ne la laisse jamais invisible
      failsafe.current = window.setTimeout(() => { page.set({ opacity: 1, y: 0 }); busy.current = false; }, 5000);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [router, page]);

  return <motion.div animate={page}>{children}</motion.div>;
}
