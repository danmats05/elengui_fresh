# Brief Claude Code : site Elengi Fresh (V1)

Ce fichier est à la racine du projet. Il décrit tout ce qu'il faut pour construire la première version du site. Le guide de marque complet est dans `docs/guide-de-marque.md`. Les captures du site de référence sont dans `references/`.

## Contexte

- Projet portfolio fictif : site vitrine d'Elengi Fresh, marque congolaise de vins de fruits fermentés (6 % vol., canettes 330 ml).
- Objectif : démontrer un front-end de haut niveau (animations au scroll, slider produit, carrousel draggable, transitions de couleur).
- Inspiration : slight-twist.co.nz. Les captures d'écran fournies servent **uniquement** de référence de mise en page, de rythme et d'animation. Ne jamais reprendre leurs textes, leur logo, leurs illustrations ni leurs images.
- **Tous les textes du site sont en français.**

## Stack

- Next.js (App Router) + TypeScript
- Tailwind CSS
- GSAP + ScrollTrigger (animations), Lenis (défilement fluide) — déjà installés par Dan
- Police via `next/font/google` : Bricolage Grotesque
- Déploiement prévu sur Vercel

## Design tokens

```css
:root {
  --pamplemousse: #FF6F7D;
  --pamplemousse-accent: #FFD6DA;
  --mangue: #FF9A1F;
  --mangue-accent: #FFE1B8;
  --passion: #FFD23F;
  --passion-accent: #FFF4C7;
  --bissap: #6B0F3A;          /* couleur principale du site */
  --bissap-accent: #C2185B;
  --fond: #FFF8F0;            /* blanc cassé chaud */
  --texte: #2A1414;           /* brun très foncé, à la place du noir */
}
```

- Couleur principale du site : **pourpre bissap** (fond du header, du hero et du footer). Texte clair `--fond` dessus.
- Chaque boisson a sa couleur ; le fond des sections produit prend la couleur de la boisson affichée.

### Typographie

- Une seule famille : Bricolage Grotesque.
- Titres : ExtraBold 800, `font-stretch: 86%`, axe `opsz` à 96, interlignage serré (≈ 0.9), approche légèrement négative.
- Sous-titres, boutons : Bold 700. Texte courant : Regular 400.

## Assets

```
public/
├── brand/
│   ├── elengi-fresh-logo-clair.svg      # header (sur pourpre)
│   ├── elengi-fresh-logo-fonce.svg      # sur fonds clairs
│   └── elengi-fresh-badge-*.svg         # badges par saveur
├── favicon/                              # tous les formats + site.webmanifest
└── cans/                                 # canettes PNG transparentes (à venir)
    ├── rose-piquante.png
    ├── mangue-doree.png
    ├── passion-vive.png
    └── bissap-royal.png
```

Tant que les canettes ne sont pas prêtes : afficher un placeholder (rectangle arrondi vertical de la couleur de la boisson, avec le badge correspondant). Les photos lifestyle viendront plus tard : placeholders colorés aux bons ratios.

## Données produits (`src/data/drinks.ts`)

```ts
export const drinks = [
  {
    slug: "rose-piquante",
    name: "Rose Piquante",
    fruit: "Pamplemousse",
    flavors: ["Citron vert", "Gingembre"],
    notes: ["Acidulée et vive", "Une pointe de gingembre", "Finale citronnée"],
    color: "#FF6F7D", accent: "#FFD6DA", text: "#FFF8F0",
    badge: "/brand/elengi-fresh-badge-pamplemousse.svg",
    can: "/cans/rose-piquante.png",
  },
  {
    slug: "mangue-doree",
    name: "Mangue Dorée",
    fruit: "Mangue",
    flavors: ["Orange", "Vanille"],
    notes: ["Ronde et gourmande", "Mangue bien mûre", "Touche de vanille"],
    color: "#FF9A1F", accent: "#FFE1B8", text: "#FFF8F0",
    badge: "/brand/elengi-fresh-badge-mangue.svg",
    can: "/cans/mangue-doree.png",
  },
  {
    slug: "passion-vive",
    name: "Passion Vive",
    fruit: "Fruit de la passion",
    flavors: ["Citron", "Bulles"],
    notes: ["Pétillante", "Exotique et intense", "Fraîcheur citronnée"],
    color: "#FFD23F", accent: "#FFF4C7", text: "#2A1414",
    badge: "/brand/elengi-fresh-badge-passion.svg",
    can: "/cans/passion-vive.png",
  },
  {
    slug: "bissap-royal",
    name: "Bissap Royal",
    fruit: "Bissap (hibiscus)",
    flavors: ["Menthe", "Gingembre"],
    notes: ["Notre édition signature", "Fleur d'hibiscus profonde", "Finale mentholée"],
    color: "#6B0F3A", accent: "#C2185B", text: "#FFF8F0",
    badge: "/brand/elengi-fresh-badge-bissap.svg",
    can: "/cans/bissap-royal.png",
  },
] as const;

export const abv = "6 % vol.";
export const volume = "330 ml";
```

## Pages

### `/` Accueil

1. **Age gate** : modale plein écran au premier chargement, « Avez-vous plus de 18 ans ? » avec « Oui » / « Non ». « Oui » ferme et mémorise le choix (localStorage, try/catch). « Non » affiche un message de refus. Bloque le scroll tant qu'elle est ouverte.
2. **Header** : logo clair à gauche, liens en pilules arrondies (« Nos boissons », « Notre fabrication », « Où nous trouver »). Fond transparent sur le hero, devient pourpre au scroll.
3. **Hero** (fond pourpre) : très grand titre sur 2 lignes, phrase courte, bouton « Découvrir la gamme ». Canette Bissap Royal à droite, inclinée, qui flotte doucement ; légère parallaxe au scroll.
4. **Bandeau d'engagements** : deux lignes en petites capitales — « Fermentation naturelle · Vrais fruits · Sans alcool distillé · Vegan ».
5. **Galerie lifestyle** : bande de photos qui défile horizontalement en continu (placeholders pour l'instant).
6. **Notre processus** : 3 étapes animées au scroll — Le fruit → La fermentation → La canette. Lien vers `/fabrication`.
7. **Marquee** : phrase en très gros qui défile en boucle, par ex. « Le fruit, rien que le fruit ».
8. **La gamme** : carrousel draggable (souris et tactile) des 4 canettes, nom + ingrédients sous chaque canette. Mention « Faites glisser ».
9. **Slider produit plein écran** : un écran par boisson, le fond prend la couleur de la boisson avec une transition fluide ; canette à droite, à gauche le nom en très grand, les ingrédients, les 3 notes et un bouton. Navigation par pastilles de couleur. Bissap Royal en dernier.
10. **Pack découverte** : les 4 canettes ensemble, « 4 × 330 ml », bouton.
11. **Footer** (pourpre) : liens, réseaux sociaux, newsletter (« Inscrivez-vous et recevez 10 % sur votre première commande »), mentions légales, « L'abus d'alcool est dangereux pour la santé, à consommer avec modération. »

### `/fabrication` Notre fabrication

Page éditoriale (contenu fictif) : le fruit pressé ou infusé, la fermentation avec des levures, l'ajout de sucre pour le pamplemousse et la passion, les aromates (gingembre, agrumes, vanille pendant la fermentation ; menthe en infusion à froid), l'arrêt de la fermentation à 6 % vol., la stabilisation avant la mise en canette. Une étape par section, révélées au scroll.

## Qualité attendue

- Responsive jusqu'au mobile (le slider produit devient vertical, le carrousel reste draggable au doigt).
- `prefers-reduced-motion` respecté : animations désactivées ou réduites.
- Focus clavier visible, contrastes suffisants, `alt` sur toutes les images.
- Animations GSAP nettoyées au démontage (`gsap.context` / `useGSAP`).
- Composants séparés par section dans `src/components/sections/`.

## Ce qu'il ne faut pas faire

- Copier les textes, le logo, le parasol ou les photos de la référence.
- Mettre du texte en anglais.
- Utiliser du noir pur : toujours `--texte`.
