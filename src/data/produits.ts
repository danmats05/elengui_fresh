import type { DrinkSlug } from "@/data/drinks";

/*
 * Données commerciales et nutritionnelles FICTIVES (projet portfolio).
 * Valeurs plausibles : l'énergie est calculée à partir de 6 % vol. d'alcool (≈ 4,7 g/100 ml × 7 kcal)
 * et des glucides (4 kcal/g). À remplacer par de vraies données si le projet devient réel.
 */

export const packs = [
  // Prix en francs CFA (XAF, Congo) : léger rabais sur les grands packs.
  { canettes: 4, prix: 3000 },
  { canettes: 8, prix: 5500 },
  { canettes: 12, prix: 8000 },
] as const;

export type Pack = (typeof packs)[number];

/**
 * Visuel du pack (photo du carton) affiché à droite quand il existe.
 * Exemple : "rose-piquante": { 4: "/packs/rose-piquante-4.png" }
 */
export const visuelsPacks: Partial<Record<DrinkSlug, Partial<Record<Pack["canettes"], string>>>> = {};

export const formatPrix = (prix: number) =>
  new Intl.NumberFormat("fr-FR", { style: "currency", currency: "XAF" }).format(prix);

const ALCOOL_G_100ML = 4.7;

type Nutrition = {
  denomination: string;
  ingredients: string;
  /** Pour 100 ml */
  glucides: number;
  sucres: number;
};

export const nutrition: Record<DrinkSlug, Nutrition> = {
  "rose-piquante": {
    denomination: "Vin de pamplemousse aromatisé au citron vert et au gingembre",
    ingredients:
      "Jus de pamplemousse (45 %), jus d’ananas, eau, jus de citron vert, gingembre frais, levures. Sans sucre ajouté.",
    glucides: 2.4,
    sucres: 2.0,
  },
  "mangue-doree": {
    denomination: "Vin de mangue aromatisé à l’orange et à la vanille",
    ingredients: "Purée de mangue (48 %), eau, jus d’orange, gousse de vanille, levures. Sans sucre ajouté.",
    glucides: 3.2,
    sucres: 2.8,
  },
  "passion-vive": {
    denomination: "Vin de fruit de la passion pétillant aromatisé au citron",
    ingredients:
      "Pulpe de fruit de la passion (35 %), purée de mangue, eau, jus de citron, levures, gaz carbonique. Sans sucre ajouté.",
    glucides: 2.6,
    sucres: 2.2,
  },
  "bissap-royal": {
    denomination: "Vin de fleur d’hibiscus (bissap) aromatisé à la menthe et au gingembre",
    ingredients:
      "Eau, calices d’hibiscus séchés (bissap), jus d’ananas, gingembre frais, menthe fraîche (infusion à froid), levures. Sans sucre ajouté.",
    glucides: 2.2,
    sucres: 1.8,
  },
};

const VOLUME_ML = 330;
const arrondi = (n: number, d = 1) => Math.round(n * 10 ** d) / 10 ** d;

/** Lignes du tableau : [libellé, par canette, pour 100 ml, sous-ligne ?] */
export function tableauNutritionnel(slug: DrinkSlug) {
  const n = nutrition[slug];
  const kcal100 = Math.round(ALCOOL_G_100ML * 7 + n.glucides * 4);
  const kj100 = Math.round(kcal100 * 4.184);
  const f = VOLUME_ML / 100;
  const g = (v: number) => `${arrondi(v).toLocaleString("fr-FR")} g`;
  return {
    kcalCanette: Math.round(kcal100 * f),
    sucresCanette: arrondi(n.sucres * f),
    glucidesCanette: arrondi(n.glucides * f),
    lignes: [
      ["Énergie", `${Math.round(kj100 * f)} kJ`, `${kj100} kJ`, false],
      ["", `${Math.round(kcal100 * f)} kcal`, `${kcal100} kcal`, false],
      ["Matières grasses", g(0), g(0), false],
      ["dont acides gras saturés", g(0), g(0), true],
      ["Glucides", g(n.glucides * f), g(n.glucides), false],
      ["dont sucres", g(n.sucres * f), g(n.sucres), true],
      ["Fibres alimentaires", "< 0,5 g", "< 0,5 g", false],
      ["Protéines", g(0.1 * f), g(0.1), false],
      ["Sel", "< 0,01 g", "< 0,01 g", false],
    ] as const,
  };
}
