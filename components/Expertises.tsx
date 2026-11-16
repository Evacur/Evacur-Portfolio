import Link from "next/link";
import { expertises } from "@/lib/content";
import { Reveal } from "./Reveal";

/** Sujets, secteurs et compétences en une seule liste, noms en grand. */
export function Expertises() {
  return (
    <section aria-label="Expertises" className="px-6 py-[6vw]">
      <p className="m-0 mb-4 text-mute">Ce que je sais faire, et pour qui.</p>
      <Reveal>
        <ol className="m-0 list-none border-t border-line p-0">
          {expertises.map((e) => (
            <li key={e.n}>
              <Link
                href={e.href}
                className="xp-row grid grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] items-center gap-[3vw] border-b border-line py-[1.8vw] max-[640px]:grid-cols-1 max-[640px]:gap-2.5 max-[640px]:py-5"
              >
                <span className="xp-name flex items-center gap-3 text-[max(26px,3.6vw)] font-medium leading-none tracking-[-0.035em]">
                  {e.name}
                  {e.ai && <span className="rounded-full bg-fg px-1.5 py-[3px] text-[10px] font-medium leading-none tracking-[0.04em] text-bg">IA</span>}
                </span>
                <span className="grid grid-cols-[28px_1fr] gap-x-2.5 gap-y-0.5">
                  <span className="text-mute tabular-nums">{e.n}</span>
                  <span className="text-mute">{e.kind}</span>
                  <span className="col-start-2">{e.text}</span>
                  <span className="col-start-2 text-mute">{e.cases} →</span>
                </span>
              </Link>
            </li>
          ))}
        </ol>
      </Reveal>
    </section>
  );
}
