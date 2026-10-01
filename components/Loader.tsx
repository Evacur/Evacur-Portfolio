"use client";

import { useEffect, useState } from "react";

/** Petit compteur 000 → 100, puis fondu. Ignoré si l'animation est réduite ou déjà vu dans la session. */
export function Loader({ onDone }: { onDone: () => void }) {
  const [pct, setPct] = useState(0);
  const [out, setOut] = useState(false);
  const [gone, setGone] = useState(false);

  useEffect(() => {
    let seen = false;
    try { seen = sessionStorage.getItem("loaded") === "1"; } catch {}
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (seen || reduce) {
      setGone(true);
      onDone();
      return;
    }
    let n = 0;
    let doneT: ReturnType<typeof setTimeout>;
    const t = setInterval(() => {
      n = Math.min(100, n + 5 + Math.round(Math.random() * 10));
      setPct(n);
      if (n >= 100) {
        clearInterval(t);
        try { sessionStorage.setItem("loaded", "1"); } catch {}
        doneT = setTimeout(() => { setOut(true); onDone(); }, 200);
      }
    }, 50);
    return () => { clearInterval(t); clearTimeout(doneT); };
  }, [onDone]);

  if (gone) return null;
  return (
    <div
      aria-hidden="true"
      onTransitionEnd={() => out && setGone(true)}
      className={`fixed inset-0 z-30 flex items-center justify-center bg-bg transition-opacity duration-[800ms] delay-200 ${out ? "pointer-events-none opacity-0" : ""}`}
    >
      <span className="text-mute tabular-nums">Chargement {String(pct).padStart(3, "0")}</span>
    </div>
  );
}
