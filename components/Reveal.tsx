"use client";

import { motion } from "motion/react";

/** Monte légèrement à l'entrée dans l'écran. Part d'un état déjà lisible, jamais de zéro. */
export function Reveal({ children, className, delay = 0 }: { children: React.ReactNode; className?: string; delay?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0.3, y: 18 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -40px 0px" }}
      transition={{ duration: 0.9, ease: [0.2, 0.7, 0.1, 1], delay }}
    >
      {children}
    </motion.div>
  );
}
