"use client";

import { useEffect, useRef } from "react";
import { useLenis } from "lenis/react";
import { abv, volume, type Drink } from "@/data/drinks";
import { nutrition, tableauNutritionnel } from "@/data/produits";

type Props = { drink: Drink; ouvert: boolean; onFermer: () => void };

/** Fenêtre modale (<dialog> natif : focus piégé, Échap) avec ingrédients et tableau nutritionnel. */
export default function PanneauNutrition({ drink, ouvert, onFermer }: Props) {
  const ref = useRef<HTMLDialogElement>(null);
  const lenis = useLenis();
  const infos = nutrition[drink.slug];
  const tableau = tableauNutritionnel(drink.slug);

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (ouvert && !d.open) {
      d.showModal();
      lenis?.stop();
    } else if (!ouvert && d.open) {
      d.close();
    }
    if (!ouvert) lenis?.start();
  }, [ouvert, lenis]);

  return (
    <dialog
      ref={ref}
      onClose={onFermer}
      onClick={(e) => e.target === e.currentTarget && onFermer()}
      aria-labelledby="nutrition-titre"
      data-lenis-prevent
      className="m-auto max-h-[90svh] w-[min(56rem,calc(100vw-2rem))] overflow-y-auto rounded-[1.75rem] p-0 backdrop:bg-texte/70 backdrop:backdrop-blur-sm open:animate-[nutrition-in_0.4s_var(--ease-out)]"
      style={{ backgroundColor: drink.color, color: drink.text }}
    >
      <div className="relative px-6 pb-10 pt-14 md:px-16 md:pb-14 md:pt-16">
        <button
          type="button"
          onClick={onFermer}
          aria-label="Fermer le tableau nutritionnel"
          className="absolute right-4 top-4 grid h-11 w-11 place-items-center rounded-full hover:bg-texte/10 md:right-6 md:top-6"
        >
          <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7">
            <path d="M5 5l14 14M19 5 5 19" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        </button>

        <div className="mx-auto max-w-[36rem] text-center">
          <h2 id="nutrition-titre" className="font-titre text-3xl md:text-4xl">
            {drink.name}
          </h2>
          <p className="mt-2 text-lg leading-snug opacity-90 md:text-xl">{infos.denomination}</p>
          <p className="mt-4 text-sm leading-relaxed md:text-base">
            <strong className="font-titre font-bold">Ingrédients&nbsp;:</strong> {infos.ingredients}
          </p>
          <p className="mt-2 text-sm opacity-85">
            {abv} · {volume}
          </p>
        </div>

        <table className="mx-auto mt-8 w-full max-w-[38rem] border-collapse border border-current text-sm md:text-base">
          <caption className="etiquette border border-b-0 border-current py-2.5 text-sm">
            Valeurs nutritionnelles moyennes
          </caption>
          <thead>
            <tr className="etiquette text-[0.6875rem] md:text-xs">
              <th scope="col" className="border border-current px-3 py-2 text-left font-normal">
                <span className="sr-only">Nutriment</span>
              </th>
              <th scope="col" className="border border-current px-3 py-2 text-right font-normal">
                Par canette ({volume})
              </th>
              <th scope="col" className="border border-current px-3 py-2 text-right font-normal">
                Pour 100 ml
              </th>
            </tr>
          </thead>
          <tbody>
            <tr aria-hidden="true">
              <td colSpan={2} className="pt-2" />
              <td className="border-l border-current pt-2" />
            </tr>
            {tableau.lignes.map(([libelle, canette, cent, sousLigne], i) => (
              <tr key={i}>
                <th
                  scope="row"
                  className={`px-3 py-1.5 text-left align-baseline font-normal ${sousLigne ? "pl-7" : ""}`}
                >
                  {libelle}
                </th>
                <td className="px-3 py-1.5 text-right align-baseline tabular-nums">{canette}</td>
                <td className="border-l border-current px-3 py-1.5 text-right align-baseline tabular-nums">{cent}</td>
              </tr>
            ))}
            <tr aria-hidden="true">
              <td colSpan={2} className="pb-2" />
              <td className="border-l border-current pb-2" />
            </tr>
          </tbody>
        </table>

        <p className="mx-auto mt-5 max-w-[38rem] text-center text-xs opacity-75">
          Valeurs indicatives. L&apos;abus d&apos;alcool est dangereux pour la santé, à consommer avec modération.
        </p>
      </div>
    </dialog>
  );
}
