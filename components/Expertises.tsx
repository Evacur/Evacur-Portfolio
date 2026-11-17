"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { useState } from "react";
import { expertises } from "@/lib/content";
import { rich } from "./Rich";
import { Reveal } from "./Reveal";

const skills = expertises;

/**
 * Expertises en accordéon (une ligne ouverte à la fois, comme la FAQ).
 * Les secteurs sont cités dans les descriptions.
 */
export function Expertises() {
  const [open, setOpen] = useState(0);
  return (
    <section id="expertises" aria-label="Expertises" className="scroll-mt-14 px-6 pb-[max(64px,6vw)] pt-[max(36px,3.2vw)] max-[640px]:px-4">
      <Reveal>
        <h2 className="m-0 mb-4 flex justify-between text-[13px] font-normal text-mute">
          Expertises
          <span className="tabular-nums">{String(skills.length).padStart(2, "0")}</span>
        </h2>
      </Reveal>
        <ul className="m-0 list-none border-t border-line p-0">
          {skills.map((e, i) => {
            const on = open === i;
            return (
              <motion.li
                key={e.n}
                className="border-b border-line"
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "0px 0px -30px 0px" }}
                transition={{ duration: 0.9, ease: [0.2, 0.7, 0.1, 1], delay: i * 0.07 }}
              >
                <button
                  type="button"
                  aria-expanded={on}
                  aria-controls={`xp-${i}`}
                  onClick={() => setOpen(on ? -1 : i)}
                  data-umami-event={on ? undefined : "expertise-deplier"}
                  data-umami-event-expertise={e.name}
                  data-cur={on ? "fermer" : "lire"}
                  className="xp-btn flex min-h-11 w-full items-center justify-between gap-4 py-[max(18px,1.5vw)] text-left"
                >
                  <span className="xp-title flex items-center gap-3 font-serif text-[max(30px,3.9vw)] font-normal leading-none tracking-[-0.015em]">
                    {e.name}
                  </span>
                  <span aria-hidden="true" className="grid size-11 flex-none items-center justify-items-end"><span className={`faq-plus ${on ? "is-open" : ""}`} /></span>
                </button>
                <div id={`xp-${i}`} className={`xp-a ${on ? "is-open" : ""}`}>
                  <div>
                    <Link
                      href={e.href}
                      tabIndex={on ? 0 : -1}
                      data-cur="voir"
                      data-umami-event="expertise-voir"
                      data-umami-event-expertise={e.name}
                      aria-label={`${e.name} : voir ${e.cases}`}
                      className="group flex items-start gap-[max(16px,2vw)] pb-[max(20px,1.8vw)] max-[640px]:flex-col max-[640px]:gap-3"
                    >
                      <span className="xp-thumb relative block aspect-[16/10] w-[min(280px,22vw)] flex-none overflow-hidden rounded-[6px] bg-line max-[640px]:w-full">
                        {e.image && <Image src={e.image} alt="" fill sizes="(max-width: 640px) 100vw, 280px" className="object-cover" />}
                      </span>
                      <span className="xp-text flex flex-col gap-1">
                        <span className="text-[15px] leading-[1.4]">{rich(e.text)}</span>
                        <span className="inline-flex items-center gap-1.5 text-mute transition-colors duration-300 group-hover:text-fg">
                          {e.cases}
                          <span aria-hidden="true" className="inline-block transition-transform duration-500 ease-out-soft group-hover:translate-x-1">→</span>
                        </span>
                      </span>
                    </Link>
                  </div>
                </div>
              </motion.li>
            );
          })}
        </ul>

    </section>
  );
}
