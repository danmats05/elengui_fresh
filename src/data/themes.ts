import type { DrinkSlug } from "@/data/drinks";

/** Couleurs secondaires par boisson, choisies pour rester lisibles sur la couleur de la boisson. */
export const themes: Record<
  DrinkSlug,
  { libelle: string; bande: string; bouton: { fond: string; remplissage: string; texte: string } }
> = {
  "rose-piquante": {
    libelle: "var(--pamplemousse-accent)",
    bande: "var(--bissap)",
    bouton: { fond: "var(--pamplemousse-accent)", remplissage: "var(--passion)", texte: "var(--texte)" },
  },
  "mangue-doree": {
    libelle: "var(--mangue-accent)",
    bande: "var(--bissap)",
    bouton: { fond: "var(--mangue-accent)", remplissage: "var(--passion)", texte: "var(--texte)" },
  },
  "passion-vive": {
    libelle: "rgb(42 20 20 / 0.7)",
    bande: "var(--bissap)",
    bouton: { fond: "var(--bissap)", remplissage: "var(--bissap-accent)", texte: "var(--fond)" },
  },
  "bissap-royal": {
    libelle: "var(--pamplemousse-accent)",
    bande: "var(--fond)",
    bouton: { fond: "var(--passion)", remplissage: "var(--fond)", texte: "var(--texte)" },
  },
};
