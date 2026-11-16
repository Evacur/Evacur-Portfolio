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
  client: "Cegid",
  year: "2025",
  role: "Product designer référent",
  duration: "9 mois",
  chapters: [
    {
      title: "Contexte",
      lede: "Une squad montée comme une start-up interne, et neuf mois pour livrer un produit de A à Z.",
      body: [
        "Bim ! s'adresse aux dirigeants de TPE, aux indépendants et aux micro-entrepreneurs, en particulier à ceux qui n'utilisent aucun outil de facturation. Le produit se positionne face à des acteurs installés comme Pennylane, Qonto ou Indy.",
        "L'enjeu était aussi interne : installer chez Cegid une autre façon de concevoir, avec une squad dédiée et resserrée, sur le modèle d'une start-up. L'échéance était fixée dès janvier : présenter un produit complet au Congrès des experts-comptables, neuf mois plus tard.",
        "Le calendrier réglementaire renforçait cette échéance. Depuis le 1er septembre 2026, toute entreprise assujettie à la TVA doit pouvoir recevoir des factures électroniques. L'obligation d'en émettre s'applique aux TPE, aux PME et aux micro-entreprises au 1er septembre 2027.",
        "En tant que designer référent, j'ai porté la vision produit et assuré la cohérence entre deux équipes de dix designers pendant les neuf mois de conception.",
      ],
      media: [shot("bim/02", "Bim ! : tableau de bord, factures et aperçu d'une facture")],
    },
    {
      title: "Problème et recherche",
      lede: "Produire un maximum d'hypothèses, puis les confronter au terrain en continu.",
      body: [
        "Cadrage. En amont, des ateliers internes avec les directions produit et marketing, que j'ai menés avec le manager UX. L'objectif n'était pas de décider, mais de formuler le plus grand nombre d'hypothèses d'usage, à valider ou à invalider ensuite.",
        "Discovery. Une première vague d'études menée avec le lab de Station F a fourni des enseignements rapides sur une population difficile à atteindre : des dirigeants qui ne sont équipés d'aucun outil de facturation.",
        "Recherche continue. Environ une étude par mois, sous forme de tests de maquettes, dans une logique de test and learn. Chaque cycle corrigeait la conception avant le développement et alimentait le suivant.",
        "[Nombre de participants par étude, et les trois ou quatre constats qui ont orienté la conception.]",
      ],
      media: [shot("bim/01", "Bim ! sur mobile : cartes, accueil et parcours de démarrage")],
    },
    {
      title: "Décisions",
      lede: "Peu de fonctionnalités, mais les plus pertinentes : le principe de départ, et ce qu'il est devenu.",
      body: [
        "Principe de départ. Sortir vite imposait un périmètre réduit : peu de fonctionnalités, retenues pour leur valeur d'usage immédiate, à commencer par le devis et la facture.",
        "Saisie par la voix. Sur mobile, l'utilisateur dicte son devis et l'IA en structure le client, les lignes et les montants. La saisie manuelle reste disponible à chaque étape : l'utilisateur relit et corrige avant d'émettre, ce qui lui laisse le contrôle sur un document à valeur légale.",
        "Un design system créé de zéro. Tokens, composants et règles d'usage sont partagés par les deux équipes de design et par le développement. Ce socle a servi de référence unique pour la simplicité et l'accessibilité des maquettes, sans ralentir l'exécution.",
        "Arbitrage. Le produit s'inscrit dans un écosystème de logiciels existants. S'appuyer sur ces briques réduisait le coût et le délai de développement, mais imposait de reprendre les fonctionnalités qui leur étaient liées. Le périmètre s'est donc élargi au fil du projet.",
      ],
      media: [
        shot("bim/06", "Dicter un devis via l'IA, puis le créer en un clic"),
        shot("bim/03", "Fiche article et catalogue"),
      ],
    },
    {
      title: "Résultats",
      lede: "Un produit lancé en 2025, et un enseignement sur la tenue du périmètre.",
      body: [
        "Bim ! by Cegid couvre la création de devis et de factures par dictée ou saisie manuelle, le traitement des factures fournisseurs, la collecte des justificatifs par photo et la transmission des pièces à l'expert-comptable. L'éditeur annonce une facture créée en moins d'une minute.",
        "Limite. L'ambition initiale, un produit minimal et radicalement nouveau, s'est atténuée à mesure que le périmètre s'élargissait. Le résultat est plus structuré et plus classique que prévu.",
        "Enseignement. Dans un grand groupe, le périmètre se protège comme le calendrier : par un arbitrage explicite dès le cadrage, et par des critères d'entrée pour chaque fonctionnalité ajoutée.",
        "[Mesures à compléter : taux de complétion du premier devis, temps médian de création, part des devis dictés, satisfaction.]",
      ],
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
      lede: "Une application de vente en magasin en marque blanche, et un défaut d'adoption à expliquer.",
      body: [
        "Livestore est une progressive web app en marque blanche pour le retail. Elle réunit le clienteling et l'encaissement, et sert aux vendeurs, aux responsables de magasin et aux directeurs de réseau. Elle est déployée chez plusieurs grandes marques internationales : LVMH, Zadig & Voltaire, Pomellato, Balibaris, Palais des Thés.",
        "Constat de départ : l'adoption restait faible dans plusieurs enseignes. En tant que designer référent, ma mission était d'en identifier les causes, puis de concevoir les améliorations.",
        "Organisation : deux équipes distinctes, l'une pour le clienteling, l'autre pour l'encaissement, chacune avec son product manager, son product owner et ses développeurs. Le design était le rôle commun aux deux.",
      ],
      media: [
        clip("livestore", "La caisse Livestore sur mobile", "16 / 9"),
        shot("livestore/01", "Livestore aux couleurs de plusieurs marques"),
      ],
    },
    {
      title: "Problème et recherche",
      lede: "Observer le logiciel là où il sert : sur la surface de vente.",
      body: [
        "Hypothèse. Dans le retail, l'adoption ne dépend pas seulement de l'ergonomie des écrans. Elle dépend de l'adéquation du produit à la situation de travail du vendeur et du manager.",
        "Méthode. Du shadowing et de l'observation dans douze magasins, auprès d'enseignes du luxe, du haut de gamme et du mass market. Les personnes observées étaient essentiellement des vendeurs et des managers de magasin. L'étude portait sur l'usage réel du logiciel au quotidien, et non sur l'usage déclaré.",
        "Constat principal. Le type d'appareil freinait l'usage. Beaucoup d'enseignes équipaient leurs équipes de tablettes, alors que le vendeur a besoin d'un téléphone : il tient dans une poche et se manipule d'une main, pendant que l'autre présente le produit au client.",
        "Facteur externe. Tap to Pay sur iPhone est arrivé en France en novembre 2023 et permet d'encaisser sans terminal de paiement. Il fallait tester ce mode d'encaissement avec les vendeurs avant de l'intégrer.",
      ],
      media: [shot("livestore/02", "Panier, actions et fiche client sur mobile")],
      sources: [
        { label: "Tap to Pay sur iPhone en France, Apple", href: "https://www.apple.com/fr/newsroom/2023/11/apple-introduces-tap-to-pay-on-iphone-in-france" },
      ],
    },
    {
      title: "Décisions",
      lede: "Une refonte complète du design et de l'ergonomie, pour des parcours plus fluides.",
      body: [
        "Refonte complète. Tous les composants ont été retravaillés pour fluidifier les parcours de vente et d'encaissement, et les adapter au contexte du point de vente.",
        "Tap to Pay. L'encaissement sans contact sur iPhone a été testé, puis intégré au parcours des vendeurs.",
        "Un seul produit pour deux équipes. Le travail de conception a été mené avec l'équipe clienteling et l'équipe encaissement, afin que le vendeur retrouve les mêmes composants et les mêmes règles d'un module à l'autre.",
        "[Les alternatives écartées, et pourquoi.]",
      ],
      media: [shot("livestore/03", "Livestore sur desktop : panier, actions et catalogue")],
    },
    {
      title: "Résultats",
      lede: "Une refonte bien reçue, qui a pesé dans une décision commerciale.",
      body: [
        "J'ai présenté la refonte à plusieurs clients. Pandora a signé à l'issue de cette présentation, en citant une application plus moderne et plus ergonomique comme facteur de décision.",
      ],
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
      lede: "Un produit conversationnel créé de zéro, pour la comptabilité des indépendants.",
      body: [
        "Pulse IA est une solution de comptabilité pour les auto-entrepreneurs, les professions libérales et les dirigeants de petites structures. Le produit a été créé de zéro au sein de Cegid, et j'y ai travaillé en tant que product designer.",
        "C'était la première interface conversationnelle conçue par l'entreprise. Les assistants généralistes comme ChatGPT entraient alors dans l'usage courant, mais les conventions d'un chat relié à des outils métier restaient à établir : afficher un graphique, le modifier, déclencher une action depuis la conversation.",
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
      lede: "Un panel d'utilisateurs suivi dans la durée, et une étude par mois.",
      body: [
        "Question de recherche. Quelles formes d'interaction rendent un assistant conversationnel utile pour une tâche comptable, au-delà de la réponse en texte ?",
        "Méthode. Une recherche continue, à raison d'environ une étude par mois, menée avec UserTesting et Maze. Le panel était conservé d'une étude à l'autre : les mêmes utilisateurs évaluaient les évolutions successives et disaient si le produit se rapprochait de leurs attentes.",
        "Intérêt du dispositif. Un panel longitudinal mesure une progression perçue, là où un test isolé ne donne qu'un état à un instant donné.",
      ],
      media: ["Protocole de recherche continue"],
    },
    {
      title: "Décisions",
      lede: "Sortir du texte seul : des composants intégrés à la conversation.",
      body: [
        "Graphiques éditables. L'assistant répond par un graphique que l'utilisateur peut modifier directement, sans reformuler sa demande.",
        "Liens et actions. La conversation renvoie vers les écrans du produit et permet d'agir sans quitter le fil.",
        "Composants conversationnels. Nous avons conçu et testé les premiers composants intégrés au chat, en comparant plusieurs manières de présenter une même réponse. Les versions retenues sont celles que le panel a validées d'une étude à l'autre.",
      ],
      media: [shot("pulse-ia/01", "Audit de l'entreprise, balance âgée et réponses de l'assistant")],
    },
    {
      title: "Résultats",
      lede: "Un produit sorti, adopté en interne et approuvé par ses bêta-testeurs.",
      body: [
        "Pulse IA a été mis en production et bien adopté en interne. Environ 80 % des bêta-testeurs ont approuvé le produit.",
        "Le sujet s'inscrit dans la durée : les composants conversationnels conçus ici servent de base aux itérations suivantes.",
      ],
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
