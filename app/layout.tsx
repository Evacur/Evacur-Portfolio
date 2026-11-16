import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Archivo } from "next/font/google";
import "./globals.css";

// Titre de l'accueil : Archivo en version étendue (axe de largeur), comme la couverture du portfolio PDF
const display = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo", display: "swap" });

export const metadata: Metadata = {
  title: "Pablo Cuerva — Product designer, Paris",
  description: "Portfolio de Pablo Cuerva, product designer à Paris : SaaS B2B, IA et produits conversationnels.",
};

// Applique le thème avant le premier rendu pour éviter un flash blanc
const themeScript = `try{if(localStorage.getItem('theme')==='dark')document.documentElement.classList.add('dark')}catch(e){}`;

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${GeistSans.variable} ${GeistMono.variable} ${display.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
