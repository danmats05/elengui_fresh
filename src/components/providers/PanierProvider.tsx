"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { findDrink, type DrinkSlug } from "@/data/drinks";
import { packs } from "@/data/produits";

const CLE = "elengi-fresh:panier";

export type Ligne = { slug: DrinkSlug; canettes: number; quantite: number };

type PanierValue = {
  lignes: Ligne[];
  /** Nombre total de packs */
  articles: number;
  sousTotal: number;
  ouvert: boolean;
  ouvrir: () => void;
  fermer: () => void;
  ajouter: (slug: DrinkSlug, canettes: number, quantite: number) => void;
  changerQuantite: (slug: DrinkSlug, canettes: number, quantite: number) => void;
  retirer: (slug: DrinkSlug, canettes: number) => void;
  vider: () => void;
};

const PanierContext = createContext<PanierValue | null>(null);

export const prixPack = (canettes: number) => packs.find((p) => p.canettes === canettes)?.prix ?? 0;

const valide = (l: unknown): l is Ligne =>
  !!l &&
  typeof l === "object" &&
  !!findDrink((l as Ligne).slug) &&
  packs.some((p) => p.canettes === (l as Ligne).canettes) &&
  Number.isInteger((l as Ligne).quantite) &&
  (l as Ligne).quantite > 0;

/** Panier de la vitrine (pas de paiement réel), conservé dans le navigateur. */
export function PanierProvider({ children }: { children: React.ReactNode }) {
  const [lignes, setLignes] = useState<Ligne[]>([]);
  const [ouvert, setOuvert] = useState(false);

  // Lecture différée : le stockage n'existe pas au rendu serveur.
  useEffect(() => {
    let lu: Ligne[] = [];
    try {
      const brut = JSON.parse(localStorage.getItem(CLE) ?? "[]");
      if (Array.isArray(brut)) lu = brut.filter(valide);
    } catch {}
    if (lu.length) queueMicrotask(() => setLignes(lu));
  }, []);

  const enregistrer = useCallback((maj: (l: Ligne[]) => Ligne[]) => {
    setLignes((avant) => {
      const apres = maj(avant).filter((l) => l.quantite > 0);
      try {
        localStorage.setItem(CLE, JSON.stringify(apres));
      } catch {}
      return apres;
    });
  }, []);

  const ajouter = useCallback(
    (slug: DrinkSlug, canettes: number, quantite: number) => {
      enregistrer((l) => {
        const existe = l.some((x) => x.slug === slug && x.canettes === canettes);
        return existe
          ? l.map((x) => (x.slug === slug && x.canettes === canettes ? { ...x, quantite: x.quantite + quantite } : x))
          : [...l, { slug, canettes, quantite }];
      });
      setOuvert(true);
    },
    [enregistrer],
  );

  const changerQuantite = useCallback(
    (slug: DrinkSlug, canettes: number, quantite: number) =>
      enregistrer((l) =>
        l.map((x) => (x.slug === slug && x.canettes === canettes ? { ...x, quantite: Math.min(20, quantite) } : x)),
      ),
    [enregistrer],
  );

  const retirer = useCallback(
    (slug: DrinkSlug, canettes: number) =>
      enregistrer((l) => l.filter((x) => !(x.slug === slug && x.canettes === canettes))),
    [enregistrer],
  );

  const vider = useCallback(() => enregistrer(() => []), [enregistrer]);

  const valeur = useMemo<PanierValue>(
    () => ({
      lignes,
      articles: lignes.reduce((n, l) => n + l.quantite, 0),
      sousTotal: lignes.reduce((n, l) => n + l.quantite * prixPack(l.canettes), 0),
      ouvert,
      ouvrir: () => setOuvert(true),
      fermer: () => setOuvert(false),
      ajouter,
      changerQuantite,
      retirer,
      vider,
    }),
    [lignes, ouvert, ajouter, changerQuantite, retirer, vider],
  );

  return <PanierContext.Provider value={valeur}>{children}</PanierContext.Provider>;
}

export function usePanier() {
  const ctx = useContext(PanierContext);
  if (!ctx) throw new Error("usePanier doit être utilisé dans <PanierProvider>");
  return ctx;
}
