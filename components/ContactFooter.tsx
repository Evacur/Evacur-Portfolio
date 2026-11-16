"use client";

import { useEffect, useState } from "react";
import { contact } from "@/lib/content";
import { Clock } from "./Clock";

/** Position du curseur en direct, comme un repère d'outil de dessin. Souris uniquement. */
function Coords() {
  const [p, setP] = useState<[number, number] | null>(null);
  useEffect(() => {
    const on = (e: PointerEvent) => { if (e.pointerType === "mouse") setP([Math.round(e.clientX), Math.round(e.clientY)]); };
    window.addEventListener("pointermove", on, { passive: true });
    return () => window.removeEventListener("pointermove", on);
  }, []);
  if (!p) return null;
  return (
    <span aria-hidden="true" className="inline-flex gap-1 tabular-nums max-[760px]:hidden">
      x <span className="inline-block min-w-[4ch] text-fg">{p[0]}</span> y <span className="inline-block min-w-[4ch] text-fg">{p[1]}</span>
    </span>
  );
}

/** Contact en bas de chaque page qui défile : email en grand, copie en un clic, liens, dispo. */
export function ContactFooter() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try { await navigator.clipboard.writeText(contact.email); } catch {}
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };
  const pill = "inline-flex min-h-10 items-center rounded-full border border-line px-4 transition-colors duration-300";
  return (
    <footer id="contact" className="flex flex-col gap-5 border-t border-line px-6 pb-6 pt-[6vw]">
      <span className="text-mute">Un projet en tête ?</span>
      <a href={`mailto:${contact.email}`} data-cur="écrire" className="max-w-full break-words font-serif text-[max(30px,6.4vw)] font-normal leading-none tracking-[-0.025em]">
        {contact.email}
      </a>
      <div className="flex flex-wrap items-center gap-2.5">
        <button type="button" onClick={copy} className={`${pill} ${copied ? "border-fg bg-fg text-bg" : ""}`} aria-live="polite">
          {copied ? "Copié ✓" : "Copier l'email"}
        </button>
        {contact.links.map((l) => (
          <a key={l.label} href={l.href} {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} className={`${pill} hover:border-fg`}>{l.label}</a>
        ))}
      </div>
      <div className="flex flex-wrap justify-between gap-2 border-t border-line pt-4 text-mute">
        <span>{contact.availability}</span>
        <span className="inline-flex gap-1">Paris <span className="text-fg"><Clock /></span></span>
        <Coords />
        <span>2026 ©</span>
      </div>
    </footer>
  );
}
