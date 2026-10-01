export type Project = {
  slug: string;
  n: string;
  title: string;
  kind: string;
  year: string;
  /** Visuel de couverture dans /public (portrait 18:23). Sans visuel, un aperçu neutre s'affiche. */
  cover?: string;
  /** Teintes de l'aperçu neutre, en attendant les vraies captures. */
  tint: string;
  ink: string;
};

// Tout ce qui est entre crochets reste à renseigner.
export const projects: Project[] = [
  { slug: "progemi", n: "01", title: "Progemi", kind: "SaaS B2B · IA", year: "[année]", tint: "#DCE3EC", ink: "#2B4C7E" },
  { slug: "recherche-ia", n: "02", title: "Recherche IA", kind: "Produit conversationnel", year: "2026", tint: "#E4DEEA", ink: "#5B3F86" },
  { slug: "cegid", n: "03", title: "Cegid", kind: "SaaS B2B", year: "[années]", tint: "#DEE5DE", ink: "#2F5D3F" },
  { slug: "peintures-murales", n: "04", title: "Peintures murales", kind: "Site vitrine", year: "[année]", tint: "#ECE2D6", ink: "#7A4A2A" },
  { slug: "carnet", n: "05", title: "Carnet", kind: "App mobile", year: "2026", tint: "#EEE9D6", ink: "#6B5A1E" },
];
