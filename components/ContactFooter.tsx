"use client";

import { useState } from "react";
import { contact } from "@/lib/content";
import { Clock } from "./Clock";

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
      <a href={`mailto:${contact.email}`} className="text-[max(32px,5.6vw)] font-semibold leading-none tracking-[-0.04em]">
        {contact.email}
      </a>
      <div className="flex flex-wrap items-center gap-2.5">
        <button type="button" onClick={copy} className={`${pill} ${copied ? "border-fg bg-fg text-bg" : ""}`} aria-live="polite">
          {copied ? "Copié ✓" : "Copier l'email"}
        </button>
        {contact.links.map((l) => (
          <a key={l.label} href={l.href} className={`${pill} hover:border-fg`}>{l.label}</a>
        ))}
      </div>
      <div className="flex flex-wrap justify-between gap-2 pt-3.5 text-mute">
        <span>{contact.availability}</span>
        <span className="inline-flex gap-1">Paris <Clock /></span>
        <span>2026 ©</span>
      </div>
    </footer>
  );
}
