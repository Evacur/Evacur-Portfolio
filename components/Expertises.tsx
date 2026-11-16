import Link from "next/link";
import { expertises, type Expertise } from "@/lib/content";
import { Reveal } from "./Reveal";

const groups: { title: string; items: Expertise[] }[] = [
  { title: "Ce que je fais", items: expertises.filter((e) => e.kind !== "Secteur") },
  { title: "Pour qui", items: expertises.filter((e) => e.kind === "Secteur") },
];

/** Une seule colonne : les savoir-faire, puis les secteurs en dessous. */
export function Expertises() {
  return (
    <section aria-label="Expertises" className="flex flex-col gap-[max(56px,6vw)] px-6 py-[max(64px,6vw)] max-[640px]:px-4">
      {groups.map((g) => (
        <Reveal key={g.title}>
          <h2 className="m-0 mb-4 flex justify-between text-[13px] font-normal text-mute">
            {g.title}
            <span className="tabular-nums">{String(g.items.length).padStart(2, "0")}</span>
          </h2>
          <ol className="m-0 list-none border-t border-line p-0">
            {g.items.map((e, i) => (
              <li key={e.n}>
                <Link
                  href={e.href}
                  className="xp-row grid grid-cols-[28px_minmax(0,1.4fr)_minmax(0,1fr)] items-center gap-x-[2vw] border-b border-line py-[max(20px,1.6vw)] max-[760px]:grid-cols-[24px_minmax(0,1fr)] max-[760px]:items-start max-[760px]:gap-x-3 max-[760px]:gap-y-2"
                >
                  <span className="self-start pt-[0.5em] text-mute tabular-nums max-[760px]:pt-[5px]">{String(i + 1).padStart(2, "0")}</span>
                  <span className="xp-name flex items-center gap-3 text-[max(26px,3.2vw)] font-medium leading-none tracking-[-0.035em]">
                    {e.name}
                    {e.ai && <span className="rounded-full bg-fg px-1.5 py-[3px] text-[10px] font-medium leading-none tracking-[0.04em] text-bg">IA</span>}
                  </span>
                  <span className="grid gap-0.5 max-[760px]:col-start-2">
                    <span>{e.text}</span>
                    <span className="flex items-center gap-1.5 text-mute">
                      {e.cases}
                      <span className="xp-arrow inline-block">→</span>
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </Reveal>
      ))}
    </section>
  );
}
