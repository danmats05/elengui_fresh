"use client";

import { useRef } from "react";
import Link from "next/link";
import { gsap, useGSAP, FULL_MOTION } from "@/lib/gsap";
import { drinks, ingredients, nouveautes } from "@/data/drinks";
import Can from "@/components/ui/Can";
import BadgeNew from "@/components/ui/BadgeNew";
import EclatsFruits, { montrerFruits } from "@/components/ui/EclatsFruits";
import Chevron from "@/components/ui/Chevron";

/**
 * La gamme : carrousel horizontal.
 * Défilement natif (doigt, trackpad, clavier) + glisser à la souris avec inertie.
 */
export default function Gamme() {
  const root = useRef<HTMLElement>(null);
  const piste = useRef<HTMLDivElement>(null);
  const drag = useRef({ actif: false, bouge: false, x: 0, scroll: 0, vitesse: 0, t: 0 });
  const inertie = useRef<gsap.core.Tween | null>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(FULL_MOTION, () => {
        gsap.from("[data-gamme-entete]", {
          y: 40,
          autoAlpha: 0,
          duration: 1,
          ease: "expo.out",
          stagger: 0.08,
          scrollTrigger: { trigger: root.current, start: "top 75%" },
        });
        gsap.from("[data-gamme-carte]", {
          x: 120,
          autoAlpha: 0,
          duration: 1.3,
          ease: "expo.out",
          stagger: 0.09,
          scrollTrigger: { trigger: piste.current, start: "top 85%" },
        });
      });
    },
    { scope: root },
  );

  const onPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = piste.current;
    if (!el || e.pointerType !== "mouse" || e.button !== 0) return;
    inertie.current?.kill();
    drag.current = { actif: true, bouge: false, x: e.clientX, scroll: el.scrollLeft, vitesse: 0, t: performance.now() };
  };

  const onPointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = piste.current;
    const d = drag.current;
    if (!el || !d.actif) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 4 && !d.bouge) {
      d.bouge = true;
      el.dataset.drag = "";
      // Capture seulement une fois le glissement engagé : un simple clic reste un clic sur le lien.
      el.setPointerCapture(e.pointerId);
    }
    const now = performance.now();
    const precedent = el.scrollLeft;
    el.scrollLeft = d.scroll - dx;
    d.vitesse = (el.scrollLeft - precedent) / Math.max(now - d.t, 1);
    d.t = now;
  };

  const onPointerUp = (e: React.PointerEvent<HTMLDivElement>) => {
    const el = piste.current;
    const d = drag.current;
    if (!el || !d.actif) return;
    d.actif = false;
    if (el.hasPointerCapture(e.pointerId)) el.releasePointerCapture(e.pointerId);
    delete el.dataset.drag;
    // Le clic qui suit un glissement ne doit pas ouvrir la fiche (lu par la transition de page).
    if (d.bouge) {
      el.dataset.vientDeGlisser = "";
      window.setTimeout(() => delete el.dataset.vientDeGlisser, 80);
    }
    // Inertie : on prolonge le geste, le navigateur borne le défilement.
    inertie.current = gsap.to(el, {
      scrollLeft: el.scrollLeft + d.vitesse * 380,
      duration: 0.9,
      ease: "power3.out",
    });
  };

  return (
    <section
      id="gamme"
      ref={root}
      aria-labelledby="gamme-titre"
      className="bg-bissap pb-24 pt-14 text-fond md:pb-32 md:pt-16"
    >
      <div className="mx-auto flex max-w-[110rem] flex-col gap-6 px-[var(--gutter)] md:flex-row md:items-end md:justify-between">
        <div>
          <h2 id="gamme-titre" data-gamme-entete className="text-[clamp(3rem,5.8vw,6.25rem)] text-passion-accent">
            Notre gamme
          </h2>
          <p data-gamme-entete className="mt-4 max-w-[34rem] text-lg leading-snug text-fond/80 md:text-xl">
            Quatre vins de fruits, quatre caractères. Du pamplemousse acidulé au bissap profond, chacun fermente
            naturellement pour garder tout le goût du fruit.
          </p>
        </div>
        <p
          data-gamme-entete
          className="etiquette flex shrink-0 items-center gap-3 pb-2 text-xs text-fond/80 md:text-sm"
        >
          Faites glisser
          <Chevron className="h-4 w-4" />
        </p>
      </div>

      <div
        ref={piste}
        role="region"
        aria-label="Notre gamme, faites défiler horizontalement"
        tabIndex={0}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
        onDragStart={(e) => e.preventDefault()}
        onClickCapture={(e) => {
          if (drag.current.bouge) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
        className="mt-12 flex cursor-grab snap-x snap-mandatory scroll-px-[var(--gutter)] gap-5 overflow-x-auto px-[var(--gutter)] pb-4 outline-none [scrollbar-width:none] select-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-passion data-[drag]:cursor-grabbing data-[drag]:snap-none md:mt-16 md:snap-none md:gap-[clamp(1.5rem,4vw,4.5rem)] [&::-webkit-scrollbar]:hidden"
      >
        {drinks.map((d) => (
          <article
            key={d.slug}
            data-gamme-carte
            className="w-[min(72vw,20rem)] shrink-0 snap-start md:w-[clamp(17rem,24vw,23rem)]"
          >
            <Link
              href={`/boissons/${d.slug}`}
              draggable={false}
              className="group block rounded-[2rem]"
              onMouseEnter={(e) => montrerFruits(e.currentTarget, true)}
              onMouseLeave={(e) => montrerFruits(e.currentTarget, false)}
              onFocus={(e) => montrerFruits(e.currentTarget, true)}
              onBlur={(e) => montrerFruits(e.currentTarget, false)}
            >
              <div
                data-carte-boite
                className="relative isolate grid aspect-[19/20] place-items-center overflow-hidden rounded-[2rem] bg-bissap-profond transition-colors duration-500 group-hover:bg-bissap-accent/40"
              >
                <EclatsFruits slug={d.slug} />
                <div className="relative z-10 h-[78%] transition-transform duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:-translate-y-2 group-hover:-rotate-3">
                  <Can drink={d} sizes="(min-width: 768px) 9rem, 30vw" className="h-full w-auto" />
                  {nouveautes.includes(d.slug) && (
                    <div className="absolute left-0 top-[4%] w-[62%] -translate-x-1/2 -translate-y-1/2">
                      <BadgeNew sizes="6rem" />
                    </div>
                  )}
                </div>
              </div>
              <h3 className="mt-6 text-center font-titre text-lg font-bold text-passion-accent md:text-xl">{d.name}</h3>
              <p className="mx-auto mt-1.5 max-w-[16rem] text-center text-pamplemousse-accent/90 md:text-lg">
                {ingredients(d)}
              </p>
            </Link>
          </article>
        ))}
        {/* Marge de fin : la dernière carte peut s'aligner sur la gouttière */}
        <div aria-hidden="true" className="w-px shrink-0" />
      </div>
    </section>
  );
}
