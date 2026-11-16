/**
 * Le travail est regroupé par thèmes. Chaque thème montre plusieurs cas concrets.
 * Tout ce qui est entre crochets reste à renseigner.
 */

export type Chapter = {
  title: string;
  /** Une phrase qui résume le chapitre. */
  lede: string;
  /** Le texte du chapitre, un paragraphe par entrée. */
  body: string[];
  /** Légendes des visuels du chapitre, en attendant les vraies images. */
  media: string[];
};

export type Case = {
  slug: string;
  name: string;
  client: string;
  year: string;
  role: string;
  duration: string;
  chapters: Chapter[];
};

export type Project = {
  slug: string;
  n: string;
  title: string;
  /** Les cas inclus, tels qu'affichés dans la liste Work. */
  kind: string;
  /** Colonne de droite de la liste : le nombre de cas. */
  year: string;
  pitch: string;
  /** Visuel de couverture dans /public (portrait 18:23). Sans visuel, un aperçu neutre s'affiche. */
  cover?: string;
  /** Teintes de l'aperçu neutre, en attendant les vraies captures. */
  tint: string;
  ink: string;
  cases: Case[];
};

const placeholder = (name: string, client = "[client]"): Case => ({
  slug: name.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, ""),
  name,
  client,
  year: "[année]",
  role: "[rôle]",
  duration: "[x mois]",
  chapters: [
    { title: "Contexte", lede: "Qui, quoi, pourquoi maintenant.", body: ["[Le produit, l'équipe, le moment.]"], media: ["Le produit au départ"] },
    { title: "Problème et recherche", lede: "Ce qui bloquait, et comment je l'ai vérifié.", body: ["[Le problème, la recherche menée, ce qu'elle a montré.]"], media: ["Entretiens utilisateurs", "Parcours avant, points de friction"] },
    { title: "Décisions", lede: "Les choix clés, et ce qu'on a écarté.", body: ["[Les décisions, les alternatives écartées et pourquoi.]"], media: ["Avant / après", "Détail"] },
    { title: "Résultats", lede: "Ce qui a changé pour les utilisateurs.", body: ["[Les résultats mesurés.]"], media: ["Écran final en production"] },
  ],
});

export const projects: Project[] = [
  {
    slug: "ia-conversationnelle", n: "01", title: "IA conversationnelle", kind: "Kleio · Pulse AI", year: "2 cas",
    pitch: "Assistants, chatbots et outils connectés en MCP.",
    tint: "#E4DEEA", ink: "#5B3F86",
    cases: [placeholder("Kleio", "Kleio"), placeholder("Pulse AI")],
  },
  {
    slug: "produit-et-discovery", n: "02", title: "Produit et discovery", kind: "Bim ! · Livestore", year: "2 cas",
    pitch: "Facturation avec IA intégrée, encaissement et clienteling retail en marque blanche.",
    cover: "/projects/bim.webp", tint: "#DCE3EC", ink: "#2B4C7E",
    cases: [placeholder("Bim !"), placeholder("Livestore")],
  },
  {
    slug: "design-system", n: "03", title: "Design system", kind: "Cegid · Kleio · Bim !", year: "3 cas",
    pitch: "Trois systèmes construits, et comment chacun a été pensé.",
    tint: "#DEE5DE", ink: "#2F5D3F",
    cases: [placeholder("Cegid", "Cegid"), placeholder("Kleio", "Kleio"), placeholder("Bim !")],
  },
  {
    slug: "sites-vitrines", n: "04", title: "Sites vitrines", kind: "Gaspard Mariotte · Kleio · Vers le Sud", year: "3 cas",
    pitch: "Des sites de marque, du mock à la mise en ligne.",
    cover: "/projects/gaspard.webp", tint: "#ECE2D6", ink: "#7A4A2A",
    cases: [placeholder("Gaspard Mariotte"), placeholder("Kleio", "Kleio"), placeholder("Vers le Sud")],
  },
  {
    slug: "front-end", n: "05", title: "Front-end", kind: "Progemi · Laku", year: "2 cas",
    pitch: "React, Next.js et animations, codés par moi.",
    tint: "#EEE9D6", ink: "#6B5A1E",
    cases: [placeholder("Progemi", "Progemi"), placeholder("Laku")],
  },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
