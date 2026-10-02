"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useLenis } from "lenis/react";
import { usePathname } from "next/navigation";
import { findDrink, getDrink } from "@/data/drinks";
import { themes } from "@/data/themes";
import { formatPrix } from "@/data/produits";
import { prixPack, usePanier } from "@/components/providers/PanierProvider";
import Can from "@/components/ui/Can";
import { CommandeValidee, FormulaireCommande, type Client } from "@/components/ui/Commande";
import { gsap, useGSAP, FULL_MOTION } from "@/lib/gsap";

/** Panier en tiroir latéral (<dialog> natif : focus piégé, Échap). */
export default function TiroirPanier() {
  const { lignes, articles, sousTotal, ouvert, fermer, changerQuantite, retirer, vider } = usePanier();
  const ref = useRef<HTMLDialogElement>(null);
  const lenis = useLenis();
  const [note, setNote] = useState("");
  const [etape, setEtape] = useState<"panier" | "coordonnees" | "validee">("panier");
  const [commande, setCommande] = useState<{ client: Client; numero: string } | null>(null);
  const contenu = useRef<HTMLDivElement>(null);

  // Chaque changement d'étape arrive en glissant légèrement depuis la droite.
  useGSAP(
    () => {
      gsap.matchMedia().add(FULL_MOTION, () => {
        gsap.from(contenu.current, { x: 40, autoAlpha: 0, duration: 0.5, ease: "power3.out" });
      });
    },
    { dependencies: [etape] },
  );

  const valider = (client: Client) => {
    const numero = `EF-${Math.floor(100000 + Math.random() * 900000)}`;
    setCommande({ client, numero });
    vider();
    setNote("");
    setEtape("validee");
  };

  // Sur une fiche, le panier prend les couleurs de la boisson ; ailleurs, le pourpre du site.
  const boisson = findDrink(usePathname().split("/boissons/")[1] ?? "");
  const couleurs = (
    boisson
      ? {
          "--p-fond": boisson.color,
          "--p-texte": boisson.text,
          "--p-accent": themes[boisson.slug].libelle,
          "--p-bouton": themes[boisson.slug].bouton.fond,
          "--p-bouton-texte": themes[boisson.slug].bouton.texte,
          "--flow-remplissage": themes[boisson.slug].bouton.remplissage,
        }
      : {
          "--p-fond": "var(--bissap)",
          "--p-texte": "var(--fond)",
          "--p-accent": "var(--passion-accent)",
          "--p-bouton": "var(--passion-accent)",
          "--p-bouton-texte": "var(--texte)",
          "--flow-remplissage": "var(--passion)",
        }
  ) as React.CSSProperties;

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (ouvert && !d.open) {
      delete d.dataset.fermeture;
      d.showModal();
      lenis?.stop();
      return;
    }
    if (ouvert || !d.open) {
      if (!ouvert) lenis?.start();
      return;
    }

    // Fermeture : le tiroir repart vers la droite avant de quitter la couche supérieure.
    const terminer = () => {
      d.close();
      delete d.dataset.fermeture;
      lenis?.start();
    };
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return terminer();
    d.dataset.fermeture = "";
    const filet = window.setTimeout(terminer, 500);
    const fin = (e: AnimationEvent) => {
      if (e.target !== d) return;
      window.clearTimeout(filet);
      terminer();
    };
    d.addEventListener("animationend", fin, { once: true });
    return () => {
      window.clearTimeout(filet);
      d.removeEventListener("animationend", fin);
    };
  }, [ouvert, lenis]);

  return (
    <dialog
      ref={ref}
      onCancel={(e) => {
        // Échap : on passe par l'animation de fermeture au lieu de la fermeture instantanée.
        e.preventDefault();
        fermer();
      }}
      onClose={() => {
        fermer();
        if (etape !== "coordonnees") setEtape("panier");
      }}
      onClick={(e) => e.target === e.currentTarget && fermer()}
      aria-labelledby="panier-titre"
      data-lenis-prevent
      style={couleurs}
      className="tiroir m-3 ml-auto h-[calc(100dvh-1.5rem)] max-h-none w-[calc(100%-1.5rem)] max-w-[34rem] overflow-hidden rounded-[2rem] shadow-[0_24px_60px_rgb(42_20_20/0.45)] md:m-5 md:ml-auto md:h-[calc(100dvh-2.5rem)] bg-[var(--p-fond)] p-0 text-[var(--p-texte)] backdrop:bg-texte/55 backdrop:backdrop-blur-[2px]"
    >
      <div className="flex h-full flex-col px-6 pb-6 pt-7 md:px-10 md:pt-9">
        <div className="flex items-center justify-between border-b-2 border-[var(--p-accent)] pb-4">
          <h2 id="panier-titre" tabIndex={-1} autoFocus className="text-4xl outline-none">
            {etape === "coordonnees" ? "Vos coordonnées" : etape === "validee" ? "Merci\u00a0!" : "Votre panier"}
          </h2>
          <button
            type="button"
            onClick={(e) => {
              // Tour complet de la croix (animation CSS « croix-tourne ») pendant que le panier se referme.
              const bouton = e.currentTarget;
              bouton.dataset.tourne = "";
              window.setTimeout(() => delete bouton.dataset.tourne, 600);
              fermer();
            }}
            aria-label="Fermer le panier"
            className="croix group grid h-11 w-11 place-items-center rounded-full hover:bg-current/10"
          >
            <svg
              viewBox="0 0 24 24"
              aria-hidden="true"
              className="h-7 w-7 transition-[rotate] duration-300 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:rotate-90 group-focus-visible:rotate-90"
            >
              <path
                d="M5 5l14 14M19 5 5 19"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
          </button>
        </div>

        <div ref={contenu} className="flex min-h-0 flex-1 flex-col">
          {etape === "coordonnees" && lignes.length > 0 ? (
            <FormulaireCommande
              total={sousTotal}
              articles={articles}
              onRetour={() => setEtape("panier")}
              onValider={valider}
            />
          ) : etape === "validee" && commande ? (
            <CommandeValidee client={commande.client} numero={commande.numero} onTerminer={fermer} />
          ) : (
            <>
              <div className="-mx-2 flex-1 overflow-y-auto px-2">
                {lignes.length === 0 ? (
                  <div className="flex h-full flex-col items-center justify-center gap-5 text-center">
                    <p className="text-xl opacity-85">Votre panier est vide.</p>
                    <Link
                      href="/#gamme"
                      onClick={fermer}
                      className="pilule bouton flow bg-[var(--p-bouton)] text-[var(--p-bouton-texte)]"
                    >
                      Découvrir la gamme
                    </Link>
                  </div>
                ) : (
                  <>
                    <ul className="divide-y divide-current/20">
                      {lignes.map((l) => {
                        const d = getDrink(l.slug);
                        return (
                          <li key={`${l.slug}-${l.canettes}`} className="flex gap-5 py-6">
                            <div
                              className="grid h-32 w-28 shrink-0 place-items-center rounded-2xl"
                              style={{ backgroundColor: d.accent }}
                            >
                              <Can drink={d} sizes="3rem" className="h-[82%] w-auto -rotate-6" />
                            </div>
                            <div className="flex flex-1 flex-col">
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <Link
                                    href={`/boissons/${d.slug}`}
                                    onClick={fermer}
                                    className="font-titre text-xl font-bold hover:underline"
                                  >
                                    {d.name}
                                  </Link>
                                  <p className="text-sm opacity-75">Pack de {l.canettes}</p>
                                </div>
                                <p className="font-titre text-lg font-bold tabular-nums">
                                  {formatPrix(prixPack(l.canettes) * l.quantite)}
                                </p>
                              </div>

                              <div
                                className="mt-3 flex w-fit items-center gap-1 rounded-xl ring-2 ring-inset ring-[var(--p-accent)]"
                                role="group"
                                aria-label={`Quantité de ${d.name}, pack de ${l.canettes}`}
                              >
                                <button
                                  type="button"
                                  onClick={() =>
                                    l.quantite > 1
                                      ? changerQuantite(l.slug, l.canettes, l.quantite - 1)
                                      : retirer(l.slug, l.canettes)
                                  }
                                  aria-label="Retirer un pack"
                                  className="grid h-10 w-10 place-items-center rounded-xl hover:bg-current/10"
                                >
                                  <svg viewBox="0 0 20 20" aria-hidden="true" className="h-5 w-5">
                                    <path d="M4 10h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                                  </svg>
                                </button>
                                <output aria-live="polite" className="min-w-6 text-center tabular-nums">
                                  {l.quantite}
                                </output>
                                <button
                                  type="button"
                                  onClick={() => changerQuantite(l.slug, l.canettes, l.quantite + 1)}
                                  disabled={l.quantite >= 20}
                                  aria-label="Ajouter un pack"
                                  className="grid h-10 w-10 place-items-center rounded-xl hover:bg-current/10 disabled:opacity-40"
                                >
                                  <svg viewBox="0 0 20 20" aria-hidden="true" className="h-5 w-5">
                                    <path
                                      d="M4 10h12M10 4v12"
                                      stroke="currentColor"
                                      strokeWidth="1.8"
                                      strokeLinecap="round"
                                    />
                                  </svg>
                                </button>
                              </div>
                              <button
                                type="button"
                                onClick={() => retirer(l.slug, l.canettes)}
                                className="mt-2 w-fit text-sm opacity-75 underline-offset-4 hover:opacity-100 hover:underline"
                              >
                                Retirer
                              </button>
                            </div>
                          </li>
                        );
                      })}
                    </ul>

                    <label htmlFor="panier-note" className="mt-4 block text-sm">
                      Ajouter une note à votre commande
                    </label>
                    <textarea
                      id="panier-note"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={2}
                      className="mt-2 w-full resize-y rounded-xl bg-transparent px-4 py-3 ring-2 ring-inset ring-[var(--p-accent)] outline-none focus-visible:ring-current"
                    />
                  </>
                )}
              </div>

              {lignes.length > 0 && (
                <div className="pt-6">
                  <div className="flex items-baseline justify-between">
                    <span className="text-lg">Sous-total</span>
                    <span className="font-titre text-xl font-bold tabular-nums">{formatPrix(sousTotal)}</span>
                  </div>
                  <p className="mt-1 text-right text-sm opacity-75">
                    Taxes incluses, livraison calculée à l&apos;étape suivante.
                  </p>
                  <button
                    type="button"
                    onClick={() => setEtape("coordonnees")}
                    className="flow mt-4 w-full rounded-[2rem] bg-[var(--p-bouton)] py-4 font-titre text-lg font-bold text-[var(--p-bouton-texte)] hover:rounded-[12px] focus-visible:rounded-[12px]"
                  >
                    Passer commande
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </dialog>
  );
}
