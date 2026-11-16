import Link from "next/link";
import { expertises, type Expertise } from "@/lib/content";
import { Reveal } from "./Reveal";

const columns: { title: string; items: Expertise[] }[] = [
  { title: "Ce que je fais", items: expertises.filter((e) => e.kind !== "Secteur") },
  { title: "Pour qui", items: expertises.filter((e) => e.kind === "Secteur") },
];

/** Deux colonnes : les savoir-faire à gauche, les secteurs à droite. */
export function Expertises() {
  return (
    <section aria-label="Expertises" className="px-6 py-[6vw]">
      <div className="grid grid-cols-2 gap-x-[4vw] gap-y-12 max-[760px]:grid-cols-1">
        {columns.map((col, ci) => (
          <Reveal key={col.title} delay={ci * 0.08}>
            <h2 className="m-0 mb-4 flex justify-between text-[13px] font-normal text-mute">
              {col.title}
              <span className="tabular-nums">{String(col.items.length).padStart(2, "0")}</span>
            </h2>
            <ol className="m-0 list-none border-t border-line p-0">
              {col.items.map((e, i) => (
                <li key={e.n}>
                  <Link href={e.href} className="xp-row grid grid-cols-[28px_1fr] gap-x-2.5 border-b border-line py-5">
                    <span className="pt-1 text-mute tabular-nums">{String(i + 1).padStart(2, "0")}</span>
                    <span className="grid gap-2">
                      <span className="xp-name flex items-center gap-3 text-[max(24px,2.4vw)] font-medium leading-none tracking-[-0.035em]">
                        {e.name}
                        {e.ai && <span className="rounded-full bg-fg px-1.5 py-[3px] text-[10px] font-medium leading-none tracking-[0.04em] text-bg">IA</span>}
                      </span>
                      <span>{e.text}</span>
                      <span className="xp-cases text-mute">{e.cases} →</span>
                    </span>
                  </Link>
                </li>
              ))}
            </ol>
          </Reveal>
        ))}
      </div>
    </section>
  );
}
