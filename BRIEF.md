# Portfolio Pablo Cuerva — brief de reprise

À donner tel quel à Claude Code au démarrage du projet Next.js. Tout ce qui a été décidé est ici ; les mocks sont dans `mocks/project/`.

## Objectif
Refaire de zéro le portfolio aujourd'hui sur Framer (projet « Portfolio »), en **Next.js + Tailwind + Motion**, études de cas en **MDX**, mise en ligne sur **Vercel**. Corriger les failles UX/UI de l'ancien site (pas de nav ni de contact, carrousel sans infos, contraste faible, animations non désactivables).

## Direction retenue : V4 « Épuré » (inspirée de michaelbardou.com)
- **Un seul écran, pas de scroll vertical** : les projets sont visibles tout de suite.
- Fond blanc, une seule police (Geist), une seule taille de texte (13 px), texte rangé dans les coins :
  - haut : « Pablo Cuerva » à gauche · Travaux / À propos / Contact au centre · « (sombre) » à droite (thème sombre)
  - bas : « (voir la liste) » à gauche · « Product designer, Paris » + heure de Paris en direct au centre · « 2026 © » à droite
- Galerie de projets au centre ; navigation molette, clic, numéros 01–05 ; légende : index, nom qui défile, « (voir le projet) ».
- Vue liste : numéro, nom, type, année, aperçu qui suit la souris.
- Loader : petit compteur 000 → 100, puis les visuels montent en fondu.
- Transitions entre projets à choisir parmi 4 variantes (fichiers `V4-*.dc.html`) : **Volets** (6 bandes qui montent), **Ligne** (les autres projets en lignes de 2 px), **Focale** (zoom arrière, glissement, zoom avant), **Iris** (ouverture depuis le centre). Choix final : [à décider].
- `prefers-reduced-motion` respecté partout.

## Mobile (prévu, pas encore maquetté)
Même écran unique : image ~80 % de largeur, swipe gauche/droite pour changer de projet, « Menu » remplace les 3 liens du haut, liste sans aperçu. Réduire l'image sur petits écrans pour éviter tout scroll.

## Contenu
Projets : 01 Progemi (SaaS B2B · IA), 02 Recherche IA (produit conversationnel), 03 Cegid (SaaS B2B), 04 Peintures murales (site vitrine), 05 Carnet (app mobile).
Parcours : ex-lead designer Cegid (5 ans, SaaS B2B), Kleio (produits conversationnels), designer-développeur chez Progemi.
Étude de cas (modèle dans `V2-Case.dc.html`) : médias à gauche, panneau fixe à droite avec infos (client, année, rôle, durée, équipe, stack) et récit en accordéon Contexte / Problème / Recherche / Décisions / Résultats, projet suivant en bas.

## Manque encore
Vraies captures et vidéos des projets, années, email pro, mois de disponibilité, liens LinkedIn / Malt / CV. Aucun chiffre de résultat n'a été inventé : tout ce qui est entre crochets est à remplir.

## Historique des pistes (pour mémoire)
V1 « Bold » (fond noir, typo géante, orange) : refusée. V2 « Éditorial » (inspirée de cynx.io) et V3 « Home mix » (Bardou, Givelet, Dolle) : dépassées par la V4.

Canvas des mocks : https://claude.ai/artifact/ALmSQjN65ZEo9R4TcbmZ4q
Les fichiers `.dc.html` sont des maquettes interactives (HTML + une classe JS) : les reprendre comme référence de mise en page, de timing et d'easing, pas comme code de production.
