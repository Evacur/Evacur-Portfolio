"use client";

import { useState } from "react";
import { faq } from "@/lib/content";
import { Reveal } from "./Reveal";

/** Questions fréquentes : une seule ouverte à la fois, le + devient −. */
export function Faq() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" aria-label="Questions fréquentes" className="scroll-mt-14 px-6 py-[6vw]">
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
                  <span className="faq-q">{f.q}</span>
                  <span aria-hidden="true" className={`faq-plus ${on ? "is-open" : ""}`} />
                </button>
                <div id={`faq-${i}`} className={`faq-a ${on ? "is-open" : ""}`}>
                  <div>
                    <p className="m-0 mb-[18px] max-w-[52ch] text-mute">{f.a}</p>
                    {f.rows && (
                      <dl className="faq-rows m-0 mb-[22px] max-w-[720px]">
                        {f.rows.map((r, k) => (
                          <div key={k} className={`grid grid-cols-[110px_90px_1fr] gap-x-4 py-3 ${r.when ? "border-t border-line" : "pt-0"} max-[760px]:grid-cols-[1fr] max-[760px]:gap-y-1`}>
                            <dt className="font-mono text-[12px] uppercase tracking-[0.06em] text-mute max-[760px]:empty:hidden">{r.when}</dt>
                            <dd className="m-0 font-medium max-[760px]:empty:hidden">{r.where}</dd>
                            <dd className="m-0 text-mute">{r.what}</dd>
                          </div>
                        ))}
                      </dl>
                    )}
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
