/** Contenus de l'accueil. Tout ce qui est entre crochets reste à renseigner. */

export type Expertise = {
  n: string;
  name: string;
  kind: "Sujet" | "Secteur" | "Compétence";
  text: string;
  cases: string;
  /** Thème de Work vers lequel mène la ligne. */
  href: string;
  /** Vignette affichée quand la ligne s'ouvre. */
  image?: string;
};

// Les secteurs ne sont plus une section à part : ils sont glissés dans les descriptions. L'IA en tête.
export const expertises: Expertise[] = [
  { n: "01", name: "IA conversationnelle", image: "/projects/pulse-ia/03.webp", kind: "Sujet", text: "Des assistants qui tiennent la conversation : parcours, ton, cas d'erreur, et des outils branchés en MCP. Pour la comptabilité, l'automobile et le voyage.", cases: "Pulse IA, Kleio", href: "/work/ia-conversationnelle" },
  { n: "02", name: "Discovery", image: "/projects/bim/02.webp", kind: "Compétence", text: "Entretiens, ateliers et tests pour comprendre le métier avant de dessiner, puis trancher sur des faits. Du retail de luxe aux cabinets d'expertise comptable.", cases: "Bim !, Livestore", href: "/work/produit-et-discovery" },
  { n: "03", name: "Design system", image: "/projects/bim/04.webp", kind: "Compétence", text: "Composants, tokens et documentation partagés entre design et dev. Trois systèmes construits, dont celui d'un produit lancé de zéro en neuf mois.", cases: "Bim !, Cegid, Kleio", href: "/work/design-system" },
  { n: "04", name: "Sites vitrines", image: "/projects/gaspard-mariotte/01.webp", kind: "Compétence", text: "Des sites de marque conçus et développés de bout en bout, de la maquette à la mise en ligne.", cases: "Gaspard Mariotte, Vers le Sud, Kleio", href: "/work/sites-vitrines" },
  { n: "05", name: "Front-end", kind: "Compétence", text: "Du design au code qui tourne, avec Claude Code et Cursor. Des prototypes testables en quelques heures, puis des interfaces en React, Next.js et Tailwind pour des PME et des startups.", cases: "Progemi, Laku", href: "/work/front-end" },
];

export type FaqItem = { q: string; a: string; rows?: { when: string; where: string; what: string }[] };

// Réponses tirées du profil Malt et de LinkedIn (novembre 2026)
export const faq: FaqItem[] = [
  { q: "Quel est ton TJM ?", a: "450 € HT par jour, négociable pour une mission longue. Forfait possible pour un projet bien cadré." },
  {
    q: "Quelle est ton expérience ?",
    a: "Cinq ans chez Cegid, puis le freelance.",
    rows: [
      { when: "Depuis 2025", where: "Freelance", what: "Bots conversationnels et SaaS avec IA." },
      { when: "2020 – 2025", where: "Cegid", what: "Principal designer d'un outil de comptabilité lancé de zéro en neuf mois." },
      { when: "", where: "", what: "Designer référent d'une application retail pour des groupes du luxe, de la cosmétique et du prêt-à-porter." },
    ],
  },
  { q: "Et le code ?", a: "Je ne tape plus le code à la main (comme la majorité des gens aujourd'hui). Je le lis, je le comprends et je sais quoi demander. L'IA est au cœur de mon process, avec Claude Code et Cursor : un prototype qui tourne en quelques heures, testé sur du vrai. Ce site est fait comme ça." },
  { q: "Tu sais travailler en équipe ?", a: "Chez Cegid, dans une équipe de 30 designers, j'ai coordonné jusqu'à 10 designers sur un même produit et j'étais le référent du design system. J'ai aussi été mentor UX Research pour des startups au Cegid Data Lab, à Station F." },
  { q: "Comment tu mènes la recherche ?", a: "Entretiens, ateliers de cadrage, tests utilisateurs et questionnaires in-app pour une discovery continue. Outils : Figma, Maze, Dovetail, Jira et Confluence." },
  { q: "Freelance, CDI, remote ?", a: "Freelance sur Malt, Supermalter noté 5/5, et ouvert à un poste. Basé à Paris, sur site ou en hybride." },
  { q: "Tu parles anglais ?", a: "Oui. Français natif, anglais professionnel (B2)." },
  { q: "Quand es-tu dispo ?", a: "À partir de janvier 2027. Le premier échange de 30 min est offert." },
];

export const contact = {
  email: "cuervapbl@gmail.com",
  availability: "Dispo dès janvier 2027",
  links: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/pablocuerva" },
    { label: "Malt", href: "https://www.malt.fr/profile/pablocuerva" },
    { label: "CV", href: "#" },
  ],
};
