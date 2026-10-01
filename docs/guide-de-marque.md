# Elengi Fresh — Guide de marque

Projet portfolio fictif de Dan : site vitrine front-end pour une marque de boissons alcoolisées obtenues par fermentation de fruits.

## Concept

Elengi Fresh est une marque de vins de fruits inspirée de la tradition congolaise du vin de fruits. L'alcool vient uniquement de la fermentation naturelle des fruits (et d'une fleur, le bissap), sans alcool distillé.

- **Elengi** signifie « délicieux », « plaisir » en lingala.
- **Fresh** exprime la fraîcheur, symbolisée par le petit soleil du logo.
- Discours : « fruits et fleurs fermentés ». Le bissap est techniquement un calice de fleur, il est présenté comme l'édition signature de la gamme.

## La gamme

Toutes les boissons : **6 % vol. · 330 ml**. Le fruit principal fermente et produit l'alcool ; les autres ingrédients aromatisent.

| Boisson | Nom | Ingrédients (canette) | Couleur canette | Couleur badge (accent) |
|---|---|---|---|---|
| Pamplemousse | **Rose Piquante** | Pamplemousse, citron vert, gingembre | Rose corail `#FF6F7D` | Rose pâle `#FFD6DA` |
| Mangue | **Mangue Dorée** | Mangue, orange, vanille | Orange mangue `#FF9A1F` | Pêche `#FFE1B8` |
| Passion | **Passion Vive** | Fruit de la passion, citron, bulles | Jaune soleil `#FFD23F` | Crème `#FFF4C7` |
| Bissap (signature) | **Bissap Royal** | Bissap, menthe, gingembre | Pourpre `#6B0F3A` | Framboise `#C2185B` |

### Fabrication (contenu fictif, pour la page dédiée)

- Le fruit (ou le bissap) est pressé ou infusé, puis mis à fermenter avec des levures.
- Pamplemousse et passion, peu sucrés et très acides : coupés avec un peu d'eau et un ajout de sucre pour permettre la fermentation.
- Aromates : gingembre, agrumes et vanille pendant la fermentation ; menthe en infusion à froid à la fin.
- Taux d'alcool maîtrisé : sucre mesuré au départ, choix des levures, arrêt de la fermentation (froid, filtration) à 6 % vol.
- Stabilisation avant la mise en canette : le taux reste celui de l'étiquette. Bulles de Passion Vive ajoutées au conditionnement.

## Couleurs

### Couleurs des saveurs

Voir le tableau de la gamme. Règle : **la canette porte la couleur principale, le badge porte l'accent de la même saveur.**

### Neutres

| Rôle | Couleur |
|---|---|
| Fond clair | Blanc cassé chaud `#FFF8F0` |
| Texte | Brun très foncé `#2A1414` (à la place du noir) |

### Tokens CSS

```css
:root {
  --pamplemousse: #FF6F7D;
  --pamplemousse-accent: #FFD6DA;
  --mangue: #FF9A1F;
  --mangue-accent: #FFE1B8;
  --passion: #FFD23F;
  --passion-accent: #FFF4C7;
  --bissap: #6B0F3A;
  --bissap-accent: #C2185B;
  --fond: #FFF8F0;
  --texte: #2A1414;
}
```

## Logo principal et favicon

Comme sur le site de référence, une seule couleur de saveur sert de couleur principale au site : **le bissap (pourpre `#6B0F3A`)**, notre boisson signature et la seule couleur foncée de la gamme. Les autres couleurs ressortent dessus.

- **Barre de navigation** : `logo/elengi-fresh-logo-clair.svg` (texte blanc cassé, soleil jaune, sous-titre corail) sur fond pourpre.
- **Favicon** : version simplifiée du badge bissap, cercle framboise `#C2185B` avec un grand « E » blanc cassé et le soleil jaune. Le badge complet est illisible à 16 px, il reste réservé aux canettes et aux grands formats (icône de partage, réseaux sociaux).

### Fichiers du favicon (`favicon/`)

| Fichier | Usage |
|---|---|
| `favicon.svg` | Favicon vectoriel (navigateurs récents) |
| `favicon.ico` | Compatibilité (16, 32, 48 px) |
| `favicon-16x16.png`, `favicon-32x32.png` | Onglets |
| `apple-touch-icon.png` | Écran d'accueil iOS (180 px, fond pourpre) |
| `android-chrome-192x192.png`, `android-chrome-512x512.png` | Android et PWA |
| `site.webmanifest` | Manifeste (couleur de thème pourpre) |

### Intégration HTML

Copier le dossier `favicon/` à la racine publique du site, puis dans le `<head>` :

```html
<link rel="icon" href="/favicon/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon/favicon.ico" sizes="48x48">
<link rel="apple-touch-icon" href="/favicon/apple-touch-icon.png">
<link rel="manifest" href="/favicon/site.webmanifest">
<meta name="theme-color" content="#6B0F3A">
```

## Logo

Deux mots, avec un petit soleil à la place du point du « i » d'Elengi.

| Fichier | Usage |
|---|---|
| `logo/elengi-fresh-logo-clair.svg` | Logo horizontal pour fonds foncés (barre de navigation sur pourpre) |
| `logo/elengi-fresh-logo-fonce.svg` | Logo horizontal pour fonds clairs |
| `logo/elengi-fresh-badge-pamplemousse.svg` | Badge rond pour la canette pamplemousse |
| `logo/elengi-fresh-badge-mangue.svg` | Badge rond pour la canette mangue |
| `logo/elengi-fresh-badge-passion.svg` | Badge rond pour la canette passion |
| `logo/elengi-fresh-badge-bissap.svg` | Badge rond pour la canette bissap |
| `logo/elengi-fresh-planche.svg` | Planche récapitulative validée |

Règles d'usage :

- Logo horizontal : texte blanc cassé, soleil jaune soleil et sous-titre corail sur fond foncé ; texte brun, soleil orange et sous-titre framboise sur fond clair.
- Badge : cercle incliné de −6°, logo empilé (un mot par ligne). Texte brun sur les badges clairs, blanc cassé sur le badge bissap. Le soleil reprend la couleur de la canette (jaune sur le bissap).
- Sous-titre : « VIN DE FRUITS · CONGO » (logo horizontal), « VIN DE FRUITS » (badge).
- Le texte des SVG est vectorisé : aucun chargement de police nécessaire.

## Typographie

Police définitive : **Bricolage Grotesque** (Google Fonts, gratuite), une seule famille pour tout le site.

| Usage | Réglages |
|---|---|
| Logo et grands titres | ExtraBold 800, largeur 86, taille optique 96 |
| Sous-titres, boutons, petits textes forts | Bold 700 |
| Texte courant | Regular 400 |

```html
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,200..800&display=swap" rel="stylesheet">
```

```css
body { font-family: "Bricolage Grotesque", system-ui, sans-serif; }
h1, h2 { font-weight: 800; font-stretch: 86%; font-variation-settings: "opsz" 96; }
```

La planche `typographie/comparaison-polices.svg` garde la trace des alternatives écartées.

## Visuels des canettes (IA)

- Générés par IA, dans l'esprit du site de référence : canette sur fond uni, gouttes de condensation, fruits autour.
- Utiliser nos badges et nos couleurs comme référence. Nom de la boisson écrit verticalement sur la canette.
- Ne jamais reprendre le logo, la forme d'étiquette ou les illustrations de la référence.

## Site web

### Référence

[Slight Twist](https://www.slight-twist.co.nz/) : même concept (cocktails brassés sans alcool distillé, vrais fruits). On reprend la structure et l'esprit, avec notre propre identité.

### Structure prévue

1. Age gate (« Avez-vous plus de 18 ans ? »)
2. Hero : titre fort et canette en mouvement
3. Bandeau d'engagements (fermentation naturelle, vrais fruits, sans alcool distillé, vegan)
4. Galerie lifestyle
5. Le processus en 3 étapes animées : fruit → fermentation → bouteille
6. Texte défilant (marquee)
7. La gamme : carrousel déplaçable avec les 4 boissons et leurs ingrédients
8. Slider produit plein écran, le fond prenant la couleur de chaque saveur (bissap en dernier)
9. Pack découverte des 4 boissons
10. Footer : newsletter, réseaux sociaux, mentions légales

Page supplémentaire : **Notre fabrication**, qui raconte en détail comment les boissons sont faites (contenu fictif, voir la section Fabrication).

## Structure du dossier

```
elengi-fresh/
├── README.md
├── logo/            SVG du logo et des badges
├── favicon/         Favicon dans tous les formats + manifeste
├── typographie/     Planche de comparaison des polices
└── scripts/         Scripts Python de génération des SVG
```
