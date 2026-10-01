"use client";

import { useEffect, useState } from "react";

const fmt = () =>
  new Date().toLocaleTimeString("fr-FR", { hour: "2-digit", minute: "2-digit", timeZone: "Europe/Paris" });

/** Heure de Paris en direct (rendue après montage pour éviter un écart d'hydratation). */
export function Clock() {
  const [time, setTime] = useState<string | null>(null);
  useEffect(() => {
    setTime(fmt());
    const t = setInterval(() => setTime(fmt()), 15000);
    return () => clearInterval(t);
  }, []);
  return <time className="tabular-nums" suppressHydrationWarning>{time ?? "--:--"}</time>;
}
