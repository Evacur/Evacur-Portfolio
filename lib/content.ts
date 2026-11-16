/** Contenus de l'accueil. Tout ce qui est entre crochets reste à renseigner. */

export type Expertise = {
  n: string;
  name: string;
  kind: "Sujet" | "Secteur" | "Compétence";
  text: string;
  cases: string;
  /** Thème de Work vers lequel mène la ligne. */
  href: string;
  ai?: boolean;
  /** Vignette affichée quand la ligne s'ouvre. */
  image?: string;
};

// Sujets, secteurs et compétences mélangés, l'IA en tête.
export const expertises: Expertise[] = [
  { n: "01", name: "IA conversationnelle", image: "/projects/pulse-ia/01.webp", kind: "Sujet", text: "Assistants, chatbots, outils connectés en MCP.", cases: "Pulse IA, Kleio", href: "/work/ia-conversationnelle", ai: true },
  { n: "02", name: "Discovery", image: "/projects/bim/02.webp", kind: "Compétence", text: "Comprendre le métier, tester tôt, décider sur des faits.", cases: "Bim !, Livestore", href: "/work/produit-et-discovery", ai: true },
  { n: "03", name: "Retail", kind: "Secteur", text: "Encaissement et clienteling, du luxe à la grande distribution.", cases: "Livestore", href: "/work/produit-et-discovery" },
  { n: "04", name: "Design system", image: "/projects/bim/04.webp", kind: "Compétence", text: "Trois systèmes construits, et comment chacun a été pensé.", cases: "Bim !, Cegid, Kleio", href: "/work/design-system" },
  { n: "05", name: "Expertise comptable", kind: "Secteur", text: "Facturation, gestion et comptabilité pour cabinets et TPE.", cases: "Bim !, Pulse IA", href: "/work/produit-et-discovery" },
  { n: "06", name: "Sites vitrines", image: "/projects/gaspard-mariotte/01.webp", kind: "Compétence", text: "Des sites de marque, du mock à la mise en ligne.", cases: "Gaspard Mariotte, Vers le Sud, Kleio", href: "/work/sites-vitrines" },
  { n: "07", name: "PME et startups", kind: "Secteur", text: "Du premier écran au produit en ligne.", cases: "Progemi, Laku", href: "/work/front-end" },
  { n: "08", name: "Front-end", kind: "Compétence", text: "React, Next.js, animations.", cases: "Progemi, Laku", href: "/work/front-end" },
];

export const faq = [
  { q: "Quel est ton TJM ?", a: "[TJM] € HT par jour, dégressif selon la durée. Forfait possible pour un projet bien cadré." },
  { q: "Tu travailles en autonomie ?", a: "Oui, de la recherche à la mise en prod. Je sais aussi m'intégrer à une équipe produit en place." },
  { q: "Tu codes aussi ?", a: "Oui : React, Next.js, Tailwind. Je livre des maquettes ou directement le front." },
  { q: "Freelance, CDI, remote ?", a: "[Freelance et/ou CDI]. Basé à Paris, remote ou hybride." },
  { q: "Quand es-tu dispo ?", a: "À partir de [mois]. Le premier échange de 30 min est offert." },
];

export const contact = {
  email: "[email pro]",
  availability: "Dispo dès [mois]",
  links: [
    { label: "LinkedIn", href: "#" },
    { label: "Malt", href: "#" },
    { label: "CV", href: "#" },
  ],
};
