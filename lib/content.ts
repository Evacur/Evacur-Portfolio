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

// Les secteurs ne sont plus une section à part : ils sont glissés dans les descriptions. L'IA en tête.
export const expertises: Expertise[] = [
  { n: "01", name: "IA conversationnelle", image: "/projects/pulse-ia/01.webp", kind: "Sujet", text: "Bots et assistants pour la comptabilité, l'automobile et le voyage, outils connectés en MCP.", cases: "Pulse IA, Kleio", href: "/work/ia-conversationnelle", ai: true },
  { n: "02", name: "Discovery", image: "/projects/bim/02.webp", kind: "Compétence", text: "Comprendre le métier, tester tôt, décider sur des faits. Du retail de luxe aux cabinets d'expertise comptable.", cases: "Bim !, Livestore", href: "/work/produit-et-discovery", ai: true },
  { n: "03", name: "Design system", image: "/projects/bim/04.webp", kind: "Compétence", text: "Trois systèmes construits, dont celui d'un produit lancé de zéro en neuf mois.", cases: "Bim !, Cegid, Kleio", href: "/work/design-system" },
  { n: "04", name: "Sites vitrines", image: "/projects/gaspard-mariotte/01.webp", kind: "Compétence", text: "Des sites de marque, du mock à la mise en ligne.", cases: "Gaspard Mariotte, Vers le Sud, Kleio", href: "/work/sites-vitrines" },
  { n: "05", name: "Front-end", kind: "Compétence", text: "React, Next.js, Tailwind et animations, pour des PME et des startups.", cases: "Progemi, Laku", href: "/work/front-end" },
];

// Réponses tirées du profil Malt et de LinkedIn (novembre 2026)
export const faq = [
  { q: "Quel est ton TJM ?", a: "400 € HT par jour." },
  { q: "Quelle est ton expérience ?", a: "Cinq ans chez Cegid, de 2020 à 2025 : designer référent sur une application retail pour des grands groupes du luxe, de la cosmétique et du prêt-à-porter, puis principal designer d'un outil de comptabilité lancé de zéro en neuf mois. Depuis, en freelance sur des bots conversationnels et des SaaS avec IA." },
  { q: "Tu codes aussi ?", a: "Oui. Je développe des interfaces en production en Next.js et Tailwind, et j'ouvre des pull requests pour intégrer mes designs directement dans le code." },
  { q: "Tu sais travailler en équipe ?", a: "Chez Cegid, dans une équipe de 30 designers, j'ai coordonné jusqu'à 10 designers sur un même produit et j'étais le référent du design system. J'ai aussi été mentor UX Research pour des startups au Cegid Data Lab, à Station F." },
  { q: "Comment tu mènes la recherche ?", a: "Entretiens, ateliers de cadrage, tests utilisateurs et questionnaires in-app pour une discovery continue. Outils : Figma, Maze, Dovetail, Jira et Confluence." },
  { q: "Freelance, CDI, remote ?", a: "Freelance sur Malt, Supermalter noté 5/5, et ouvert à un poste. Basé à Paris, sur site ou en hybride." },
  { q: "Tu parles anglais ?", a: "Oui. Français natif, anglais et espagnol courants." },
  { q: "Quand es-tu dispo ?", a: "À partir de [mois]. Le premier échange de 30 min est offert." },
];

export const contact = {
  email: "[email pro]",
  availability: "Dispo dès [mois]",
  links: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/pablocuerva" },
    { label: "Malt", href: "https://www.malt.fr/profile/pablocuerva" },
    { label: "CV", href: "#" },
  ],
};
