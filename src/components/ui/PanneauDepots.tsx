"use client";

import { depots } from "@/data/depots";

/** Icône de dépôt affichée en masque : la forme vient du PNG, la couleur de chaque dépôt. */
const ICONE = 'url("/assets/icons8-warehouse-100.png") center / contain no-repeat';

const parVille = depots.reduce<Record<string, typeof depots>>((acc, d) => {
  (acc[d.ville] ??= []).push(d);
  return acc;
}, {});

/** Liste des dépôts groupés par ville (utilisée dans la navbar desktop et le menu mobile). */
export default function ListeDepots({ compacte = false }: { compacte?: boolean }) {
  return (
    <div className={compacte ? "space-y-5" : "grid gap-x-10 gap-y-7 sm:grid-cols-2"}>
      {Object.entries(parVille).map(([ville, liste]) => (
        <section key={ville} data-depot-ville>
          <h3 className="etiquette text-xs text-passion">{ville}</h3>
          <ul className="mt-2 space-y-3">
            {liste.map((d) => (
              <li key={d.nom} className="flex gap-3.5">
                <span
                  aria-hidden="true"
                  className="mt-0.5 h-6 w-6 shrink-0"
                  style={{ backgroundColor: d.couleur, mask: ICONE, WebkitMask: ICONE }}
                />
                <div>
                  <p className="font-titre font-bold text-fond">{d.nom}</p>
                  <p className="text-sm leading-snug text-fond/75">{d.adresse}</p>
                  <p className="text-sm text-fond/75">
                    {d.horaires} ·{" "}
                    <a
                      href={`tel:${d.telephone.replace(/\s/g, "")}`}
                      className="hover:text-passion-accent hover:underline"
                    >
                      {d.telephone}
                    </a>
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
