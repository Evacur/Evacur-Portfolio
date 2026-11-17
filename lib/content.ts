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
  /** Cadrage de la vignette (object-position), quand le centre ne montre pas la bonne zone. */
  position?: string;
};

// Les secteurs ne sont plus une section à part : ils sont glissés dans les descriptions. L'IA en tête.
export const expertises: Expertise[] = [
  { n: "01", name: "IA conversationnelle", image: "/projects/pulse-ia/03.webp", kind: "Sujet", text: "Des assistants qui tiennent la conversation : parcours, ton, cas d'erreur, et des **outils branchés en MCP**. Pour la comptabilité, l'automobile et le voyage.", cases: "Pulse IA, Kleio", href: "/work/ia-conversationnelle" },
  { n: "02", name: "Discovery", image: "/projects/livestore/01.webp", kind: "Compétence", text: "Deux projets menés chez Cegid : un outil de facturation et une application de vente en magasin. Pour chacun, vous verrez **le problème rencontré, la recherche menée et les choix faits**.", cases: "Bim !, Livestore", href: "/work/produit-et-discovery" },
  { n: "03", name: "Design system", image: "/projects/bim/07.webp", position: "50% 85%", kind: "Compétence", text: "Composants, tokens et documentation partagés entre design et dev. **Trois systèmes construits**, dont celui d'un produit lancé de zéro en neuf mois.", cases: "Bim !, Cegid, Kleio", href: "/work/design-system" },
  { n: "04", name: "Sites vitrines", image: "/projects/gaspard-mariotte/01.webp", kind: "Compétence", text: "Des sites de marque conçus et développés de bout en bout, **de la maquette à la mise en ligne**.", cases: "Gaspard Mariotte, Vers le Sud, Kleio", href: "/work/sites-vitrines" },
  { n: "05", name: "Front-end", image: "/projects/laku/01.webp", kind: "Compétence", text: "Du design au code qui tourne, avec Claude Code et Cursor. Des prototypes testables en quelques heures, puis des interfaces en **React, Next.js et Tailwind** pour des PME et des startups.", cases: "Laku, Progemi", href: "/work/front-end" },
];

export type FaqItem = { q: string; a: string; rows?: { when: string; where: string; what: string }[] };

// Réponses tirées du profil Malt et de LinkedIn (novembre 2026)
export const faq: FaqItem[] = [
  { q: "Quel est ton TJM ?", a: "Mon tarif est de **450 € HT par jour**. On peut en discuter pour une mission longue, et je travaille aussi au forfait quand le projet est bien cadré." },
  {
    q: "Quelle est ton expérience ?",
    a: "J'ai passé **cinq ans chez Cegid**, puis je me suis lancé en freelance.",
    rows: [
      { when: "Depuis 2025", where: "Freelance", what: "Je conçois des bots conversationnels et des SaaS avec IA." },
      { when: "2020 – 2025", where: "Cegid", what: "Principal designer d'un outil de comptabilité lancé de zéro en neuf mois." },
      { when: "", where: "", what: "Designer référent d'une application retail pour des groupes du luxe, de la cosmétique et du prêt-à-porter." },
    ],
  },
  { q: "Et le code ?", a: "Je ne tape plus le code à la main, comme beaucoup de monde aujourd'hui. Je le lis, je le comprends et je sais quoi demander. Je travaille avec Claude Code et Cursor, ce qui me permet d'avoir **un prototype qui tourne en quelques heures** et de le tester sur du vrai. J'ai fait ce site de cette façon." },
  { q: "Tu sais travailler en équipe ?", a: "Oui, et j'aime ça. Chez Cegid, dans une équipe de 30 designers, j'ai coordonné **jusqu'à 10 designers** sur un même produit et j'étais le **référent du design system**. J'ai aussi accompagné des startups comme mentor UX Research au Cegid Data Lab, à Station F." },
  { q: "Comment tu mènes la recherche ?", a: "Cela dépend du projet. Je pars de la question à laquelle on doit répondre, du temps disponible et des utilisateurs qu'on peut rencontrer, puis **je choisis la méthode adaptée**. Pour comprendre un métier, je fais des entretiens ou de l'observation sur le terrain. Pour cadrer, j'anime des ateliers. Pour vérifier une maquette, je fais des **tests utilisateurs**, et des questionnaires in-app quand le produit est en ligne. J'utilise Figma, Maze, Dovetail, Jira et Confluence." },
  { q: "Freelance, CDI, remote ?", a: "Je suis freelance sur Malt, **Supermalter noté 5/5**, et je reste ouvert à un poste. Je suis basé à Paris et je travaille sur site ou en hybride." },
  { q: "Tu parles anglais ?", a: "Oui, j'ai un **anglais professionnel (B2)**." },
  { q: "Quand es-tu dispo ?", a: "Je suis disponible **à partir de janvier 2027**. Le premier échange de 30 minutes est offert, on peut en profiter pour parler de votre projet." },
];

export const contact = {
  email: "cuervapbl@gmail.com",
  availability: "Dispo dès janvier 2027",
  links: [
    { label: "LinkedIn", href: "https://www.linkedin.com/in/pablocuerva" },
    { label: "Malt", href: "https://www.malt.fr/profile/pablocuerva" },
  ],
};
