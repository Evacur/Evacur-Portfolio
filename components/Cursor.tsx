"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Curseur du site : un point qui s'ouvre en étiquette au-dessus des éléments marqués data-cur.
 * Souris uniquement ; le curseur natif n'est masqué qu'après le premier mouvement.
 */
export function Cursor() {
  const ref = useRef<HTMLDivElement>(null);
  const [label, setLabel] = useState("");
  const [big, setBig] = useState(false);

  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const el = ref.current;
    if (!el) return;
    const root = document.documentElement;
    const move = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      root.classList.add("has-cursor");
      el.style.transform = `translate(${e.clientX}px, ${e.clientY}px)`;
      el.style.opacity = "1";
      const t = (e.target as Element | null)?.closest?.("[data-cur]");
      const l = t?.getAttribute("data-cur") ?? "";
      setBig(!!l);
      if (l) setLabel(l);
    };
    const out = () => { el.style.opacity = "0"; };
    window.addEventListener("pointermove", move, { passive: true });
    root.addEventListener("pointerleave", out);
    return () => {
      window.removeEventListener("pointermove", move);
      root.removeEventListener("pointerleave", out);
      root.classList.remove("has-cursor");
    };
  }, []);

  return (
    <div ref={ref} aria-hidden="true" className={`cursor ${big ? "is-big" : ""}`}>
      <span><i>{label}</i></span>
    </div>
  );
}
