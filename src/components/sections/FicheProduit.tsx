"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, useGSAP, FULL_MOTION } from "@/lib/gsap";
import { useAgeGate } from "@/components/providers/AgeGateProvider";
import { useDelaiEntree } from "@/components/providers/TransitionProvider";
import { drinks, ingredients, type Drink } from "@/data/drinks";
import { themes } from "@/data/themes";
import Can from "@/components/ui/Can";
import Sun from "@/components/ui/Sun";
import Atouts from "@/components/ui/Atouts";
import PanneauNutrition from "@/components/ui/PanneauNutrition";
import { usePanier } from "@/components/providers/PanierProvider";
import { formatPrix, packs, tableauNutritionnel, visuelsPacks, type Pack } from "@/data/produits";
import Marquee from "@/components/sections/Marquee";
import EclatsFruits, { fruitsParBoisson, montrerFruits, visuelDe } from "@/components/ui/EclatsFruits";
import Chevron from "@/components/ui/Chevron";

export default function FicheProduit({ drink }: { drink: Drink }) {
  const root = useRef<HTMLElement>(null);
  const { status, justVerified } = useAgeGate();
  const delaiEntree = useDelaiEntree();
  const theme = themes[drink.slug];
  const fruits = fruitsParBoisson[drink.slug];
  const autres = drinks.filter((d) => d.slug !== drink.slug);
  const [pack, setPack] = useState<Pack>(packs[0]);
  const [quantite, setQuantite] = useState(1);
  const [ajoute, setAjoute] = useState(false);
  const [nutritionOuverte, setNutritionOuverte] = useState(false);
  const chiffres = tableauNutritionnel(drink.slug);
  const visuelPack = visuelsPacks[drink.slug]?.[pack.canettes];
  const bouton = theme.bouton;

  const { ajouter: ajouterAuPanier } = usePanier();
  const ajouter = () => {
    ajouterAuPanier(drink.slug, pack.canettes, quantite);
    setAjoute(true);
    window.setTimeout(() => setAjoute(false), 2200);
  };

  useGSAP(
    () => {
      gsap.matchMedia().add(FULL_MOTION, () => {
        gsap.to("[data-fiche-float]", { y: -18, rotate: 2, duration: 2.8, ease: "sine.inOut", yoyo: true, repeat: -1 });
        gsap.to("[data-fiche-sun]", { rotate: 360, duration: 120, ease: "none", repeat: -1 });
        gsap.to("[data-fiche-fruit]", {
          y: (i) => (i % 2 ? 12 : -14),
          rotate: (i) => (i % 2 ? -5 : 6),
          duration: (i) => 3.4 + i * 0.8,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
      });
    },
    { scope: root, dependencies: [drink.slug] },
  );

  useGSAP(
    () => {
      if (status !== "verified") return;
      gsap.matchMedia().add(FULL_MOTION, () => {
        gsap
          .timeline({ delay: justVerified ? 0.55 : 0.1 + delaiEntree, defaults: { ease: "expo.out" } })
          .set("[data-reveal]", { visibility: "visible" })
          .from("[data-fiche-ligne]", { yPercent: 115, rotate: 3, duration: 1.2, stagger: 0.08 }, 0)
          .from("[data-fiche-fade]", { y: 28, autoAlpha: 0, duration: 1, stagger: 0.07 }, 0.3)
          .from("[data-fiche-can]", { yPercent: 60, rotate: -20, autoAlpha: 0, duration: 1.6 }, 0.1)
          .from("[data-fiche-fruit]", { scale: 0, duration: 1.2, stagger: 0.18, ease: "back.out(2)" }, 0.6);
      });
    },
    { scope: root, dependencies: [status, drink.slug] },
  );

  return (
    <main
      id="contenu"
      ref={root}
      className="isolate overflow-x-clip"
      style={{ backgroundColor: drink.accent, color: drink.text }}
    >
      <Marquee
        texte={`${drink.name}, ${drink.notes[0].toLowerCase()} · `}
        className="titre py-3 text-[clamp(2rem,4.5vw,4rem)] md:py-4"
        style={{ backgroundColor: drink.accent, color: theme.bande }}
      />

      <section aria-labelledby="fiche-titre" className="grid lg:grid-cols-[1.1fr_1fr] lg:items-start">
        {/* Texte */}
        <div
          className="relative z-10 m-3 mt-4 flex flex-col justify-center rounded-[2rem] px-[var(--gutter)] pb-16 pt-10 md:m-5 md:mt-5 lg:mt-5 lg:rounded-[2.5rem] lg:py-20 lg:pl-[max(var(--gutter),7vw)] lg:pr-[4vw]"
          style={{ backgroundColor: drink.color }}
        >
          <Link
            href="/#gamme"
            data-fiche-fade
            data-reveal
            className="etiquette mb-6 inline-flex w-fit items-center gap-2 text-xs opacity-80 hover:opacity-100"
          >
            <Chevron direction="gauche" className="h-3.5 w-3.5" /> Toute la gamme
          </Link>

          <h1 id="fiche-titre" className="text-[clamp(3.5rem,8vw,8rem)]">
            <span className="block overflow-hidden pb-[0.08em]">
              <span data-fiche-ligne data-reveal className="block origin-bottom-left">
                {drink.name}
              </span>
            </span>
          </h1>
          <p data-fiche-fade data-reveal className="mt-2 text-lg md:text-xl">
            {ingredients(drink)}
          </p>
          <p data-fiche-fade data-reveal className="mt-5 max-w-[34rem] text-lg leading-snug opacity-90">
            {drink.description}
          </p>

          <div data-fiche-fade data-reveal className="mt-10 grid max-w-[34rem] grid-cols-[1.6fr_1fr] gap-8">
            <div>
              <h2 className="etiquette text-xs" style={{ color: theme.libelle }}>
                Notes de dégustation
              </h2>
              <ul className="mt-3 space-y-1 text-lg md:text-xl">
                {drink.notes.map((n) => (
                  <li key={n}>{n}</li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className="etiquette text-xs" style={{ color: theme.libelle }}>
                Degré
              </h2>
              <p className="mt-3 text-lg md:text-xl">6&nbsp;% vol.</p>
            </div>
          </div>

          <div data-fiche-fade data-reveal>
            <Atouts className="mt-10 max-w-[34rem]" />
          </div>

          <div data-fiche-fade data-reveal className="mt-10 max-w-[34rem]">
            <p className="font-titre text-3xl font-bold md:text-4xl">{formatPrix(pack.prix * quantite)}</p>
            <p className="text-sm opacity-85">Taxes incluses.</p>

            <fieldset className="mt-6">
              <legend className="sr-only">Format du pack</legend>
              <div className="flex flex-wrap gap-3">
                {packs.map((p) => {
                  const actif = p.canettes === pack.canettes;
                  return (
                    <button
                      key={p.canettes}
                      type="button"
                      aria-pressed={actif}
                      onClick={() => setPack(p)}
                      className="rounded-[2rem] px-5 py-3 font-titre text-base font-bold ring-2 ring-inset ring-current transition-[border-radius,background-color,color] duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:rounded-[12px] focus-visible:rounded-[12px]"
                      style={
                        actif ? { backgroundColor: bouton.fond, color: bouton.texte, boxShadow: "none" } : undefined
                      }
                    >
                      Pack de {p.canettes}
                    </button>
                  );
                })}
              </div>
            </fieldset>

            <div className="mt-5 flex items-center gap-4" role="group" aria-label="Quantité">
              <button
                type="button"
                onClick={() => setQuantite((q) => Math.max(1, q - 1))}
                disabled={quantite <= 1}
                aria-label="Retirer un pack"
                className="grid h-11 w-11 place-items-center rounded-xl ring-2 ring-inset ring-current disabled:opacity-40"
              >
                <svg viewBox="0 0 20 20" aria-hidden="true" className="h-5 w-5">
                  <path d="M4 10h12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
              <output aria-live="polite" className="min-w-6 text-center text-lg tabular-nums">
                {quantite}
              </output>
              <button
                type="button"
                onClick={() => setQuantite((q) => Math.min(20, q + 1))}
                aria-label="Ajouter un pack"
                className="grid h-11 w-11 place-items-center rounded-xl ring-2 ring-inset ring-current"
              >
                <svg viewBox="0 0 20 20" aria-hidden="true" className="h-5 w-5">
                  <path d="M4 10h12M10 4v12" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            <p className="mt-5 text-lg">
              {pack.canettes} <span className="font-titre">×</span> 330&nbsp;ml par pack
            </p>

            <button
              type="button"
              onClick={ajouter}
              className="flow mt-5 w-full rounded-[2rem] py-4 font-titre text-xl font-bold hover:rounded-[12px] focus-visible:rounded-[12px]"
              style={
                {
                  backgroundColor: bouton.fond,
                  color: bouton.texte,
                  "--flow-remplissage": bouton.remplissage,
                } as React.CSSProperties
              }
            >
              <span aria-live="polite">{ajoute ? "Ajouté au panier ✓" : "Ajouter au panier"}</span>
            </button>
            <p className="mt-3 text-center text-sm opacity-85">Fermenté naturellement, sans alcool distillé.</p>
          </div>

          <div data-fiche-fade data-reveal className="mt-12 max-w-[34rem]">
            <dl className="grid grid-cols-3 text-center">
              {[
                [String(chiffres.kcalCanette), "Kcal"],
                [`${chiffres.sucresCanette.toLocaleString("fr-FR")} g`, "Sucres"],
                [`${chiffres.glucidesCanette.toLocaleString("fr-FR")} g`, "Glucides"],
              ].map(([valeur, unite], i) => (
                <div key={unite} className={i ? "border-l border-current/25" : ""}>
                  <dt className="sr-only">{unite}</dt>
                  <dd className="font-accent text-3xl md:text-4xl">{valeur}</dd>
                  <dd className="etiquette mt-1 text-[0.6875rem]">{unite}</dd>
                </div>
              ))}
            </dl>
            <p className="etiquette mt-4 bg-texte/15 py-2.5 text-center text-xs">Par canette</p>
            <button
              type="button"
              onClick={() => setNutritionOuverte(true)}
              className="mx-auto mt-4 block rounded text-center text-lg underline decoration-2 underline-offset-4 hover:opacity-80"
            >
              Voir le tableau nutritionnel complet
            </button>
          </div>

          <nav data-fiche-fade data-reveal aria-label="Les autres saveurs" className="mt-12">
            <p className="etiquette text-xs" style={{ color: theme.libelle }}>
              Découvrir aussi
            </p>
            <ul className="mt-4 grid max-w-[34rem] grid-cols-3 gap-3 md:gap-4">
              {autres.map((d) => (
                <li key={d.slug}>
                  <Link
                    href={`/boissons/${d.slug}`}
                    className="group block rounded-2xl"
                    onMouseEnter={(e) => montrerFruits(e.currentTarget, true)}
                    onMouseLeave={(e) => montrerFruits(e.currentTarget, false)}
                    onFocus={(e) => montrerFruits(e.currentTarget, true)}
                    onBlur={(e) => montrerFruits(e.currentTarget, false)}
                  >
                    <div
                      data-carte-boite
                      className="relative isolate grid aspect-[4/5] place-items-center overflow-hidden rounded-2xl transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-y-1"
                      style={{ backgroundColor: d.accent }}
                    >
                      <EclatsFruits slug={d.slug} compacte />
                      <div className="relative z-10 h-[80%] transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-rotate-6 group-hover:scale-105">
                        <Can drink={d} sizes="5rem" className="h-full w-auto" />
                      </div>
                    </div>
                    <span className="mt-2 block text-center font-titre text-sm font-bold group-hover:underline md:text-base">
                      {d.name}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* Visuel (en attendant les photos lifestyle) */}
        <div className="relative grid min-h-[80svh] place-items-center lg:sticky lg:top-0 lg:h-[100svh] lg:min-h-0">
          <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 w-[130%] -translate-x-1/2 -translate-y-1/2 opacity-20">
            <div data-fiche-sun>
              <Sun color={drink.color} className="h-auto w-full" />
            </div>
          </div>

          <div className="relative h-[62svh] max-h-[44rem] lg:h-[68svh]">
            {/* Ingrédients autour de la canette : tranche nette devant, fruit entier et autres ingrédients en retrait */}
            {[
              { cls: "-right-[58%] bottom-[6%] z-20 w-[82%]", rot: "rotate-[14deg]", flou: "", sizes: "22vw" },
              { cls: "-left-[50%] top-[2%] w-[72%]", rot: "-rotate-12", flou: "blur-[1.5px]", sizes: "20vw" },
              { cls: "-left-[66%] bottom-[12%] w-[64%]", rot: "rotate-[18deg]", flou: "blur-[1px]", sizes: "16vw" },
              { cls: "-right-[52%] top-[0%] w-[58%]", rot: "-rotate-[10deg]", flou: "blur-[1.5px]", sizes: "16vw" },
            ].map((place, i) => {
              // tranche, fruit entier, 2e ingrédient, 3e ingrédient (s'il existe)
              if (i >= fruits.length) return null;
              const f = visuelDe(fruits, i);
              return (
                <div key={i} className={`absolute ${place.cls}`}>
                  <div data-fiche-fruit data-reveal>
                    <Image
                      src={f.src}
                      alt=""
                      width={f.w}
                      height={f.h}
                      sizes={place.sizes}
                      className={`h-auto w-full ${place.rot} ${place.flou} drop-shadow-[0_24px_30px_rgb(42_20_20/0.4)]`}
                    />
                  </div>
                </div>
              );
            })}

            <div data-fiche-can data-reveal className="relative z-10 h-full">
              <div data-fiche-float className="h-full">
                <div className="h-full rotate-[8deg] drop-shadow-[0_40px_50px_rgb(42_20_20/0.45)]">
                  {visuelPack ? (
                    <Image
                      src={visuelPack}
                      alt={`${drink.name}, pack de ${pack.canettes} canettes`}
                      width={900}
                      height={900}
                      sizes="(min-width: 1024px) 35vw, 80vw"
                      className="h-full w-auto object-contain"
                    />
                  ) : (
                    <Can drink={drink} priority sizes="(min-width: 1024px) 18vw, 50vw" className="h-full w-auto" />
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <PanneauNutrition drink={drink} ouvert={nutritionOuverte} onFermer={() => setNutritionOuverte(false)} />
    </main>
  );
}
