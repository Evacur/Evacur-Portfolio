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
  | { src: string; alt: string; ratio?: string }
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
  /** "recherche" : texte d'abord, résultats en bas. "visuel" : trois textes courts puis les écrans. "rangs" : contexte, problème et choix, chacun avec son écran à droite. */
  layout: "recherche" | "visuel" | "rangs";
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
        "L'enjeu était aussi interne : installer chez Cegid une autre façon de concevoir, avec une squad dédiée et resserrée, sur le modèle d'une start-up. L'échéance était fixée dès janvier : présenter un produit complet au Congrès des experts-comptables, neuf mois plus tard, alors que la facture électronique se généralise (réception obligatoire au 1er septembre 2026, émission au 1er septembre 2027 pour les TPE et les micro-entreprises).",
        "En tant que designer référent, j'ai porté la vision produit et assuré la cohérence entre deux équipes de dix designers pendant les neuf mois de conception.",
      ],
      media: [shot("bim/02", "Bim ! : tableau de bord, factures et aperçu d'une facture")],
    },
    {
      title: "Problème et recherche",
      lede: "Produire un maximum d'hypothèses, puis les confronter au terrain en continu.",
      body: [
        "En amont, j'ai mené avec le manager UX des ateliers internes avec les directions produit et marketing. L'objectif n'était pas de décider, mais de formuler le plus grand nombre d'hypothèses d'usage, à valider ou à invalider ensuite.",
        "Une première vague d'études menée avec le lab de Station F a fourni des enseignements rapides sur une population difficile à atteindre : des dirigeants qui ne sont équipés d'aucun outil de facturation.",
        "La recherche s'est ensuite poursuivie en continu : environ une étude par mois, sous forme de tests de maquettes. Chaque cycle corrigeait la conception avant le développement et alimentait le suivant.",
      ],
      media: [shot("bim/01", "Bim ! sur mobile : cartes, accueil et parcours de démarrage")],
    },
    {
      title: "Décisions",
      lede: "Peu de fonctionnalités, mais les plus pertinentes : le principe de départ, et ce qu'il est devenu.",
      body: [
        "Sortir vite imposait un périmètre réduit : peu de fonctionnalités, retenues pour leur valeur d'usage immédiate, à commencer par le devis et la facture. Le produit s'appuie toutefois sur un écosystème de logiciels existants : réutiliser ces briques réduisait le coût et le délai, mais imposait de reprendre les fonctionnalités qui leur étaient liées. Le périmètre s'est donc élargi au fil du projet.",
        "Sur mobile, l'utilisateur dicte son devis et l'IA en structure le client, les lignes et les montants. La saisie manuelle reste disponible à chaque étape : l'utilisateur relit et corrige avant d'émettre, ce qui lui laisse le contrôle sur un document à valeur légale.",
        "Un design system a été créé de zéro : tokens, composants et règles d'usage sont partagés par les deux équipes de design et par le développement. Il a servi de référence unique pour la simplicité et l'accessibilité des maquettes.",
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
        "Bim ! by Cegid couvre la création de devis et de factures par dictée ou saisie manuelle, le traitement des factures fournisseurs, la collecte des justificatifs par photo et la transmission des pièces à l'expert-comptable.",
        "L'ambition initiale, un produit minimal et radicalement nouveau, s'est atténuée à mesure que le périmètre s'élargissait. Le résultat est plus structuré et plus classique que prévu.",
        "Dans un grand groupe, le périmètre se protège comme le calendrier : par un arbitrage explicite dès le cadrage, et par des critères d'entrée pour chaque fonctionnalité ajoutée.",
      ],
      media: [{ ...shot("bim/08", "Accueil, compte restreint, liste des devis et fin de la période d'essai sur mobile"), ratio: "1418 / 710" }],
    },
  ],
};

const bimDesignSystem: Case = {
  ...bim,
  slug: "bim-design-system",
  role: "Référent design system",
  chapters: [
    {
      title: "Contexte",
      lede: "Un design system créé de zéro, hors de la charte graphique de Cegid.",
      body: [
        "Repartir de zéro répondait à un objectif de positionnement : s'émanciper de la charte graphique de Cegid pour s'adresser à une cible que la marque ne touchait pas, avec un design plus contemporain.",
        "Le travail a associé une illustratrice et un UX writer, afin que l'interface, les contenus et le marketing portent la même identité.",
      ],
      media: [shot("bim/04", "Composants du design system Bim ! : tabs, boutons, sélection, statuts")],
    },
    {
      title: "Problème et recherche",
      lede: "Une direction artistique à valider, puis une équipe qui grandit plus vite que ses règles.",
      body: [
        "Plusieurs directions artistiques ont été soumises à des tests quantitatifs et qualitatifs, pour identifier celle qui parlait le plus aux cibles.",
        "Les premières bases ont été posées à deux designers. L'arrivée d'autres designers, alors que la direction artistique était encore en cours de définition, a produit des écarts : chacun appliquait sa propre interprétation.",
        "Le modèle de départ était collaboratif : chaque designer créait ses composants et les versait dans la bibliothèque Figma. À dix designers, ce fonctionnement multipliait les doublons et les variantes.",
      ],
      media: [{ ...shot("bim/07", "Bannières illustrées du calendrier, en composants desktop et mobile dans Figma"), ratio: "1397 / 1642" }],
    },
    {
      title: "Décisions",
      lede: "Passer d'une contribution ouverte à une gouvernance par un référent.",
      body: [
        "J'ai été désigné référent du design system. Je veillais à la cohérence visuelle du travail des dix designers et j'arbitrais l'entrée de chaque composant : création, fusion avec un composant existant, ou refus.",
        "J'ai formé les designers moins expérimentés à la création de composants, et j'assurais le lien direct avec le développeur full stack pour que la bibliothèque Figma et le code restent alignés.",
        "Résultat : une cohérence graphique sur l'ensemble du produit, et une application construite plus vite.",
      ],
      media: [shot("bim/05", "Le système appliqué : cartes, transactions, navigation mobile")],
    },
    {
      title: "Résultats",
      lede: "Une cohérence graphique sur tout le produit, et une application construite plus vite.",
      body: [
        "La gouvernance par un référent a rétabli la cohérence graphique sur l'ensemble du produit et accéléré la construction de l'application.",
      ],
      media: [shot("bim/03", "Fiche article et catalogue construits avec le système")],
    },
  ],
};

const livestore: Case = {
  slug: "livestore",
  name: "Livestore",
  client: "Cegid",
  year: "2025",
  role: "Lead product designer",
  duration: "2 ans",
  chapters: [
    {
      title: "Contexte",
      lede: "Une application de vente en magasin en marque blanche, et un défaut d'adoption à expliquer.",
      body: [
        "Livestore est une progressive web app en marque blanche pour le retail. Elle réunit le clienteling et l'encaissement, et sert aux vendeurs, aux responsables de magasin et aux directeurs de réseau. Elle est déployée chez plusieurs grandes marques internationales : LVMH, Zadig & Voltaire, Pomellato, Balibaris, Palais des Thés.",
        "L'adoption restait faible dans plusieurs enseignes. En tant que designer référent, ma mission était d'en identifier les causes, puis de concevoir les améliorations.",
        "Le produit était porté par deux équipes distinctes, l'une pour le clienteling, l'autre pour l'encaissement, chacune avec son product manager, son product owner et ses développeurs. Le design était le rôle commun aux deux.",
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
        "Hypothèse : dans le retail, l'adoption dépend moins de l'ergonomie des écrans que de l'adéquation du produit à la situation de travail. Pour la vérifier, j'ai mené du shadowing et de l'observation dans douze magasins du luxe, du haut de gamme et du mass market, auprès de vendeurs et de managers. L'étude portait sur l'usage réel du logiciel, et non sur l'usage déclaré.",
        "Constat principal : le type d'appareil freinait l'usage. Beaucoup d'enseignes équipaient leurs équipes de tablettes, alors que le vendeur a besoin d'un téléphone : il tient dans une poche et se manipule d'une main, pendant que l'autre présente le produit au client.",
        "Tap to Pay sur iPhone est arrivé en France en novembre 2023 et permet d'encaisser sans terminal de paiement. Il fallait tester ce mode d'encaissement avec les vendeurs avant de l'intégrer.",
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
        "Tous les composants ont été retravaillés pour fluidifier les parcours de vente et d'encaissement, et les adapter au contexte du point de vente. L'encaissement sans contact Tap to Pay sur iPhone a été testé, puis intégré au parcours des vendeurs.",
        "Le travail de conception a été mené avec l'équipe clienteling et l'équipe encaissement, afin que le vendeur retrouve les mêmes composants et les mêmes règles d'un module à l'autre.",
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
  year: "2025",
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
        "La question de recherche : quelles formes d'interaction rendent un assistant conversationnel utile pour une tâche comptable, au-delà de la réponse en texte ?",
        "La recherche a été continue, à raison d'environ une étude par mois, menée avec UserTesting et Maze. Le panel était conservé d'une étude à l'autre : les mêmes utilisateurs évaluaient les évolutions successives et disaient si le produit se rapprochait de leurs attentes.",
        "Un panel longitudinal mesure une progression perçue, là où un test isolé ne donne qu'un état à un instant donné.",
      ],
      media: ["Protocole de recherche continue"],
    },
    {
      title: "Décisions",
      lede: "Sortir du texte seul : des composants intégrés à la conversation.",
      body: [
        "L'assistant répond par un graphique que l'utilisateur peut modifier directement, sans reformuler sa demande.",
        "La conversation renvoie vers les écrans du produit et permet d'agir sans quitter le fil.",
        "Nous avons conçu et testé les premiers composants intégrés au chat, en comparant plusieurs manières de présenter une même réponse. Les versions retenues sont celles que le panel a validées d'une étude à l'autre.",
      ],
      media: [shot("pulse-ia/01", "Audit de l'entreprise, balance âgée et réponses de l'assistant")],
    },
    {
      title: "Résultats",
      lede: "Un produit sorti, adopté en interne et approuvé par ses bêta-testeurs.",
      body: [
        "Pulse IA a été mis en production et bien adopté en interne. Une large majorité des bêta-testeurs a approuvé le produit.",
        "Le sujet s'inscrit dans la durée : les composants conversationnels conçus ici servent de base aux itérations suivantes.",
      ],
      media: ["Écran final en production"],
    },
  ],
};

// Kleio : mission freelance, 2026. Les visuels restent à fournir.
const kleio: Case = {
  slug: "kleio",
  name: "Kleio",
  client: "Kleio",
  year: "2026",
  role: "Product designer freelance",
  duration: "6 à 7 mois",
  chapters: [
    {
      title: "Contexte",
      lede: "Un assistant conversationnel intégré aux sites des marques, à faire passer en V2.",
      body: [
        "Kleio fournit à des sites comme Orpi ou Selectour un widget intégré à leurs pages. Le visiteur y engage une conversation avec une IA, qui se poursuit ensuite dans l'interface de Kleio.",
        "Je suis intervenu en freelance en 2026, après une levée de fonds. Un premier designer avait posé les maquettes initiales. Ma mission était d'amener le produit à une V2 plus moderne et plus professionnelle, et de prendre en charge l'ensemble du design.",
      ],
      media: ["Le widget Kleio sur le site d'une marque"],
    },
    {
      title: "Problème et recherche",
      lede: "Retenir l'utilisateur après son premier message.",
      body: [
        "Des visiteurs quittaient la conversation après le premier message. Deux causes étaient à traiter : l'incertitude sur la nature de l'interlocuteur, et le délai avant de voir un premier produit.",
        "J'ai travaillé avec un AI researcher qui a analysé plusieurs centaines de milliers de conversations. Ce corpus a permis de construire des personas types, fondés sur l'intention exprimée dès le premier message : chercher une information, voir rapidement des offres, comparer.",
        "En complément de cette analyse quantitative, j'ai mis en place des tests utilisateurs avec Maze pour évaluer les parcours avant leur mise en production.",
      ],
      media: ["Personas issus de l'analyse des messages"],
    },
    {
      title: "Décisions",
      lede: "Rassurer, montrer vite, et adapter le ton à l'intention.",
      body: [
        "L'interface indique clairement à l'utilisateur qu'il échange avec une IA, et ce qu'il peut en attendre.",
        "La conversation affiche des produits le plus tôt possible, pour apporter une valeur concrète dès les premiers échanges.",
        "Dès le premier message, le système identifie le type d'utilisateur, puis adapte le ton et le contenu des réponses de l'IA pour proposer un échange plus personnalisé.",
      ],
      media: ["Premier message, réassurance et produits", "Réponses adaptées selon le persona"],
    },
    {
      title: "Résultats",
      lede: "Des clients signés, et des démonstrations produites plus vite.",
      body: [
        "Kleio a signé plusieurs clients sur la période, dont Selectour, Showroomprivé et Orpi.",
        "Les démonstrations commerciales ont été produites plus vite : j'intégrais moi-même les interfaces avec Claude Code, sans attendre un cycle de développement.",
        "Les objectifs d'engagement sont encore en cours de mesure : la mission se poursuit sur ce sujet.",
      ],
      media: ["La V2 en production"],
    },
  ],
};

const kleioDesignSystem: Case = {
  ...kleio,
  slug: "kleio-design-system",
  chapters: [
    {
      title: "Contexte",
      lede: "Structurer le design d'une start-up après sa levée de fonds.",
      body: [
        "À mon arrivée, le produit reposait sur les maquettes d'un premier designer, sans système partagé. J'ai pris en charge l'ensemble du design : le widget, l'application et le site.",
      ],
      media: ["L'interface avant le design system"],
    },
    {
      title: "Problème et recherche",
      lede: "Trois surfaces, aucune règle commune.",
      body: [
        "Le widget intégré chez les clients, l'application et le site évoluaient séparément. Sans référentiel, chaque écran demandait de nouvelles décisions et la cohérence graphique se dégradait.",
      ],
      media: ["Inventaire des composants"],
    },
    {
      title: "Décisions",
      lede: "Un seul système, dans Figma et dans le code.",
      body: [
        "J'ai construit le design system dans Figma et en code, pour que la maquette et le produit partagent les mêmes tokens et les mêmes composants.",
        "J'ai mis en place des process de design : une source unique, des règles d'usage, et un circuit de validation avant le développement.",
      ],
      media: ["Composants du design system Kleio"],
    },
    {
      title: "Résultats",
      lede: "Une cohérence graphique sur toutes les surfaces, et une intégration plus rapide.",
      body: [
        "Le système en code m'a permis d'intégrer directement des interfaces avec Claude Code, et de produire les démonstrations commerciales plus vite.",
      ],
      media: ["Le système appliqué au widget et à l'application"],
    },
  ],
};

const kleioSite: Case = {
  ...kleio,
  slug: "kleio-site",
  chapters: [
    {
      title: "Contexte",
      lede: "Le site d'une start-up B2B, à aligner sur sa V2.",
      body: [
        "Dans le cadre de ma mission chez Kleio, j'ai repris le site internet pour qu'il porte la même identité que le produit.",
      ],
      media: ["Page d'accueil du site Kleio"],
    },
    {
      title: "Problème et recherche",
      lede: "Ce qui bloquait, et comment je l'ai vérifié.",
      body: ["[Le problème du site existant, la recherche menée, ce qu'elle a montré.]"],
      media: ["Le site avant la refonte"],
    },
    {
      title: "Décisions",
      lede: "Le même design system que le produit.",
      body: [
        "Le site s'appuie sur le design system du produit, pour une cohérence graphique entre la promesse commerciale et l'interface réelle.",
      ],
      media: ["Pages clés du site"],
    },
    {
      title: "Résultats",
      lede: "Ce qui a changé pour les visiteurs.",
      body: [],
      media: ["Le site en ligne"],
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
        { ...shot("gaspard-mariotte/site-02", "Créations : l'entrée de la catégorie Murs"), ratio: "2880 / 1800" },
        { ...shot("gaspard-mariotte/site-03", "Murs : la liste des peintures murales"), ratio: "2880 / 1800" },
      ],
    },
    {
      title: "Problème et recherche",
      lede: "Mettre en valeur le travail mural.",
      body: ["L'interface met les œuvres au premier plan, avec une navigation fluide et un parcours d'achat simple."],
      media: [
        { ...shot("gaspard-mariotte/site-05", "Collaborations : la grille des projets"), ratio: "2880 / 1800" },
        { ...shot("gaspard-mariotte/site-10", "Page exposition : Asilah"), ratio: "2880 / 1800" },
      ],
    },
    {
      title: "Décisions",
      lede: "Un back-office que l'artiste gère seul.",
      body: ["Un back-office sur mesure avec Sanity, pour que l'artiste gère facilement ses œuvres, ses projets et ses ventes en ligne."],
      media: [
        { ...shot("gaspard-mariotte/site-13", "Boutique : les œuvres en vente"), ratio: "2880 / 1800" },
        clip("gaspard-mariotte", "Navigation dans les peintures murales", "1348 / 1280"),
      ],
    },
    {
      title: "Résultats",
      lede: "Ce qui a changé pour l'artiste.",
      body: [],
      media: [
        { ...shot("gaspard-mariotte/site-18", "Créations sur mobile"), ratio: "1170 / 2532" },
        { ...shot("gaspard-mariotte/site-20", "Boutique sur mobile"), ratio: "1170 / 2532" },
      ],
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
    slug: "ia-conversationnelle", layout: "recherche", n: "01", title: "IA conversationnelle", kind: "Kleio · Pulse IA", year: "2 cas",
    pitch: "Assistants, chatbots et outils connectés en MCP.",
    cover: "/projects/pulse-ia/03.webp", tint: "#E4DEEA", ink: "#5B3F86",
    cases: [pulse, kleio],
  },
  {
    slug: "produit-et-discovery", layout: "recherche", n: "02", title: "Produit et discovery", kind: "Bim ! · Livestore", year: "2 cas",
    pitch: "Facturation avec IA intégrée, encaissement et clienteling retail en marque blanche.",
    cover: "/projects/bim.webp", tint: "#DCE3EC", ink: "#2B4C7E",
    cases: [bim, livestore],
  },
  {
    slug: "design-system", layout: "rangs", n: "03", title: "Design system", kind: "Bim ! · Cegid · Kleio", year: "3 cas",
    pitch: "Trois systèmes construits, et comment chacun a été pensé.",
    cover: "/projects/bim/04.webp", tint: "#DEE5DE", ink: "#2F5D3F",
    cases: [bimDesignSystem, placeholder("Cegid", "Cegid"), kleioDesignSystem],
  },
  {
    slug: "sites-vitrines", layout: "visuel", n: "04", title: "Sites vitrines", kind: "Gaspard Mariotte · Vers le Sud · Kleio", year: "3 cas",
    pitch: "Des sites de marque, du mock à la mise en ligne.",
    cover: "/projects/gaspard.webp", tint: "#ECE2D6", ink: "#7A4A2A",
    cases: [gaspard, versLeSud, kleioSite],
  },
  {
    slug: "front-end", layout: "visuel", n: "05", title: "Front-end", kind: "Progemi · Laku", year: "2 cas",
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
