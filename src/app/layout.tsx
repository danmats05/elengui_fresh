import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque } from "next/font/google";
import localFont from "next/font/local";
import { AGE_STORAGE_KEY } from "@/data/site";
import SmoothScroll from "@/components/providers/SmoothScroll";
import { AgeGateProvider } from "@/components/providers/AgeGateProvider";
import { PanierProvider } from "@/components/providers/PanierProvider";
import { TransitionProvider } from "@/components/providers/TransitionProvider";
import AgeGate from "@/components/sections/AgeGate";
import Header from "@/components/sections/Header";
import Footer from "@/components/sections/Footer";
import TiroirPanier from "@/components/ui/TiroirPanier";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  axes: ["opsz", "wdth"],
  variable: "--font-bricolage",
  display: "swap",
});

// Police de texte (descriptions, paragraphes).
const power = localFont({
  src: "../../public/fonts/PowerGrotesk-Regular.ttf",
  weight: "400",
  variable: "--font-power",
  display: "swap",
});

// Police d'accent (bandeau, libellés, chiffres clés…) : une seule graisse fournie, Heavy.
const benz = localFont({
  src: "../../public/fonts/benz_grotesk/Benz Grotesk.ttf",
  weight: "850",
  variable: "--font-benz",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Elengi Fresh · Vins de fruits fermentés du Congo",
    template: "%s · Elengi Fresh",
  },
  description:
    "Elengi Fresh, des vins de fruits et de fleurs fermentés naturellement, sans alcool distillé. 6 % vol., en canettes de 330 ml.",
  icons: {
    icon: [
      { url: "/favicon/favicon.svg?v=2", type: "image/svg+xml" },
      { url: "/favicon/favicon.ico?v=2", sizes: "48x48" },
    ],
    apple: "/favicon/apple-touch-icon.png?v=2",
  },
  manifest: "/favicon/site.webmanifest",
};

export const viewport: Viewport = {
  themeColor: "#6B0F3A",
};

// Exécuté avant le premier rendu : évite le flash de l'age gate et des éléments animés.
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');try{if(localStorage.getItem('${AGE_STORAGE_KEY}')==='1')d.setAttribute('data-age-ok','')}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fr" className={`${bricolage.variable} ${power.variable} ${benz.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <AgeGateProvider>
          <PanierProvider>
            <SmoothScroll />
            <AgeGate />
            <TransitionProvider>
              <div id="site">
                <Header />
                {children}
                <Footer />
              </div>
            </TransitionProvider>
            <TiroirPanier />
          </PanierProvider>
        </AgeGateProvider>
      </body>
    </html>
  );
}
