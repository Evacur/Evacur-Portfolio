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
  /** Visuels du chapitre : une vraie image, ou une légende en attendant l'image. */
  media: Media[];
};

/** Une image (16:9) ou une vidéo en boucle dans /public, ou une simple légende tant qu'elle manque. */
export type Media =
  | string
  | { src: string; alt: string }
  | { video: string; poster: string; alt: string; ratio: string };

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

const shot = (src: string, alt: string) => ({ src: `/projects/${src}.webp`, alt });
const clip = (dir: string, alt: string, ratio: string, name = "video") => ({ video: `/projects/${dir}/${name}.mp4`, poster: `/projects/${dir}/${name}-poster.webp`, alt, ratio });

// Cas tirés du portfolio PDF (Portfolio-PabloCuerva.pdf, mai 2026)
const bim: Case = {
  slug: "bim",
  name: "Bim !",
  client: "EBP",
  year: "[année]",
  role: "Product designer référent",
  duration: "9 mois",
  chapters: [
    {
      title: "Contexte",
      lede: "Une application desktop de gestion, pensée avec une logique startup.",
      body: [
        "J'ai piloté la conception de l'application en tant que designer référent. J'ai fait le pont entre deux équipes de dix designers pour garder une vision produit cohérente pendant les neuf mois de développement.",
      ],
      media: [shot("bim/02", "Bim ! : tableau de bord, factures et aperçu d'une facture")],
    },
    {
      title: "Problème et recherche",
      lede: "Discovery, entretiens et ateliers de cadrage.",
      body: [
        "Le projet a débuté par une phase de discovery approfondie et des entretiens utilisateurs, puis des ateliers de cadrage stratégiques pour définir les fonctionnalités clés.",
      ],
      media: [shot("bim/01", "Bim ! sur mobile : cartes, accueil et parcours de démarrage")],
    },
    {
      title: "Décisions",
      lede: "Un design system créé de zéro, et l'IA pour saisir plus vite.",
      body: [
        "J'ai créé un design system complet pour structurer toute l'interface. Ce socle a permis de concevoir des maquettes centrées sur la simplicité et l'accessibilité, sans ralentir l'exécution.",
        "Sur mobile, on peut dicter un devis à l'IA ou le saisir à la main.",
      ],
      media: [
        shot("bim/06", "Dicter un devis via l'IA, puis le créer en un clic"),
        shot("bim/03", "Fiche article et catalogue"),
      ],
    },
    {
      title: "Résultats",
      lede: "Ce qui a changé pour les utilisateurs.",
      body: ["[Les résultats mesurés.]"],
      media: [shot("bim/05", "Bim ! by Cegid : cartes, transactions et identité")],
    },
  ],
};

const bimDesignSystem: Case = {
  ...bim,
  slug: "bim-design-system",
  chapters: [
    {
      title: "Contexte",
      lede: "Un design system créé de zéro pour toute l'interface.",
      body: ["Il fallait un socle commun aux deux équipes de dix designers, pour livrer vite sans perdre en cohérence."],
      media: [shot("bim/04", "Composants du design system Bim ! : tabs, boutons, sélection, statuts")],
    },
    {
      title: "Problème et recherche",
      lede: "Ce qui bloquait, et comment je l'ai vérifié.",
      body: ["[Le problème, la recherche menée, ce qu'elle a montré.]"],
      media: ["Inventaire de l'existant"],
    },
    {
      title: "Décisions",
      lede: "Simplicité et accessibilité d'abord.",
      body: ["[Les choix de tokens, de composants et de documentation.]"],
      media: [shot("bim/05", "Le système appliqué : cartes, transactions, navigation mobile")],
    },
    {
      title: "Résultats",
      lede: "Ce qui a changé pour les équipes.",
      body: ["[Les résultats mesurés.]"],
      media: [shot("bim/03", "Fiche article et catalogue construits avec le système")],
    },
  ],
};

const livestore: Case = {
  slug: "livestore",
  name: "Livestore",
  client: "Cegid",
  year: "[année]",
  role: "Lead product designer",
  duration: "2 ans",
  chapters: [
    {
      title: "Contexte",
      lede: "Une progressive web app en marque blanche pour le retail.",
      body: [
        "Designer référent sur Livestore, déployée pour plusieurs grandes marques internationales : LVMH, Zadig & Voltaire, Pomellato, Balibaris, Palais des Thés…",
        "L'application sert aux vendeurs, aux responsables de magasin et aux directeurs de réseau.",
      ],
      media: [
        clip("livestore", "La caisse Livestore sur mobile", "16 / 9"),
        shot("livestore/01", "Livestore aux couleurs de plusieurs marques"),
      ],
    },
    {
      title: "Problème et recherche",
      lede: "Améliorer la qualité de service en point de vente.",
      body: ["L'objectif : améliorer la qualité de service en magasin et l'efficacité opérationnelle.", "[La recherche menée, ce qu'elle a montré.]"],
      media: [shot("livestore/02", "Panier, actions et fiche client sur mobile")],
    },
    {
      title: "Décisions",
      lede: "Les choix clés, et ce qu'on a écarté.",
      body: ["[Les décisions, les alternatives écartées et pourquoi.]"],
      media: [shot("livestore/03", "Livestore sur desktop : panier, actions et catalogue")],
    },
    {
      title: "Résultats",
      lede: "Ce qui a changé pour les vendeurs.",
      body: ["[Les résultats mesurés.]"],
      media: ["Écran final en production"],
    },
  ],
};

const pulse: Case = {
  slug: "pulse-ia",
  name: "Pulse IA",
  client: "Cegid",
  year: "[année]",
  role: "Product designer",
  duration: "1 an",
  chapters: [
    {
      title: "Contexte",
      lede: "La comptabilité au quotidien, simplifiée par l'IA.",
      body: [
        "Une solution desktop de comptabilité pour les TPE, les auto-entrepreneurs et les dirigeants de petites structures, avec des fonctionnalités avancées intégrant l'IA.",
      ],
      media: [
        shot("pulse-ia/03", "Une équipe d'assistants : Shop, Fisca, Devis Fact et Compta"),
        clip("pulse-ia", "Chaque assistant s'ouvre en carte et se lance d'un clic", "1600 / 1000", "video-2"),
        clip("pulse-ia", "L'assistant projette la trésorerie sur six mois et propose des actions", "1042 / 584"),
        shot("pulse-ia/02", "Pulse IA : assistant, audit et équipe d'assistants"),
      ],
    },
    {
      title: "Problème et recherche",
      lede: "Une discovery approfondie avant de dessiner.",
      body: ["Recherches utilisateurs, entretiens et ateliers.", "[Ce que la recherche a montré.]"],
      media: ["Entretiens utilisateurs"],
    },
    {
      title: "Décisions",
      lede: "Un travail complet sur l'UX et l'UI.",
      body: ["Pour une expérience fluide et accessible.", "[Les décisions clés et ce qu'on a écarté.]"],
      media: [shot("pulse-ia/01", "Audit de l'entreprise, balance âgée et réponses de l'assistant")],
    },
    {
      title: "Résultats",
      lede: "Ce qui a changé pour les dirigeants.",
      body: ["[Les résultats mesurés.]"],
      media: ["Écran final en production"],
    },
  ],
};

const gaspard: Case = {
  slug: "gaspard-mariotte",
  name: "Gaspard Mariotte",
  client: "Gaspard Mariotte",
  year: "[année]",
  role: "UI designer",
  duration: "1 mois",
  chapters: [
    {
      title: "Contexte",
      lede: "Le site d'un artiste muraliste, avec une boutique.",
      body: ["Un site 100 % sur mesure en Next.js, avec une partie e-commerce intégrée."],
      media: [
        clip("gaspard-mariotte", "Navigation dans les peintures murales", "1348 / 1280"),
        shot("gaspard-mariotte/01", "Gaspard Mariotte : peintures murales et projets"),
      ],
    },
    {
      title: "Problème et recherche",
      lede: "Mettre en valeur le travail mural.",
      body: ["L'interface met les œuvres au premier plan, avec une navigation fluide et un parcours d'achat simple."],
      media: [shot("gaspard-mariotte/02", "Page projet : Biennale d'art contemporain de Lyon")],
    },
    {
      title: "Décisions",
      lede: "Un back-office que l'artiste gère seul.",
      body: ["Un back-office sur mesure avec Sanity, pour que l'artiste gère facilement ses œuvres, ses projets et ses ventes en ligne."],
      media: ["Back-office Sanity"],
    },
    {
      title: "Résultats",
      lede: "Ce qui a changé pour l'artiste.",
      body: ["[Les résultats.]"],
      media: ["Site en ligne"],
    },
  ],
};

const versLeSud: Case = (() => {
  const c = placeholder("Vers le Sud");
  c.chapters[0] = { ...c.chapters[0], media: [{ src: "/projects/vers-le-sud/01.webp", alt: "Vers le Sud : la page d'accueil et sa boussole" }] };
  return c;
})();

export const projects: Project[] = [
  {
    slug: "ia-conversationnelle", n: "01", title: "IA conversationnelle", kind: "Kleio · Pulse IA", year: "2 cas",
    pitch: "Assistants, chatbots et outils connectés en MCP.",
    cover: "/projects/pulse-ia/03.webp", tint: "#E4DEEA", ink: "#5B3F86",
    cases: [pulse, placeholder("Kleio", "Kleio")],
  },
  {
    slug: "produit-et-discovery", n: "02", title: "Produit et discovery", kind: "Bim ! · Livestore", year: "2 cas",
    pitch: "Facturation avec IA intégrée, encaissement et clienteling retail en marque blanche.",
    cover: "/projects/bim.webp", tint: "#DCE3EC", ink: "#2B4C7E",
    cases: [bim, livestore],
  },
  {
    slug: "design-system", n: "03", title: "Design system", kind: "Bim ! · Cegid · Kleio", year: "3 cas",
    pitch: "Trois systèmes construits, et comment chacun a été pensé.",
    cover: "/projects/bim/04.webp", tint: "#DEE5DE", ink: "#2F5D3F",
    cases: [bimDesignSystem, placeholder("Cegid", "Cegid"), placeholder("Kleio", "Kleio")],
  },
  {
    slug: "sites-vitrines", n: "04", title: "Sites vitrines", kind: "Gaspard Mariotte · Vers le Sud · Kleio", year: "3 cas",
    pitch: "Des sites de marque, du mock à la mise en ligne.",
    cover: "/projects/gaspard.webp", tint: "#ECE2D6", ink: "#7A4A2A",
    cases: [gaspard, versLeSud, placeholder("Kleio", "Kleio")],
  },
  {
    slug: "front-end", n: "05", title: "Front-end", kind: "Progemi · Laku", year: "2 cas",
    pitch: "React, Next.js et animations, codés par moi.",
    tint: "#EEE9D6", ink: "#6B5A1E",
    cases: [placeholder("Progemi", "Progemi"), placeholder("Laku")],
  },
];

/** Les images qui défilent dans les cards de l'accueil, chacune mène à son thème. */
export const heroShots: { src: string; slug: string; title: string }[] = [
  { src: "/projects/bim/02.webp", slug: "produit-et-discovery", title: "Bim !" },
  { src: "/projects/pulse-ia/03.webp", slug: "ia-conversationnelle", title: "Pulse IA" },
  { src: "/projects/livestore/01.webp", slug: "produit-et-discovery", title: "Livestore" },
  { src: "/projects/gaspard-mariotte/01.webp", slug: "sites-vitrines", title: "Gaspard Mariotte" },
  { src: "/projects/bim/04.webp", slug: "design-system", title: "Design system Bim !" },
  { src: "/projects/livestore/03.webp", slug: "produit-et-discovery", title: "Livestore" },
  { src: "/projects/pulse-ia/02.webp", slug: "ia-conversationnelle", title: "Pulse IA" },
  { src: "/projects/bim/06.webp", slug: "produit-et-discovery", title: "Bim !" },
  { src: "/projects/gaspard-mariotte/02.webp", slug: "sites-vitrines", title: "Gaspard Mariotte" },
  { src: "/projects/vers-le-sud/01.webp", slug: "sites-vitrines", title: "Vers le Sud" },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
