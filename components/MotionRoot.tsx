"use client";

import { MotionConfig } from "motion/react";
import { SmoothScroll } from "./SmoothScroll";

/** Coupe les animations Motion quand le système demande moins de mouvement, et lance le scroll fluide. */
export function MotionRoot({ children }: { children: React.ReactNode }) {
  return (
    <MotionConfig reducedMotion="user">
      <SmoothScroll />
      {children}
    </MotionConfig>
  );
}
