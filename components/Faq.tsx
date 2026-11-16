"use client";

import { useState } from "react";
import { faq } from "@/lib/content";
import { Reveal } from "./Reveal";

/** Questions fréquentes : une seule ouverte à la fois, le + devient −. */
export function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section aria-label="Questions fréquentes" className="px-6 py-[6vw]">
      <p className="m-0 mb-[4vw] max-w-[30ch] text-[max(16px,1.9vw)] leading-[1.3] tracking-[-0.01em]">
        Ce qu&apos;on me demande avant de travailler ensemble.
      </p>
      <Reveal>
        <ul className="m-0 list-none border-t border-line p-0">
          {faq.map((f, i) => {
            const on = open === i;
            return (
              <li key={f.q} className="border-b border-line">
                <button
                  type="button"
                  aria-expanded={on}
                  aria-controls={`faq-${i}`}
                  onClick={() => setOpen(on ? -1 : i)}
                  className="flex min-h-11 w-full items-center justify-between gap-4 py-[18px] text-left text-[17px] font-medium tracking-[-0.01em]"
                >
                  <span>{f.q}</span>
                  <span aria-hidden="true" className={`faq-plus ${on ? "is-open" : ""}`} />
                </button>
                <div id={`faq-${i}`} className={`faq-a ${on ? "is-open" : ""}`}>
                  <div>
                    <p className="m-0 mb-[18px] max-w-[52ch] text-mute">{f.a}</p>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </Reveal>
    </section>
  );
}
