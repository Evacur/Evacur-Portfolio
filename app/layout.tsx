import type { Metadata } from "next";
import { GeistMono } from "geist/font/mono";
import { GeistSans } from "geist/font/sans";
import { Archivo, Instrument_Serif } from "next/font/google";
import { Cursor } from "@/components/Cursor";
import { PageTransition } from "@/components/PageTransition";
import "./globals.css";

// Titre de l'accueil : Archivo en version étendue (axe de largeur), comme la couverture du portfolio PDF
const display = Archivo({ subsets: ["latin"], axes: ["wdth"], variable: "--font-archivo", display: "swap" });

// Titres : un serif fin, en romain uniquement
const serif = Instrument_Serif({ subsets: ["latin"], weight: "400", variable: "--font-instrument", display: "swap" });

export const metadata: Metadata = {
  title: "Pablo Cuerva — Product designer, Paris",
  description: "Portfolio de Pablo Cuerva, product designer à Paris : SaaS B2B, IA et produits conversationnels.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="fr" className={`${GeistSans.variable} ${GeistMono.variable} ${display.variable} ${serif.variable}`} suppressHydrationWarning>
      <body><PageTransition>{children}</PageTransition><Cursor /></body>
    </html>
  );
}
