export const drinks = [
  {
    slug: "rose-piquante",
    name: "Rose Piquante",
    fruit: "Pamplemousse",
    flavors: ["Citron vert", "Gingembre"],
    notes: ["Acidulée et vive", "Une pointe de gingembre", "Finale citronnée"],
    description:
      "Le pamplemousse rose dans tout son peps, réveillé par le citron vert et une pointe de gingembre. Un vin de fruits vif et rafraîchissant, parfait pour l'apéro au soleil.",
    color: "#FF6F7D",
    accent: "#FFD6DA",
    text: "#FFF8F0",
    badge: "/brand/elengi-fresh-badge-pamplemousse.svg",
    can: "/cans/rose-piquante-v2.png",
  },
  {
    slug: "mangue-doree",
    name: "Mangue Dorée",
    fruit: "Mangue",
    flavors: ["Orange", "Vanille"],
    notes: ["Ronde et gourmande", "Mangue bien mûre", "Touche de vanille"],
    description:
      "La douceur d'une mangue bien mûre, rehaussée d'orange et d'une touche de vanille. Ronde, gourmande et solaire : la plus câline de la gamme.",
    color: "#FF9A1F",
    accent: "#FFE1B8",
    text: "#FFF8F0",
    badge: "/brand/elengi-fresh-badge-mangue.svg",
    can: "/cans/mangue-doree.png",
  },
  {
    slug: "passion-vive",
    name: "Passion Vive",
    fruit: "Fruit de la passion",
    flavors: ["Citron", "Bulles"],
    notes: ["Pétillante", "Exotique et intense", "Fraîcheur citronnée"],
    description:
      "Le fruit de la passion à l'état pur, avec un trait de citron et de fines bulles. Exotique, intense et pétillante, elle fait danser les papilles.",
    color: "#FFD23F",
    accent: "#FFF4C7",
    text: "#2A1414",
    badge: "/brand/elengi-fresh-badge-passion.svg",
    can: "/cans/passion-vive.png",
  },
  {
    slug: "bissap-royal",
    name: "Bissap Royal",
    fruit: "Bissap (hibiscus)",
    flavors: ["Menthe", "Gingembre"],
    notes: ["Notre édition signature", "Fleur d'hibiscus profonde", "Finale mentholée"],
    description:
      "Notre édition signature : la fleur d'hibiscus, profonde et légèrement acidulée, relevée de gingembre et terminée par une fraîcheur de menthe. Un hommage au bissap congolais.",
    color: "#6B0F3A",
    accent: "#C2185B",
    text: "#FFF8F0",
    badge: "/brand/elengi-fresh-badge-bissap.svg",
    can: "/cans/bissap-royal.png",
  },
] as const;

export type Drink = (typeof drinks)[number];
export type DrinkSlug = Drink["slug"];

export const getDrink = (slug: DrinkSlug) => drinks.find((d) => d.slug === slug)!;

export const abv = "6 % vol.";
export const volume = "330 ml";

export const findDrink = (slug: string) => drinks.find((d) => d.slug === slug);

export const ingredients = (d: Drink) => [d.fruit, ...d.flavors.map((f) => f.toLowerCase())].join(", ");

/** Boissons affichées avec le badge « NEW ». */
export const nouveautes: DrinkSlug[] = ["rose-piquante"];
