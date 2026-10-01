/*
 * Contenu des pages légales. Projet portfolio fictif : l'entreprise, les numéros d'immatriculation et
 * l'adresse sont des EXEMPLES à remplacer avant toute mise en ligne réelle.
 */

export const CONTACT = "bonjour@elengi-fresh.fr";
export const MISE_A_JOUR = "1er octobre 2026";

export type Bloc = { titre: string; paragraphes?: string[]; liste?: string[] };
/** `court` : libellé des liens du pied de page. */
export type PageLegale = { slug: string; titre: string; court: string; intro: string; blocs: Bloc[] };

export const pagesLegales: PageLegale[] = [
  {
    slug: "mentions-legales",
    court: "Mentions légales",
    titre: "Mentions légales",
    intro: "Les informations sur l'éditeur du site et son hébergement.",
    blocs: [
      {
        titre: "Éditeur du site",
        paragraphes: [
          "Elengi Fresh SARL (exemple), société au capital de 1 000 000 FCFA.",
          "Siège social : 12 avenue de la Paix, Brazzaville, République du Congo (adresse d'exemple).",
          "RCCM : CG-BZV-00-2026-B00-00000 · NIU : M0000000000000 (numéros d'exemple).",
          `Contact : ${CONTACT}.`,
        ],
      },
      { titre: "Directeur de la publication", paragraphes: ["Le gérant d'Elengi Fresh SARL."] },
      {
        titre: "Hébergement",
        paragraphes: ["Vercel Inc., 440 N Barranca Ave #4133, Covina, CA 91723, États-Unis — vercel.com."],
      },
      {
        titre: "Propriété intellectuelle",
        paragraphes: [
          "Le nom Elengi Fresh, les logos, les badges, les textes et les visuels du site sont protégés. Toute reproduction, même partielle, sans autorisation écrite est interdite.",
        ],
      },
      {
        titre: "Vente d'alcool",
        paragraphes: [
          "La vente d'alcool est interdite aux mineurs. L'accès au site est réservé aux personnes de plus de 18 ans, et une pièce d'identité peut être demandée à la livraison.",
          "L'abus d'alcool est dangereux pour la santé, à consommer avec modération.",
        ],
      },
    ],
  },
  {
    slug: "confidentialite",
    court: "Confidentialité",
    titre: "Politique de confidentialité",
    intro: "Quelles données nous collectons, pourquoi, et comment vous gardez la main dessus.",
    blocs: [
      {
        titre: "Données collectées",
        liste: [
          "À la commande : prénom, nom, e-mail, téléphone et adresse de livraison.",
          "À l'inscription à la newsletter : votre adresse e-mail.",
          "Dans votre navigateur : votre confirmation d'âge et le contenu de votre panier (stockage local, jamais transmis).",
        ],
      },
      {
        titre: "Utilisation",
        liste: [
          "Préparer, livrer et suivre vos commandes.",
          "Vous envoyer la newsletter et le code de bienvenue, si vous l'avez demandé.",
          "Répondre à vos messages.",
        ],
        paragraphes: ["Vos données ne sont jamais vendues ni louées."],
      },
      {
        titre: "Durée de conservation",
        paragraphes: [
          "Les données de commande sont conservées pendant la durée légale de conservation des pièces comptables. L'inscription à la newsletter prend fin dès votre désinscription.",
        ],
      },
      {
        titre: "Vos droits",
        paragraphes: [
          `Vous pouvez accéder à vos données, les corriger ou demander leur suppression en écrivant à ${CONTACT}. Chaque newsletter contient aussi un lien de désinscription.`,
        ],
      },
      {
        titre: "Cookies",
        paragraphes: [
          "Le site n'utilise ni cookie publicitaire ni outil de suivi. Seul le stockage local de votre navigateur sert à mémoriser votre âge et votre panier.",
        ],
      },
    ],
  },
  {
    slug: "conditions-de-vente",
    court: "Conditions de vente",
    titre: "Conditions générales de vente",
    intro: "Les règles qui s'appliquent à toute commande passée sur elengi-fresh.",
    blocs: [
      {
        titre: "Produits",
        paragraphes: [
          "Elengi Fresh vend des vins de fruits fermentés à 6 % vol., en canettes de 330 ml, par packs de 4, 8 ou 12. Les visuels sont non contractuels.",
        ],
      },
      {
        titre: "Âge minimum",
        paragraphes: [
          "En passant commande, vous certifiez avoir plus de 18 ans. Le livreur peut demander une pièce d'identité et refuser la remise du colis en cas de doute.",
        ],
      },
      {
        titre: "Prix",
        paragraphes: [
          "Les prix sont indiqués en francs CFA (FCFA), toutes taxes comprises. Les frais de livraison éventuels sont indiqués avant la validation de la commande.",
        ],
      },
      {
        titre: "Commande et paiement",
        paragraphes: [
          "La commande est confirmée par e-mail avec son numéro. Le paiement se fait à la livraison, en espèces ou par mobile money.",
        ],
      },
      {
        titre: "Retours et réclamations",
        paragraphes: [
          `Pour des raisons d'hygiène, les canettes ouvertes ne sont ni reprises ni échangées. Un pack abîmé ou incomplet peut être refusé à la livraison ; signalez-nous tout problème sous 48 h à ${CONTACT}, nous le remplaçons.`,
        ],
      },
      {
        titre: "Droit applicable",
        paragraphes: ["Les présentes conditions sont soumises au droit de la République du Congo."],
      },
    ],
  },
  {
    slug: "livraison",
    court: "Livraison",
    titre: "Livraison",
    intro: "Où nous livrons, en combien de temps, et comment se passe la remise.",
    blocs: [
      {
        titre: "Zones et délais",
        liste: [
          "Brazzaville et Pointe-Noire : sous 48 h ouvrées.",
          "Dolisie, Nkayi, Ouesso : de 3 à 5 jours ouvrés.",
          "Autres villes : sur demande, écrivez-nous.",
        ],
      },
      {
        titre: "Frais",
        paragraphes: [
          "La livraison est offerte à Brazzaville et Pointe-Noire dès 2 packs. Dans les autres cas, les frais sont indiqués avant la validation de la commande.",
        ],
      },
      {
        titre: "Remise du colis",
        paragraphes: [
          "Le livreur vous appelle avant de passer. Gardez une pièce d'identité à portée de main : la remise d'alcool à un mineur est interdite.",
        ],
      },
      {
        titre: "Conservation",
        paragraphes: [
          "Nos vins de fruits se gardent au frais, à l'abri du soleil, et se dégustent bien frais. Une fois la canette ouverte, à boire rapidement.",
        ],
      },
    ],
  },
];

export const pageLegale = (slug: string) => pagesLegales.find((p) => p.slug === slug);
