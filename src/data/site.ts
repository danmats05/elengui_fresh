export const navLinks = [
  { label: "Nos boissons", href: "/#gamme" },
  { label: "Notre fabrication", href: "/fabrication" },
] as const;

/** Libellé de l'entrée de navigation qui ouvre la liste des dépôts. */
export const LIBELLE_DEPOTS = "Où nous trouver";

export const AGE_STORAGE_KEY = "elengi-fresh:majeur";

/** Bandeau d'engagements, sur deux lignes. */
export const engagements = [
  ["Fermentation naturelle", "Vrais fruits", "Sans alcool distillé"],
  ["Fruits et fleurs", "Tradition congolaise", "Levures sélectionnées", "6 % vol."],
] as const;
