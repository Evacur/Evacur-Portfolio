"use client";

import { Analytics } from "@vercel/analytics/next";
import { useEffect, useState } from "react";

// Exclusion de mes propres visites, navigateur par navigateur.
// /?notrack=1 désactive le suivi sur ce navigateur, /?notrack=0 le réactive.
// La clé « umami.disabled » est lue directement par le script Umami ; Vercel la lit dans beforeSend.
const KEY = "umami.disabled";

function readParam(): string | null {
  try {
    return new URLSearchParams(window.location.search).get("notrack");
  } catch {
    return null;
  }
}

function isExcluded(): boolean {
  const p = readParam();
  if (p === "1") return true;
  if (p === "0") return false;
  try {
    return window.localStorage.getItem(KEY) === "1";
  } catch {
    return false;
  }
}

// Filet de sécurité pour Umami (data-before-send) : rien n'est envoyé si le navigateur est exclu.
if (typeof window !== "undefined") {
  (window as unknown as { umamiBeforeSend: (type: string, payload: unknown) => unknown }).umamiBeforeSend = (_type, payload) =>
    isExcluded() ? false : payload;
}

export function Tracking() {
  const [notice, setNotice] = useState<string | null>(null);

  useEffect(() => {
    const p = readParam();
    if (p !== "1" && p !== "0") return;
    try {
      if (p === "1") window.localStorage.setItem(KEY, "1");
      else window.localStorage.removeItem(KEY);
    } catch {
      return;
    }
    const url = new URL(window.location.href);
    url.searchParams.delete("notrack");
    window.history.replaceState(window.history.state, "", url.pathname + url.search + url.hash);
    setNotice(p === "1" ? "Statistiques désactivées sur ce navigateur" : "Statistiques réactivées sur ce navigateur");
    const t = window.setTimeout(() => setNotice(null), 4000);
    return () => window.clearTimeout(t);
  }, []);

  return (
    <>
      <Analytics beforeSend={(event) => (isExcluded() ? null : event)} />
      {notice && (
        <div role="status" className="fixed bottom-4 left-1/2 z-50 -translate-x-1/2 rounded-full border border-line bg-bg px-4 py-2 font-mono text-[11px] text-fg">
          {notice}
        </div>
      )}
    </>
  );
}
