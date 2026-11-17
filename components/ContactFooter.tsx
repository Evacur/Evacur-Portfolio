"use client";

import { contact } from "@/lib/content";
import { Clock } from "./Clock";

/** Contact en bas de chaque page qui défile : email en grand, liens, dispo. */
export function ContactFooter() {
  const pill = "inline-flex min-h-10 items-center rounded-full border border-line px-4 transition-colors duration-300";
  return (
    <footer id="contact" className="flex flex-col gap-5 border-t border-line px-6 pb-6 pt-[6vw]">
      <span className="text-mute">Un projet en tête ?</span>
      <a href={`mailto:${contact.email}`} data-cur="écrire" data-umami-event="contact-email" className="max-w-full break-words font-serif text-[max(30px,6.4vw)] font-normal leading-none tracking-[-0.025em]">
        {contact.email}
      </a>
      <div className="flex flex-wrap items-center gap-2.5">
        {contact.links.map((l) => (
          <a key={l.label} href={l.href} data-umami-event="contact-lien" data-umami-event-lien={l.label} {...(l.href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} className={`${pill} hover:border-fg`}>{l.label}</a>
        ))}
      </div>
      <div className="flex flex-wrap justify-between gap-2 border-t border-line pt-4 text-mute">
        <span>{contact.availability}</span>
        <span className="inline-flex gap-1">Paris <span className="text-fg"><Clock /></span></span>
        <span>2026 ©</span>
      </div>
    </footer>
  );
}
