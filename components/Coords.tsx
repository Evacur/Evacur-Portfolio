"use client";

import { useEffect, useState } from "react";

/** Position du curseur en direct, comme un repère d'outil de dessin. Souris uniquement. */
export function Coords({ className = "" }: { className?: string }) {
  const [p, setP] = useState<[number, number] | null>(null);
  useEffect(() => {
    const on = (e: PointerEvent) => { if (e.pointerType === "mouse") setP([Math.round(e.clientX), Math.round(e.clientY)]); };
    window.addEventListener("pointermove", on, { passive: true });
    return () => window.removeEventListener("pointermove", on);
  }, []);
  return (
    <span aria-hidden="true" className={`inline-flex gap-1 text-mute tabular-nums transition-opacity duration-500 max-[760px]:hidden ${p ? "" : "opacity-0"} ${className}`}>
      x <span className="inline-block min-w-[4ch] text-fg">{p ? p[0] : 0}</span> y <span className="inline-block min-w-[4ch] text-fg">{p ? p[1] : 0}</span>
    </span>
  );
}
