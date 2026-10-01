/* Étapes de fabrication (contenu fictif, d'après le guide de marque). */

const A = (f: string) => `/assets/${f}`;

export type Etape = {
  /** Libellé court affiché au-dessus de la carte */
  etiquette: string;
  titre: string;
  texte: string[];
  fond: string;
  texteCouleur: string;
  accent: string;
  visuels: { src: string; w: number; h: number }[];
  /** Visuel unique détouré, avec une main rouge « stop » au coin bas droit (ex. : sucre interdit). */
  interdit?: { src: string; w: number; h: number; alt: string };
  /** Photo affichée à la place des visuels détourés (coins arrondis). */
  photo?: { src: string; w: number; h: number; alt: string };
  /** Composition libre : chaque visuel avec sa position (en % du cadre), sa taille et son angle. */
  bouquet?: { src: string; w: number; h: number; x: number; y: number; taille: number; rot: number }[];
};

export const etapes: Etape[] = [
  {
    etiquette: "Le fruit",
    titre: "Le fruit, choisi bien mûr",
    texte: [
      "Tout commence chez nos producteurs. Nous travaillons avec de petits cultivateurs locaux qui font pousser leurs fruits tout naturellement, sans pesticides ni engrais chimiques, au rythme des saisons.",
      "Les fruits sont cueillis à pleine maturité, gorgés de soleil : c'est à ce moment-là qu'ils ont le plus de goût et de sucres naturels. Circuit court oblige, ils arrivent chez nous en quelques heures.",
      "Pamplemousse, mangue, fruit de la passion, citrons et orange sont lavés, épluchés si besoin, puis pressés pour en tirer un jus généreux, pulpe comprise.",
      "Le bissap, lui, est une fleur : ses calices séchés infusent longuement dans l'eau chaude pour livrer leur couleur pourpre profonde et leur acidité.",
      "Pas de concentré ni d'arôme artificiel : uniquement de vrais fruits, et rien d'autre.",
    ],
    fond: "var(--pamplemousse)",
    texteCouleur: "var(--fond)",
    accent: "var(--pamplemousse-accent)",
    visuels: [],
    // Toutes nos tranches, rassemblées autour du soleil (x, y : centre en % du cadre).
    bouquet: [
      { src: A("orange.png"), w: 559, h: 447, x: 30, y: 26, taille: 52, rot: -18 },
      { src: A("tranche_mangue.webp"), w: 350, h: 350, x: 72, y: 24, taille: 44, rot: 22 },
      { src: A("citon-jaune.png"), w: 518, h: 482, x: 84, y: 54, taille: 42, rot: 34 },
      { src: A("fruit_dlp.png"), w: 520, h: 480, x: 18, y: 58, taille: 44, rot: -12 },
      { src: A("fleur_hibiscus.png"), w: 535, h: 467, x: 66, y: 80, taille: 42, rot: 14 },
      { src: A("citron-vert.png"), w: 500, h: 500, x: 34, y: 82, taille: 44, rot: -28 },
      {
        src: A("91360098-grapefruit-slice-grapefruit-isolated-on-white-removebg-preview.png"),
        w: 500,
        h: 500,
        x: 52,
        y: 52,
        taille: 62,
        rot: 8,
      },
    ],
  },
  {
    etiquette: "La fermentation",
    titre: "La fermentation, en douceur",
    texte: [
      "Le jus ou l'infusion rejoint la cuve avec des levures. Elles se nourrissent des sucres naturels du fruit et les transforment, lentement, en alcool et en arômes.",
      "Pas de précipitation : la fermentation se fait à basse température, sur plusieurs jours. C'est ce temps-là qui donne au vin sa finesse et son côté fruité.",
      "La cuve « respire » doucement : les bulles qui remontent à la surface montrent que les levures travaillent, comme dans le vin de fruits traditionnel du Congo.",
      "Aucun alcool distillé n'est ajouté : tout vient de la fermentation naturelle.",
    ],
    fond: "var(--mangue)",
    texteCouleur: "var(--fond)",
    accent: "var(--mangue-accent)",
    visuels: [],
    photo: {
      src: encodeURI(A("Bebidas Fermentadas Caseiras_ 5 Receitas Naturais e Funcionais _ Receitas.jpeg")),
      w: 736,
      h: 460,
      alt: "Quatre bouteilles de vins de fruits en fermentation, avec des morceaux de fruits",
    },
  },
  {
    etiquette: "Zéro sucre ajouté",
    titre: "Sans sucre ajouté, juste des fruits",
    texte: [
      "Nos boissons sont sans sucre ajouté. Toute la douceur vient des fruits eux-mêmes.",
      "Le pamplemousse, le fruit de la passion et le bissap sont peu sucrés et très acides : seuls, ils ne nourriraient pas assez les levures.",
      "On les marie donc à des fruits plus doux, comme la mangue ou l'ananas. Leurs sucres naturels lancent la fermentation, et leur rondeur adoucit l'acidité.",
      "Chaque assemblage est dosé avec soin : assez pour fermenter, jamais au point de masquer le caractère du fruit principal.",
    ],
    fond: "var(--passion)",
    texteCouleur: "var(--texte)",
    accent: "var(--bissap)",
    visuels: [],
    interdit: {
      src: A("cd49475b7236ed42b1e19d0d9312662d.png"),
      w: 593,
      h: 421,
      alt: "Un bol de sucre, barré d'une main rouge : sans sucre ajouté",
    },
  },
  {
    etiquette: "Les aromates",
    titre: "Les aromates",
    texte: [
      "Gingembre, agrumes et vanille rejoignent la cuve pendant la fermentation, pour que leurs arômes se fondent dans le vin au lieu de rester en surface.",
      "Le gingembre frais, râpé, apporte sa pointe piquante à Rose Piquante et Bissap Royal. Les zestes et le jus de citron jaune ou vert réveillent l'ensemble.",
      "La gousse de vanille, fendue sur toute sa longueur, infuse dans la Mangue Dorée et lui donne sa douceur ronde.",
      "La menthe du Bissap Royal arrive à la fin, en infusion à froid, pour garder toute sa fraîcheur.",
    ],
    fond: "var(--bissap-accent)",
    texteCouleur: "var(--fond)",
    accent: "var(--passion-accent)",
    visuels: [],
    // Les aromates : la vanille en fond, les deux citrons en haut, le gingembre devant (ordre = profondeur).
    bouquet: [
      {
        src: encodeURI(A("Ecuadorian Vanilla Beans - Premium Grade A Quality.png")),
        w: 500,
        h: 500,
        x: 52,
        y: 54,
        taille: 66,
        rot: 0,
      },
      { src: A("citron-jaune.png"), w: 730, h: 565, x: 30, y: 30, taille: 46, rot: -10 },
      { src: encodeURI(A("Citron-vert copie.png")), w: 612, h: 408, x: 71, y: 33, taille: 44, rot: 10 },
      { src: A("gingembre-chine.jpg"), w: 800, h: 800, x: 48, y: 76, taille: 48, rot: -6 },
    ],
  },
  {
    etiquette: "Le degré",
    titre: "Arrêtée à 6 % vol.",
    texte: [
      "Le degré se décide dès le départ : on choisit nos levures et on dose les fruits doux, car ce sont leurs sucres naturels qui deviendront l'alcool.",
      "Pendant toute la fermentation, chaque cuve est suivie de près. On prélève régulièrement quelques gouttes à la pipette pour mesurer la densité et le taux d'alcool, et goûter l'évolution des arômes.",
      "Quand le vin atteint 6 % vol., on arrête la fermentation par le froid, puis on le filtre pour retirer les levures. Le degré ne bouge plus.",
      "Résultat : un vin de fruits léger et désaltérant, au même degré d'une canette à l'autre.",
    ],
    fond: "var(--pamplemousse-accent)",
    texteCouleur: "var(--texte)",
    accent: "var(--bissap-accent)",
    visuels: [],
    bouquet: [{ src: A("pipette.png"), w: 432, h: 577, x: 50, y: 50, taille: 62, rot: 0 }],
  },
  {
    etiquette: "La canette",
    titre: "Stabilisé, puis mis en canette",
    texte: [
      "Avant la mise en canette, le vin est stabilisé : le degré reste celui de l'étiquette, de la cuve à votre verre.",
      "Il repose ensuite quelques jours au frais pour que les arômes s'harmonisent, puis il est mis en canettes de 330 ml, faciles à emporter et qui le protègent de la lumière.",
      "Les bulles de Passion Vive sont ajoutées au moment du conditionnement, pour un pétillant fin et vif.",
      "Il ne reste plus qu'à servir bien frais, entre amis, et à consommer avec modération.",
    ],
    fond: "var(--bissap)",
    texteCouleur: "var(--fond)",
    accent: "var(--passion)",
    visuels: [],
  },
];
