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
  /** Lien public vers le travail présenté, affiché sous le texte. */
  link?: { label: string; href: string };
};

/** Une image (16:9) ou une vidéo en boucle dans /public, ou une simple légende tant qu'elle manque. */
export type Media =
  | string
  | { src: string; alt: string; ratio?: string }
  | { video: string; poster: string; alt: string; ratio: string }
  /** Une animation de code générique, sans fichier. */
  | { code: true; alt: string; ratio: string };

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
      lede: "Neuf mois pour concevoir un outil de facturation complet, avec une squad dédiée.",
      body: [
        "Bim ! s'adresse aux dirigeants de TPE, aux indépendants et aux micro-entrepreneurs, en particulier à ceux qui n'utilisent aucun outil de facturation. Le produit se positionne face à des acteurs installés comme Pennylane, Qonto ou Indy.",
        "Cegid a monté pour ce projet une squad réduite, organisée comme une start-up. L'échéance était connue dès janvier : le produit devait être présenté au Congrès des experts-comptables neuf mois plus tard. La facture électronique devient obligatoire pour les TPE et les micro-entreprises (réception au 1er septembre 2026, émission au 1er septembre 2027).",
        "J'étais le designer référent. Je portais la vision produit et je veillais à la cohérence entre **deux équipes de dix designers** pendant les neuf mois de conception.",
      ],
      media: [shot("bim/02", "Bim ! : tableau de bord, factures et aperçu d'une facture")],
    },
    {
      title: "Problème et recherche",
      lede: "Des ateliers pour formuler les hypothèses, puis une étude par mois pour les tester.",
      body: [
        "J'ai d'abord animé avec le manager UX des ateliers avec les directions produit et marketing. Ils ont servi à lister un grand nombre d'hypothèses d'usage, que nous avons testées ensuite.",
        "Une première série d'études a été menée avec le **lab de Station F**. Elle a permis d'interroger rapidement des dirigeants qui n'utilisent aucun outil de facturation, une population difficile à recruter.",
        "La recherche a continué pendant tout le projet, avec **environ une étude par mois** sous forme de tests de maquettes. Les maquettes étaient corrigées après chaque test, avant le développement.",
      ],
      media: [shot("bim/01", "Bim ! sur mobile : cartes, accueil et parcours de démarrage")],
    },
    {
      title: "Décisions",
      lede: "Un périmètre réduit au départ, qui s'est élargi pendant le projet.",
      body: [
        "Pour sortir en neuf mois, nous avons retenu peu de fonctionnalités, en commençant par **le devis et la facture**. Le produit réutilise des logiciels existants de Cegid, ce qui réduisait le coût et le délai. En contrepartie, il a fallu reprendre les fonctionnalités liées à ces logiciels, et le périmètre s'est élargi.",
        "Sur mobile, **l'utilisateur dicte son devis**. L'IA remplit le client, les lignes et les montants. La saisie manuelle reste possible à chaque étape, et l'utilisateur relit et corrige avant d'émettre, car le document a une valeur légale.",
        "Nous avons créé un **design system de zéro**. Ses tokens, ses composants et ses règles d'usage sont partagés par les deux équipes de design et par les développeurs.",
      ],
      media: [
        shot("bim/06", "Dicter un devis via l'IA, puis le créer en un clic"),
        shot("bim/03", "Fiche article et catalogue"),
      ],
    },
    {
      title: "Résultats",
      lede: "Le produit est sorti en 2025, avec un périmètre plus large que prévu.",
      body: [
        "Bim ! by Cegid couvre la création de devis et de factures par dictée ou saisie manuelle, le traitement des factures fournisseurs, la collecte des justificatifs par photo et la transmission des pièces à l'expert-comptable.",
        "Nous visions au départ un produit minimal et très différent de l'existant. Avec l'élargissement du périmètre, le résultat est **plus classique que prévu**.",
        "J'en retiens qu'il faut **arbitrer le périmètre dès le cadrage** et fixer des critères pour chaque fonctionnalité ajoutée en cours de route.",
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
        "Bim ! s'adresse à une cible que la marque Cegid ne touchait pas. Nous sommes donc **sortis de la charte graphique de Cegid** pour proposer un design plus contemporain.",
        "Une illustratrice et un UX writer ont travaillé avec nous, pour que l'interface, les textes et le marketing aient la même identité.",
      ],
      media: [shot("bim/04", "Composants du design system Bim ! : tabs, boutons, sélection, statuts")],
    },
    {
      title: "Problème et recherche",
      lede: "La direction artistique n'était pas encore fixée quand l'équipe est passée de deux à dix designers.",
      body: [
        "Nous avons testé plusieurs directions artistiques auprès des cibles, avec des **tests quantitatifs et qualitatifs**, pour retenir celle qu'elles préféraient.",
        "Nous étions deux designers pour poser les premières bases. D'autres designers sont arrivés alors que la direction artistique était encore en cours de définition, et chacun l'appliquait à sa manière.",
        "Au départ, chaque designer créait ses composants et les ajoutait à la bibliothèque Figma. À dix designers, la bibliothèque s'est remplie de **doublons et de variantes**.",
      ],
      media: [{ ...shot("bim/07", "Bannières illustrées du calendrier, en composants desktop et mobile dans Figma"), ratio: "1397 / 1642" }],
    },
    {
      title: "Décisions",
      lede: "Un seul référent pour valider les composants.",
      body: [
        "J'ai été désigné **référent du design system**. Je vérifiais la cohérence visuelle du travail des dix designers. Pour chaque nouveau composant, je décidais de le créer, de le fusionner avec un composant existant ou de le refuser.",
        "J'ai **formé les designers moins expérimentés** à la création de composants. Je travaillais en direct avec le développeur full stack pour que la bibliothèque Figma et le code restent identiques.",
        "Le produit a retrouvé une cohérence graphique et l'application a été **construite plus vite**.",
      ],
      media: [shot("bim/05", "Le système appliqué : cartes, transactions, navigation mobile")],
    },
    {
      title: "Résultats",
      lede: "Un produit cohérent graphiquement, construit plus vite.",
      body: [
        "Avec un référent unique, le produit a retrouvé une cohérence graphique et l'application a été **construite plus vite**.",
      ],
      media: [],
    },
  ],
};

const cegidDesignSystem: Case = {
  slug: "cegid-design-system",
  name: "Cegid",
  client: "Cegid",
  year: "2020 – 2025",
  role: "Contributeur design system",
  duration: "En continu",
  chapters: [
    {
      title: "Contexte",
      lede: "Compose Design, le design system commun aux produits de Cegid.",
      body: [
        "Compose Design est le design system de Cegid. Il est **fondé sur Material Design** et sert à de nombreux produits, développés avec des frameworks différents.",
        "J'y ai contribué comme designer. J'ai **créé des composants et rédigé les guidelines** qui les documentent.",
      ],
      link: { label: "Voir Compose Design", href: "https://composedesign.ila.cegid.com/" },
      media: [{ ...shot("cegid-ds/01", "Compose Design : fondations, composants, patterns et templates"), ratio: "2614 / 1700" }],
    },
    {
      title: "Problème et recherche",
      lede: "Un système unique pour des produits et des frameworks différents.",
      body: [
        "La base Material imposait des règles strictes. Chaque composant suivait des règles de construction précises, et chaque guideline le même format de rédaction.",
        "Toutes les équipes n'utilisaient pas le design system. Elles travaillaient avec des frameworks différents, et il fallait **convaincre certaines d'entre elles** en leur montrant ce qu'il leur apportait.",
      ],
      media: [{ ...shot("cegid-ds/02", "Documentation du composant Buttons : aperçu, spécifications, guidelines et mobile"), ratio: "2614 / 1770" }],
    },
    {
      title: "Décisions",
      lede: "Un suivi dans Notion et des présentations régulières aux designers.",
      body: [
        "Nous suivions **dans Notion** les composants à produire, en cours et validés. Chaque composant était validé avant d'être publié.",
        "Nous présentions régulièrement les avancées et les questions en cours aux équipes de design, soit **une trentaine de designers**.",
      ],
      media: [],
    },
    { title: "Résultats", lede: "Un référentiel partagé par les équipes de design.", body: [], media: [] },
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
      lede: "Une application de vente en magasin, peu utilisée dans plusieurs enseignes.",
      body: [
        "Livestore est une *progressive web app* en marque blanche pour le retail. Elle réunit le clienteling et l'encaissement, et sert aux vendeurs, aux responsables de magasin et aux directeurs de réseau. Elle est déployée chez plusieurs grandes marques internationales du luxe, du prêt-à-porter et de la cosmétique.",
        "Plusieurs enseignes **utilisaient peu l'application**. J'étais le designer référent, et ma mission était de comprendre pourquoi puis de concevoir les améliorations.",
        "Deux équipes développaient le produit, une pour le clienteling et une pour l'encaissement. Chacune avait son product manager, son product owner et ses développeurs. Je travaillais avec les deux.",
      ],
      media: [
        clip("livestore", "La caisse Livestore sur mobile", "16 / 9"),
        shot("livestore/01", "Livestore aux couleurs de plusieurs marques"),
      ],
    },
    {
      title: "Problème et recherche",
      lede: "Douze magasins observés pour comprendre l'usage réel.",
      body: [
        "Mon hypothèse était que l'adoption dépendait surtout de la situation de travail du vendeur, plus que de l'ergonomie des écrans. J'ai fait du *shadowing* et de l'observation dans **douze magasins** du luxe, du haut de gamme et du mass market, auprès de vendeurs et de managers. J'ai observé ce qu'ils faisaient réellement avec le logiciel.",
        "Le premier frein était l'appareil. Beaucoup d'enseignes équipaient leurs vendeurs de tablettes. Or **un vendeur a besoin d'un téléphone**, qui tient dans une poche et s'utilise d'une main pendant qu'il présente le produit au client.",
        "Tap to Pay sur iPhone est arrivé en France en novembre 2023. Il permet d'encaisser sans terminal de paiement. Nous l'avons testé avec les vendeurs avant de l'intégrer.",
      ],
      media: [shot("livestore/02", "Panier, actions et fiche client sur mobile")],
      sources: [
        { label: "Tap to Pay sur iPhone en France, Apple", href: "https://www.apple.com/fr/newsroom/2023/11/apple-introduces-tap-to-pay-on-iphone-in-france" },
      ],
    },
    {
      title: "Décisions",
      lede: "Une refonte complète du design et de l'ergonomie.",
      body: [
        "J'ai **retravaillé tous les composants** pour simplifier les parcours de vente et d'encaissement et les adapter à l'usage en magasin, sur téléphone. Tap to Pay sur iPhone a été intégré au parcours des vendeurs après les tests.",
        "J'ai conçu la refonte avec l'équipe clienteling et l'équipe encaissement, pour que le vendeur retrouve les mêmes composants dans les deux modules.",
      ],
      media: [shot("livestore/03", "Livestore sur desktop : panier, actions et catalogue")],
    },
    {
      title: "Résultats",
      lede: "Une refonte présentée aux clients et bien reçue.",
      body: [
        "J'ai présenté la refonte à plusieurs clients. Les retours ont été positifs, en particulier sur une application jugée **plus moderne et plus ergonomique**.",
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
      lede: "Un assistant de comptabilité pour les indépendants, créé de zéro.",
      body: [
        "Pulse IA est une solution de comptabilité pour les auto-entrepreneurs, les professions libérales et les dirigeants de petites structures. Le produit a été créé de zéro au sein de Cegid, et j'y ai travaillé en tant que product designer.",
        "C'était la **première interface conversationnelle** conçue chez Cegid. Les assistants comme ChatGPT commençaient à se diffuser. Il n'existait pas encore de conventions pour un chat relié à des outils métier, par exemple pour afficher un graphique, le modifier ou lancer une action depuis la conversation.",
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
      lede: "Une étude par mois, avec le même panel d'utilisateurs.",
      body: [
        "Nous cherchions à savoir quelles interactions rendent un assistant utile pour une tâche comptable, en plus de la réponse en texte.",
        "Nous avons mené **environ une étude par mois** avec UserTesting et Maze. Nous **gardions le même panel** d'une étude à l'autre. Les mêmes utilisateurs évaluaient chaque évolution et nous disaient si le produit se rapprochait de leurs attentes.",
        "Garder le même panel permet de mesurer une progression dans le temps, ce qu'un test isolé ne permet pas.",
      ],
      media: ["Protocole de recherche continue"],
    },
    {
      title: "Décisions",
      lede: "Des composants intégrés à la conversation, en plus du texte.",
      body: [
        "L'assistant peut **répondre par un graphique**. L'utilisateur le modifie directement, sans reformuler sa demande.",
        "La conversation renvoie vers les écrans du produit et permet d'agir **sans quitter le fil**.",
        "Nous avons conçu et testé les premiers composants intégrés au chat. Pour une même réponse, nous comparions plusieurs présentations et nous gardions celle que le panel validait.",
      ],
      media: [shot("pulse-ia/01", "Audit de l'entreprise, balance âgée et réponses de l'assistant")],
    },
    {
      title: "Résultats",
      lede: "Le produit est sorti, avec de bons retours des bêta-testeurs.",
      body: [
        "Pulse IA a été mis en production et bien adopté en interne. Les **retours des bêta-testeurs** ont été positifs.",
        "Les composants conversationnels conçus pour ce projet servent de base aux versions suivantes.",
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
      lede: "La V2 d'un assistant conversationnel intégré aux sites des marques.",
      body: [
        "Kleio fournit à des sites de voyage, d'immobilier ou de e-commerce un **widget intégré à leurs pages**. Le visiteur y engage une conversation avec une IA, qui se poursuit ensuite dans l'interface de Kleio.",
        "Je suis intervenu en freelance en 2026, après une levée de fonds. Un premier designer avait fait les maquettes initiales. Ma mission était de concevoir une **V2 plus moderne et plus professionnelle**, et de prendre en charge tout le design.",
      ],
      media: [{ ...shot("kleio/ia-desktop-resultats", "Sur ordinateur : la conversation à gauche, les offres trouvées à droite"), ratio: "2880 / 1672" }],
    },
    {
      title: "Problème et recherche",
      lede: "Des visiteurs quittaient la conversation après le premier message.",
      body: [
        "Nous avions identifié **deux causes**. Le visiteur ne savait pas s'il parlait à une IA ou à une personne, et il attendait trop longtemps avant de voir un premier produit.",
        "J'ai travaillé avec un AI researcher qui a analysé un grand volume de conversations. Nous en avons tiré **des personas**, définis par l'intention exprimée dans le premier message, par exemple chercher une information, voir rapidement des offres ou comparer.",
        "J'ai aussi mis en place des **tests utilisateurs avec Maze** pour évaluer les parcours avant leur mise en production.",
      ],
      media: [],
    },
    {
      title: "Décisions",
      lede: "Dire que c'est une IA, montrer des produits tôt et adapter les réponses.",
      body: [
        "L'interface indique à l'utilisateur **qu'il échange avec une IA** et ce qu'elle peut faire pour lui.",
        "La conversation affiche des produits **le plus tôt possible**, dès les premiers échanges.",
        "Dès le premier message, le système identifie le type d'utilisateur. Il **adapte ensuite le ton et le contenu** des réponses de l'IA.",
      ],
      media: [
        { ...shot("kleio/ia-desktop-recherche", "Sur ordinateur : l'assistant détaille les étapes de sa recherche pendant le chargement"), ratio: "2880 / 1672" },
        { ...shot("kleio/ia-desktop-fiche", "Sur ordinateur : la fiche d'une offre, avec les questions suggérées"), ratio: "2880 / 1672" },
        { ...shot("kleio/ia-mobile", "Sur mobile : l'accueil de l'assistant, la recherche, les offres et la fiche"), ratio: "16 / 7" },
      ],
    },
    {
      title: "Résultats",
      lede: "Des démonstrations produites plus vite.",
      body: [
        "J'intégrais moi-même les interfaces avec Claude Code, ce qui a permis de produire les démonstrations commerciales plus vite.",
        "Les effets sur l'engagement sont encore en cours de mesure.",
      ],
      media: [],
    },
  ],
};

const kleioDesignSystem: Case = {
  ...kleio,
  slug: "kleio-design-system",
  chapters: [
    {
      title: "Contexte",
      lede: "Le design system d'une start-up, après sa levée de fonds.",
      body: [
        "À mon arrivée, le produit reposait sur les maquettes d'un premier designer, **sans design system**. J'ai pris en charge tout le design, c'est-à-dire le widget, l'application et le site.",
      ],
      media: [{ ...shot("kleio/ds-figma", "Le champ de saisie du widget dans le design system : états replié, étendu et avec suggestions"), ratio: "1551 / 976" }],
    },
    {
      title: "Problème et recherche",
      lede: "Des composants et des couleurs codés en dur, sans référentiel.",
      body: [
        "Le widget intégré chez les clients, l'application et le site évoluaient séparément. Beaucoup de composants et de couleurs étaient **codés en dur**. Il fallait refaire des choix à chaque écran, et les écrans n'étaient plus cohérents entre eux.",
        "Les styles typographiques et le nommage des composants ne suivaient pas de convention commune.",
      ],
      media: [],
    },
    {
      title: "Décisions",
      lede: "La même base dans Figma et dans le code.",
      body: [
        "J'ai structuré le design system dans Figma. J'ai ensuite créé les premières briques dans le code avec Claude Code, d'abord les tokens (couleur, typographie, espacement, rayon, ombre), puis les primitives et les composants.",
        "Il a fallu tout nettoyer. J'ai **remplacé les valeurs codées en dur par des tokens**, restructuré les styles typographiques et renommé les composants selon une seule convention.",
        "L'objectif était que **le code reproduise fidèlement la maquette**, à partir de la même base.",
      ],
      media: [{ code: true, alt: "Illustration animée : des tokens, un composant et son style, en code générique", ratio: "16 / 9" }],
    },
    {
      title: "Résultats",
      lede: "Un produit cohérent et des interfaces intégrées plus vite.",
      body: [
        "Avec le design system dans le code, j'ai pu intégrer moi-même des interfaces avec Claude Code et produire les démonstrations commerciales plus vite.",
      ],
      media: [],
    },
  ],
};

const kleioSite: Case = {
  ...kleio,
  slug: "kleio-site",
  chapters: [
    {
      title: "Contexte",
      lede: "Le site d'une start-up B2B, refait avec la V2 du produit.",
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
        "Le site **utilise le design system du produit**. Le visiteur voit sur le site la même identité que dans l'interface.",
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
      body: ["Un site **100 % sur mesure en Next.js**, avec une partie e-commerce intégrée."],
      media: [
        { ...shot("gaspard-mariotte/site-02", "Créations : l'entrée de la catégorie Murs"), ratio: "2880 / 1800" },
        { ...shot("gaspard-mariotte/site-03", "Murs : la liste des peintures murales"), ratio: "2880 / 1800" },
      ],
    },
    {
      title: "Problème et recherche",
      lede: "Mettre en valeur le travail mural.",
      body: ["L'interface montre d'abord les œuvres. La navigation et le parcours d'achat sont simples."],
      media: [
        { ...shot("gaspard-mariotte/site-05", "Collaborations : la grille des projets"), ratio: "2880 / 1800" },
        { ...shot("gaspard-mariotte/site-10", "Page exposition : Asilah"), ratio: "2880 / 1800" },
      ],
    },
    {
      title: "Décisions",
      lede: "Un back-office que l'artiste gère seul.",
      body: ["Un **back-office sur mesure avec Sanity**, pour que l'artiste gère facilement ses œuvres, ses projets et ses ventes en ligne."],
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

const laku: Case = {
  slug: "laku",
  name: "Laku",
  client: "Laku",
  year: "2026",
  role: "Design et développement",
  duration: "Depuis juin 2026",
  chapters: [
    {
      title: "Contexte",
      lede: "Une application mobile pour pratiquer le dessin tous les jours.",
      body: [
        "Laku propose chaque semaine **une œuvre à réinterpréter**, avec trois niveaux de difficulté et des points d'observation posés sur l'image. L'application contient aussi un tableau de bord de pratique, un fil d'inspirations, des salons de discussion et un profil.",
        "J'ai conçu le produit et **je l'ai développé avec Claude Code**. Il comprend une application Expo (React Native) pour iOS, Android et le web, un outil de curation pour préparer l'œuvre de la semaine, et une base Supabase.",
      ],
      media: [{ ...shot("laku/01", "L'atelier, l'œuvre de la semaine avec un point d'observation ouvert, et le fil d'inspirations"), ratio: "16 / 10" }],
    },
    {
      title: "Problème et recherche",
      lede: "Garder une interface cohérente en développant avec un agent IA.",
      body: [
        "Un agent IA produit du code rapidement, mais il a tendance à **recréer un bouton, une couleur ou un espacement** à chaque écran. Sans règles, les écrans deviennent incohérents, comme dans une équipe **sans design system**.",
        "L'autre risque concernait les données. L'application n'a pas de serveur applicatif, et **les règles d'accès sont définies dans la base**. Si une règle manque, le contenu d'un utilisateur devient accessible aux autres.",
        "Les questions en cours ne sont plus techniques. Je cherche comment réunir une **première communauté d'utilisateurs** et comment faire connaître l'application.",
      ],
      media: [{ ...shot("laku/02", "Le répertoire sur l'atelier, une catégorie et le profil"), ratio: "16 / 10" }],
    },
    {
      title: "Décisions",
      lede: "Un design system en code et des règles contrôlées automatiquement.",
      body: [
        "J'ai construit un **design system en code**, utilisé par l'application et par l'outil de curation. Il contient des tokens (couleur, typographie, espacement, rayon, ombre) et des composants classés en atomes, molécules, organismes et gabarits de page. Chaque composant est documenté dans Storybook.",
        "Les règles du projet sont écrites dans le dépôt et **contrôlées automatiquement** quand c'est possible. Le lint refuse une couleur ou une taille de texte écrite en dur dans un écran. Un test vérifie la hiérarchie des composants. Ces contrôles tournent à chaque modification.",
        "Tous les écrans utilisent les mêmes composants pour les états de chargement, vide et erreur. Des tests vérifient les règles d'accès aux données, pour les accès autorisés et pour les accès refusés.",
      ],
      media: [
        { ...shot("laku/03", "Un gabarit de page dans Storybook, avec les niveaux du design system dans le menu"), ratio: "2880 / 1198" },
        { ...shot("laku/04", "Les tokens de couleur dans Storybook"), ratio: "2880 / 1198" },
      ],
    },
    {
      title: "Résultats",
      lede: "Une application qui fonctionne de bout en bout.",
      body: [],
      media: [],
    },
  ],
};

const progemi: Case = {
  slug: "progemi",
  name: "Progemi",
  client: "Progemi",
  year: "—",
  role: "Design et front-end",
  duration: "—",
  chapters: [
    {
      title: "Contexte",
      lede: "Un outil d'extraction de factures, dont j'ai fait le design et le front-end.",
      body: [
        "Cet outil **extrait les données des factures**. J'ai conçu l'interface et j'ai développé le front-end avec Claude Code.",
        "J'ai travaillé avec un développeur back-end et j'ai assuré le suivi du projet.",
      ],
      media: [],
    },
    {
      title: "Problème et recherche",
      lede: "Mon premier outil livré sans développeur front-end.",
      body: [
        "C'était la première fois que je **créais un outil sans développeur front-end**. Je me suis appuyé sur un assistant IA pour écrire le code.",
        "L'interface devait aussi respecter la **charte graphique du client**.",
      ],
      media: [],
    },
    {
      title: "Décisions",
      lede: "Le design et le code faits par la même personne.",
      body: [
        "J'ai fait le design puis le front-end moi-même avec Claude Code, en appliquant la charte graphique.",
        "Le back-end était développé en parallèle. Je suivais l'avancement du projet avec le développeur back-end.",
        "**Le produit a été livré**, dans le respect de la charte.",
      ],
      media: [],
    },
    { title: "Résultats", lede: "Le produit a été livré.", body: [], media: [] },
  ],
};

export const projects: Project[] = [
  {
    slug: "ia-conversationnelle", layout: "recherche", n: "01", title: "IA conversationnelle", kind: "Kleio · Pulse IA", year: "2 cas",
    pitch: "Assistants, chatbots et outils connectés en MCP.",
    cover: "/projects/pulse-ia/03.webp", tint: "#E4DEEA", ink: "#5B3F86",
    cases: [pulse, kleio],
  },
  {
    slug: "produit-et-discovery", layout: "recherche", n: "02", title: "Produit et discovery", kind: "Bim ! · Livestore", year: "2 cas",
    pitch: "Deux projets, avec pour chacun le problème rencontré, la recherche menée et les choix faits.",
    cover: "/projects/bim.webp", tint: "#DCE3EC", ink: "#2B4C7E",
    cases: [bim, livestore],
  },
  {
    slug: "design-system", layout: "rangs", n: "03", title: "Design system", kind: "Bim ! · Cegid · Kleio", year: "3 cas",
    pitch: "Trois design systems, pour Bim !, Cegid et Kleio.",
    cover: "/projects/bim/04.webp", tint: "#DEE5DE", ink: "#2F5D3F",
    cases: [bimDesignSystem, cegidDesignSystem, kleioDesignSystem],
  },
  {
    slug: "sites-vitrines", layout: "visuel", n: "04", title: "Sites vitrines", kind: "Gaspard Mariotte · Vers le Sud · Kleio", year: "3 cas",
    pitch: "Des sites de marque, du mock à la mise en ligne.",
    cover: "/projects/gaspard.webp", tint: "#ECE2D6", ink: "#7A4A2A",
    cases: [gaspard, versLeSud, kleioSite],
  },
  {
    slug: "front-end", layout: "rangs", n: "05", title: "Front-end", kind: "Laku · Progemi", year: "2 cas",
    pitch: "React, Next.js et animations, codés par moi.",
    tint: "#EEE9D6", ink: "#6B5A1E",
    cases: [laku, progemi],
  },
];

/** Les images qui défilent dans les cards de l'accueil, chacune mène à son thème. */
export const heroShots: { src: string; slug: string; title: string }[] = [
  // Tous les écrans publiés sur le site, mélangés projet par projet. Écartés : livestore/01 et kleio/ds-figma (marques clientes visibles).
  { src: "/projects/bim/02.webp", slug: "produit-et-discovery", title: "Bim !" },
  { src: "/projects/pulse-ia/03.webp", slug: "ia-conversationnelle", title: "Pulse IA" },
  { src: "/projects/kleio/ia-desktop-resultats.webp", slug: "ia-conversationnelle", title: "Kleio" },
  { src: "/projects/gaspard-mariotte/01.webp", slug: "sites-vitrines", title: "Gaspard Mariotte" },
  { src: "/projects/bim/04.webp", slug: "design-system", title: "Design system Bim !" },
  { src: "/projects/livestore/03.webp", slug: "produit-et-discovery", title: "Livestore" },
  { src: "/projects/laku/01.webp", slug: "front-end", title: "Laku" },
  { src: "/projects/cegid-ds/01.webp", slug: "design-system", title: "Cegid" },
  { src: "/projects/vers-le-sud/01.webp", slug: "sites-vitrines", title: "Vers le Sud" },
  { src: "/projects/bim/06.webp", slug: "produit-et-discovery", title: "Bim !" },
  { src: "/projects/pulse-ia/02.webp", slug: "ia-conversationnelle", title: "Pulse IA" },
  { src: "/projects/kleio/ia-mobile.webp", slug: "ia-conversationnelle", title: "Kleio" },
  { src: "/projects/gaspard-mariotte/site-02.webp", slug: "sites-vitrines", title: "Gaspard Mariotte" },
  { src: "/projects/bim/05.webp", slug: "design-system", title: "Design system Bim !" },
  { src: "/projects/livestore/02.webp", slug: "produit-et-discovery", title: "Livestore" },
  { src: "/projects/laku/02.webp", slug: "front-end", title: "Laku" },
  { src: "/projects/cegid-ds/02.webp", slug: "design-system", title: "Cegid" },
  { src: "/projects/bim/01.webp", slug: "produit-et-discovery", title: "Bim !" },
  { src: "/projects/pulse-ia/01.webp", slug: "ia-conversationnelle", title: "Pulse IA" },
  { src: "/projects/kleio/ia-desktop-fiche.webp", slug: "ia-conversationnelle", title: "Kleio" },
  { src: "/projects/gaspard-mariotte/02.webp", slug: "sites-vitrines", title: "Gaspard Mariotte" },
  { src: "/projects/bim/07.webp", slug: "design-system", title: "Design system Bim !" },
  { src: "/projects/laku/03.webp", slug: "front-end", title: "Laku" },
  { src: "/projects/bim/03.webp", slug: "produit-et-discovery", title: "Bim !" },
  { src: "/projects/kleio/ia-desktop-recherche.webp", slug: "ia-conversationnelle", title: "Kleio" },
  { src: "/projects/gaspard-mariotte/site-05.webp", slug: "sites-vitrines", title: "Gaspard Mariotte" },
  { src: "/projects/laku/04.webp", slug: "front-end", title: "Laku" },
  { src: "/projects/bim/08.webp", slug: "produit-et-discovery", title: "Bim !" },
  { src: "/projects/gaspard-mariotte/site-13.webp", slug: "sites-vitrines", title: "Gaspard Mariotte" },
  { src: "/projects/gaspard-mariotte/site-03.webp", slug: "sites-vitrines", title: "Gaspard Mariotte" },
  { src: "/projects/gaspard-mariotte/site-10.webp", slug: "sites-vitrines", title: "Gaspard Mariotte" },
  { src: "/projects/gaspard-mariotte/site-18.webp", slug: "sites-vitrines", title: "Gaspard Mariotte" },
  { src: "/projects/gaspard-mariotte/site-20.webp", slug: "sites-vitrines", title: "Gaspard Mariotte" },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
