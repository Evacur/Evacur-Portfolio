"use client";

import { useEffect, useRef, useState } from "react";
import { useInView, useReducedMotion } from "motion/react";

/** Du code générique, écrit pour l'animation. Rien ne vient d'un projet réel. */
const FILES: [string, string[]][] = [
  ["tokens.css", [
    ":root {",
    "  --color-fg: #111111;",
    "  --color-mute: #6b6b6b;",
    "  --space-2: 8px;",
    "  --space-4: 16px;",
    "  --radius-md: 10px;",
    "}",
  ]],
  ["button.tsx", [
    "export function Button({ variant, children }) {",
    "  return (",
    "    <button className={styles[variant]}>",
    "      {children}",
    "    </button>",
    "  );",
    "}",
  ]],
  ["button.css", [
    ".primary {",
    "  color: var(--color-bg);",
    "  background: var(--color-fg);",
    "  padding: var(--space-2) var(--space-4);",
    "  border-radius: var(--radius-md);",
    "}",
  ]],
];
const GLYPHS = "abcdefghijklmnopqrstuvwxyz/·&";
const IN = 1.1, STAGGER = 0.16, HOLD = 2.6;
const two = (n: number) => String(n).padStart(2, "0");

/** Une ligne à l'avancement `p` (0 à 1) : la clé, la valeur, puis les caractères encore brouillés. */
function split(text: string, p: number) {
  const colon = text.indexOf(":");
  const cut = colon > 0 ? colon + 1 : text.length;
  const shown = Math.floor(text.length * Math.min(1, Math.max(0, p)));
  let key = "", value = "", noise = "";
  for (let k = 0; k < text.length; k++) {
    const ch = text[k];
    if (ch === " " || k < shown) { if (k < cut) key += ch; else value += ch; }
    else noise += GLYPHS[(Math.random() * GLYPHS.length) | 0];
  }
  return { key, value, noise };
}

/**
 * Trois fichiers de code générique qui se déchiffrent ligne par ligne, avec le même effet que les titres du site.
 * L'animation ne tourne que lorsque le cadre est à l'écran. Sans animation, le premier fichier s'affiche tel quel.
 */
export function CodeSim({ label }: { label: string }) {
  const reduce = useReducedMotion();
  const box = useRef<HTMLDivElement>(null);
  const visible = useInView(box);
  const [file, setFile] = useState(0);
  const [t, setT] = useState(reduce ? Infinity : 0);

  useEffect(() => {
    if (reduce || !visible) return;
    let fi = file, start = performance.now();
    const id = setInterval(() => {
      const now = (performance.now() - start) / 1000;
      if (now > IN + STAGGER * FILES[fi][1].length + HOLD) {
        fi = (fi + 1) % FILES.length;
        start = performance.now();
        setFile(fi);
        setT(0);
      } else setT(now);
    }, 45);
    return () => clearInterval(id);
    // Le fichier courant n'est lu qu'au redémarrage de la boucle
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduce, visible]);

  const [name, rows] = FILES[file];
  return (
    <div ref={box} role="img" aria-label={label} className="absolute inset-0 flex flex-col rounded-[8px] border border-line bg-bg font-mono [container-type:inline-size]">
      <div aria-hidden="true" className="flex justify-between gap-3 border-b border-line px-[2.4cqw] py-[1.6cqw] text-[clamp(8px,1.5cqw,11px)] leading-none text-mute">
        <span className="text-fg">{name}</span>
        <span className="tabular-nums">{two(file + 1)} / {two(FILES.length)}</span>
      </div>
      <pre aria-hidden="true" className="m-0 flex flex-1 flex-col justify-center overflow-hidden px-[2.4cqw] font-mono text-[clamp(8px,2.1cqw,15px)] leading-[1.75] tabular-nums">
        {rows.map((row, i) => {
          const { key, value, noise } = split(row, (t - i * STAGGER) / IN);
          return (
            <span key={i} className="block whitespace-pre">
              <span className="inline-block w-[2.2em] select-none text-fg/30">{two(i + 1)}</span>
              {key}<span className="text-mute">{value}</span><span className="text-fg/30">{noise}</span>
            </span>
          );
        })}
      </pre>
    </div>
  );
}
