/*
 * Dépôts Elengi Fresh. Projet portfolio fictif : adresses et numéros sont des EXEMPLES
 * (quartiers réels, rues et numéros inventés). À remplacer par les vrais points de vente.
 */

export type Depot = {
  ville: string;
  nom: string;
  adresse: string;
  horaires: string;
  telephone: string;
  couleur: string;
};

export const depots: Depot[] = [
  {
    ville: "Brazzaville",
    nom: "Dépôt Poto-Poto",
    adresse: "Avenue de la Paix, près du marché de Poto-Poto",
    horaires: "Lun – Sam · 9 h – 20 h",
    telephone: "+242 06 000 00 01",
    couleur: "var(--pamplemousse)",
  },
  {
    ville: "Brazzaville",
    nom: "Dépôt Bacongo",
    adresse: "Rue Bakongo, en face du rond-point",
    horaires: "Lun – Dim · 10 h – 21 h",
    telephone: "+242 06 000 00 02",
    couleur: "var(--mangue)",
  },
  {
    ville: "Pointe-Noire",
    nom: "Dépôt Centre-ville",
    adresse: "Boulevard Charles de Gaulle, à côté de la grande poste",
    horaires: "Lun – Sam · 9 h – 20 h",
    telephone: "+242 06 000 00 03",
    couleur: "var(--passion)",
  },
  {
    ville: "Pointe-Noire",
    nom: "Dépôt Loandjili",
    adresse: "Route de Loandjili, quartier Mpita",
    horaires: "Mar – Dim · 10 h – 21 h",
    telephone: "+242 06 000 00 04",
    couleur: "var(--bissap-accent)",
  },
  {
    ville: "Dolisie",
    nom: "Dépôt du Marché",
    adresse: "Avenue principale, face au grand marché",
    horaires: "Lun – Sam · 9 h – 19 h",
    telephone: "+242 06 000 00 05",
    couleur: "var(--pamplemousse)",
  },
  {
    ville: "Ouesso",
    nom: "Dépôt du Port",
    adresse: "Quai de la Sangha, près du port",
    horaires: "Lun – Sam · 9 h – 18 h",
    telephone: "+242 06 000 00 06",
    couleur: "var(--mangue)",
  },
];
