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
  /** Sources publiques des données citées dans le chapitre. */
  sources?: { label: string; href: string }[];
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
  year: "2025",
  role: "Product designer référent",
  duration: "9 mois",
  chapters: [
    {
      title: "Contexte",
      lede: "Un outil de gestion pour les très petites entreprises, conçu de zéro en neuf mois.",
      body: [
        "Bim ! s'adresse aux dirigeants de TPE, aux indépendants et aux micro-entrepreneurs. Devis, factures, dépenses et compte professionnel sont réunis dans un même outil, sur mobile et sur ordinateur. Le produit est pensé pour le dirigeant lui-même, pas pour son comptable.",
        "Le calendrier réglementaire fixait l'échéance. Depuis le 1er septembre 2026, toute entreprise assujettie à la TVA doit pouvoir recevoir des factures électroniques. L'obligation d'en émettre s'applique aux TPE, aux PME et aux micro-entreprises au 1er septembre 2027. Une population peu outillée doit donc changer de pratique en peu de temps.",
        "En tant que designer référent, j'ai porté la vision produit et assuré la cohérence entre deux équipes de dix designers pendant les neuf mois de conception.",
      ],
      media: [shot("bim/02", "Bim ! : tableau de bord, factures et aperçu d'une facture")],
      sources: [
        { label: "Calendrier de la facture électronique, Cegid", href: "https://www.cegid.com/fr/facturation-electronique/facture-electronique-obligatoire/calendrier-facture-electronique/" },
      ],
    },
    {
      title: "Problème et recherche",
      lede: "Comprendre comment un dirigeant de TPE facture réellement, avant de dessiner.",
      body: [
        "Question de recherche : à quel moment et dans quelles conditions un indépendant produit-il un devis ou une facture, et qu'est-ce qui lui fait repousser cette tâche ?",
        "Méthode : une phase de discovery avec des entretiens utilisateurs auprès de dirigeants de TPE, puis des ateliers de cadrage avec le produit et la technique pour hiérarchiser les fonctionnalités. [Nombre d'entretiens, profils rencontrés, durée de la phase.]",
        "Constats : [les trois ou quatre enseignements qui ont orienté la conception, chacun relié à une décision.]",
      ],
      media: [shot("bim/01", "Bim ! sur mobile : cartes, accueil et parcours de démarrage")],
    },
    {
      title: "Décisions",
      lede: "Réduire le coût de saisie, et tenir la cohérence à l'échelle de vingt designers.",
      body: [
        "Saisie par la voix. Sur mobile, l'utilisateur dicte son devis et l'IA en structure le client, les lignes et les montants. La saisie manuelle reste disponible à chaque étape : l'utilisateur relit et corrige avant d'émettre, ce qui lui laisse le contrôle sur un document à valeur légale.",
        "Un design system créé de zéro. Tokens, composants et règles d'usage sont partagés par les deux équipes de design et par le développement. Ce socle a servi de référence unique pour la simplicité et l'accessibilité des maquettes, sans ralentir l'exécution.",
        "Un périmètre livré par modules. Le devis et la facture d'abord, parce que c'est le premier geste utile pour l'utilisateur. Les dépenses, le compte professionnel et le lien avec l'expert-comptable ensuite. [Ce qui a été écarté, et pourquoi.]",
      ],
      media: [
        shot("bim/06", "Dicter un devis via l'IA, puis le créer en un clic"),
        shot("bim/03", "Fiche article et catalogue"),
      ],
      sources: [
        { label: "Étude de cas Cegid, Theodo", href: "https://www.theodo.com/en-fr/client-stories/cegid-platform-saas-tpe" },
      ],
    },
    {
      title: "Résultats",
      lede: "Un produit lancé en 2025, de la première facture au compte professionnel.",
      body: [
        "Bim ! by Cegid couvre la création de devis et de factures par dictée ou saisie manuelle, le traitement des factures fournisseurs, la collecte des justificatifs par photo et la transmission des pièces à l'expert-comptable. L'éditeur annonce une facture créée en moins d'une minute.",
        "Début 2026, l'éditeur a annoncé le rapprochement avec Shine : l'application devient Shine Facture.",
        "[Mesures à compléter : taux de complétion du premier devis, temps médian de création, part des devis dictés, satisfaction.]",
      ],
      media: [shot("bim/05", "Bim ! by Cegid : cartes, transactions et identité")],
      sources: [
        { label: "Présentation du produit, bim.cegid.com", href: "https://bim.cegid.com/compte-pro/" },
      ],
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
