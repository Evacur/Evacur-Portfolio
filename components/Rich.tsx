import { Fragment, type ReactNode } from "react";

/** Texte courant avec **gras** et *italique* : le gras passe en couleur de texte pour ressortir sur le gris. */
export function rich(text: string): ReactNode {
  return text.split(/(\*\*[^*]+\*\*|\*[^*]+\*)/g).map((part, i) => {
    if (part.startsWith("**")) return <strong key={i} className="font-medium text-fg">{part.slice(2, -2)}</strong>;
    if (part.startsWith("*")) return <em key={i}>{part.slice(1, -1)}</em>;
    return <Fragment key={i}>{part}</Fragment>;
  });
}
