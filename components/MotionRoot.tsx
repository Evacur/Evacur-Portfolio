"use client";

import { MotionConfig } from "motion/react";

/** Coupe les animations Motion quand le système demande moins de mouvement. */
export function MotionRoot({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}
