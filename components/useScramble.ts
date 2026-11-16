"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useReducedMotion } from "motion/react";

const GLYPHS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ/·&";

/** Les lettres se déchiffrent de gauche à droite. Renvoie le texte affiché et la fonction qui relance l'effet. */
export function useScramble(text: string, duration = 900, upper = true) {
  const reduce = useReducedMotion();
  const [out, setOut] = useState(text);
  const raf = useRef(0);

  const run = useCallback(() => {
    if (reduce) return;
    cancelAnimationFrame(raf.current);
    const glyphs = upper ? GLYPHS : GLYPHS.toLowerCase();
    const start = performance.now();
    const step = (now: number) => {
      const t = (now - start) / duration;
      setOut(text.split("").map((ch, k) => (ch === " " || k / text.length < t ? ch : glyphs[(Math.random() * glyphs.length) | 0])).join(""));
      if (t < 1) raf.current = requestAnimationFrame(step);
    };
    raf.current = requestAnimationFrame(step);
  }, [reduce, text, duration, upper]);

  useEffect(() => () => cancelAnimationFrame(raf.current), []);
  return [out, run] as const;
}
