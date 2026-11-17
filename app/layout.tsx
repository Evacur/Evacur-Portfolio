import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Analytics } from "@vercel/analytics/next";
import Script from "next/script";
import { Archivo, Instrument_Serif } from "next/font/google";
import { Cursor } from "@/components/Cursor";
import { PageTransition } from "@/components/PageTransition";
import "./globals.css";

// Titre de l'accueil : Archivo en version étendue (axe de largeur), comme la couverture du portfolio PDF
const display = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo", display: "swap" });

// Titres : un serif fin, en romain uniquement
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", variable: "--font-instrument", display: "swap" });

// Umami : suivi des clics (attributs data-umami-event sur les boutons et liens), sans cookie.
// Limité au domaine de production pour ne pas compter les aperçus ni le développement local.
const UMAMI_WEBSITE_ID = "";

const description =
  "Product designer freelance à Paris. Produits SaaS B2B, assistants IA et design systems, de la recherche utilisateur au front-end.";

export const metadata: Metadata = {
  metadataBase: new URL("https://www.pablocuerva.fr"),
  title: "Pablo Cuerva",
  description,
  openGraph: {
    title: "Pablo Cuerva",
    description,
    url: "/",
    siteName: "Pablo Cuerva",
    locale: "fr_FR",
    type: "website",
  },
  twitter: { card: "summary_large_image", title: "Pablo Cuerva", description },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${GeistSans.variable} ${GeistMono.variable} ${display.variable} ${serif.variable}`} suppressHydrationWarning>
      <body>
        <PageTransition>{children}</PageTransition><Cursor /><Analytics />
        {UMAMI_WEBSITE_ID && <Script src="https://cloud.umami.is/script.js" data-website-id={UMAMI_WEBSITE_ID} data-domains="www.pablocuerva.fr" strategy="afterInteractive" />}
      </body>
    </html>
  );
}
