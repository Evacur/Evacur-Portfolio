"use client";

import { MotionConfig } from "motion/react";
import { projects } from "@/lib/projects";
import { Clock } from "./Clock";
import { SiteHeader } from "./SiteHeader";
import { Loader } from "./Loader";
import { ProjectList } from "./ProjectList";

const noop = () => {};
const corner = "absolute z-[5] inline-flex min-h-11 items-center px-6";

/** Work : un seul écran, sans scroll. La liste des expertises, au centre. */
export function WorkScreen() {
  return (
    <MotionConfig reducedMotion="user">
      <main className="relative h-dvh min-h-[560px] overflow-hidden">
        <Loader onDone={noop} />
        <h1 className="sr-only">Travaux de Pablo Cuerva, product designer à Paris</h1>

        {/* Haut : le même en-tête que les autres pages */}
        <SiteHeader current="work" className="absolute inset-x-0 top-0" />

        {/* Centre */}
        <ProjectList projects={projects} />

        {/* Bas */}
        <span className="absolute bottom-3 left-1/2 z-[5] inline-flex min-h-11 -translate-x-1/2 items-center gap-1 whitespace-nowrap text-mute max-[480px]:hidden">
          Product designer, Paris <Clock />
        </span>
        <span className={`${corner} bottom-3 right-0 text-mute`}>2026 ©</span>

      </main>
    </MotionConfig>
  );
}
