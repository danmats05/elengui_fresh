"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useLenis } from "lenis/react";
import { gsap, useGSAP, FULL_MOTION, REDUCED_MOTION } from "@/lib/gsap";
import { useAgeGate } from "@/components/providers/AgeGateProvider";
import Sun from "@/components/ui/Sun";

/** Focus initial dans la modale, sans l'état « focus clavier » (qui remplirait le bouton dès l'ouverture). */
const focusSansHalo = (el: HTMLElement | null) => el?.focus({ focusVisible: false } as FocusOptions);

export default function AgeGate() {
  const { status, confirm } = useAgeGate();
  const lenis = useLenis();
  const root = useRef<HTMLDivElement>(null);
  const yesRef = useRef<HTMLButtonElement>(null);
  const [refused, setRefused] = useState(false);
  const [phase, setPhase] = useState<"open" | "leaving" | "gone">("open");

  const locked = status === "pending";

  // Bloque le scroll et rend le site inerte tant que la modale est ouverte.
  useEffect(() => {
    if (!locked) return;
    const html = document.documentElement;
    const site = document.getElementById("site");
    html.style.overflow = "hidden";
    site?.setAttribute("inert", "");
    lenis?.stop();
    return () => {
      html.style.overflow = "";
      site?.removeAttribute("inert");
      lenis?.start();
    };
  }, [locked, lenis]);

  useGSAP(
    () => {
      if (status !== "pending") return;
      const mm = gsap.matchMedia();
      mm.add(FULL_MOTION, () => {
        gsap
          .timeline({ defaults: { ease: "expo.out" }, onComplete: () => focusSansHalo(yesRef.current) })
          .set("[data-reveal]", { visibility: "visible" })
          .from("[data-gate-sun]", { scale: 0.4, rotate: -90, autoAlpha: 0, duration: 1.6 })
          .from("[data-gate-logo]", { y: -20, autoAlpha: 0, duration: 0.9 }, 0.15)
          .from("[data-gate-line]", { yPercent: 110, duration: 1.1, stagger: 0.09 }, 0.25)
          .from("[data-gate-fade]", { y: 24, autoAlpha: 0, duration: 0.9, stagger: 0.08 }, 0.6);
      });
      mm.add(REDUCED_MOTION, () => focusSansHalo(yesRef.current));
    },
    { scope: root, dependencies: [status] },
  );

  // Rotation lente du soleil, indépendante du reste.
  useGSAP(
    () => {
      gsap.matchMedia().add(FULL_MOTION, () => {
        gsap.to("[data-gate-sun-inner]", { rotate: 360, duration: 90, ease: "none", repeat: -1 });
      });
    },
    { scope: root },
  );

  const exitTl = useRef<gsap.core.Timeline | null>(null);
  useEffect(() => () => void exitTl.current?.kill(), []);

  const handleYes = () => {
    const el = root.current;
    setPhase("leaving");
    confirm();
    if (!el) return setPhase("gone");

    const reduced = window.matchMedia(REDUCED_MOTION).matches;
    exitTl.current = reduced
      ? gsap.timeline({ onComplete: () => setPhase("gone") }).to(el, { autoAlpha: 0, duration: 0.3 })
      : gsap
          .timeline({ onComplete: () => setPhase("gone") })
          .to(el.querySelector("[data-gate-content]"), {
            yPercent: -18,
            autoAlpha: 0,
            duration: 0.6,
            ease: "power3.in",
          })
          .to(el, { yPercent: -100, duration: 1.05, ease: "expo.inOut" }, 0.15);
  };

  if (phase === "gone" || (status === "verified" && phase === "open")) return null;

  return (
    <div
      ref={root}
      data-age-gate
      role="dialog"
      aria-modal="true"
      aria-labelledby="age-gate-titre"
      aria-describedby="age-gate-desc"
      className="grain fixed inset-0 z-[100] flex flex-col overflow-hidden bg-bissap text-fond"
    >
      {/* Soleil géant en fond */}
      <div
        data-gate-sun
        data-reveal
        className="pointer-events-none absolute left-1/2 top-1/2 w-[150vmax] -translate-x-1/2 -translate-y-1/2 opacity-[0.13] md:w-[110vmax]"
      >
        <div data-gate-sun-inner>
          <Sun color="var(--bissap-accent)" className="h-auto w-full" />
        </div>
      </div>

      <div data-gate-content data-reveal className="relative flex flex-1 flex-col px-[var(--gutter)] py-8">
        <div data-gate-logo className="flex justify-center">
          <Image
            src="/brand/elengi-fresh-logo-clair.svg"
            alt="Elengi Fresh, vin de fruits du Congo"
            width={613}
            height={220}
            priority
            className="h-auto w-36 md:w-44"
          />
        </div>

        <div className="flex flex-1 flex-col items-center justify-center text-center">
          {!refused ? (
            <>
              <h2 id="age-gate-titre" className="text-[clamp(3rem,10vw,9.5rem)] text-passion-accent">
                <span className="block overflow-hidden pb-[0.06em]">
                  <span data-gate-line className="block">
                    Avez-vous
                  </span>
                </span>
                <span className="block overflow-hidden pb-[0.06em]">
                  <span data-gate-line className="block">
                    plus de <span className="text-passion">18 ans</span>&nbsp;?
                  </span>
                </span>
              </h2>

              <p id="age-gate-desc" data-gate-fade className="mt-6 max-w-md text-base text-fond/80 md:text-lg">
                Nos vins de fruits fermentés sont réservés aux personnes majeures.
              </p>

              <div data-gate-fade className="mt-10 flex gap-3 md:gap-4">
                <button
                  ref={yesRef}
                  type="button"
                  onClick={handleYes}
                  className="pilule bouton flow min-w-32 justify-center bg-passion text-xl text-texte [--flow-remplissage:var(--fond)] md:min-w-40"
                >
                  Oui
                </button>
                <button
                  type="button"
                  onClick={() => setRefused(true)}
                  className="pilule bouton flow min-w-32 justify-center text-xl text-fond ring-2 ring-inset ring-fond/40 [--flow-remplissage:var(--fond)] hover:text-bissap focus-visible:text-bissap md:min-w-40"
                >
                  Non
                </button>
              </div>

              {/* Avertissement sanitaire, bien visible */}
              <p
                data-gate-fade
                className="mt-10 flex max-w-md items-center gap-3 rounded-2xl px-5 py-3.5 text-left text-sm font-bold text-fond ring-2 ring-inset ring-passion/70 md:text-base"
              >
                <span
                  aria-hidden="true"
                  className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-passion font-titre text-lg text-texte"
                >
                  !
                </span>
                L&apos;abus d&apos;alcool est dangereux pour la santé, à consommer avec modération.
              </p>
            </>
          ) : (
            <div role="alert" className="flex max-w-xl flex-col items-center">
              <h2 id="age-gate-titre" className="text-[clamp(2.75rem,8vw,7rem)] text-passion-accent">
                Pas encore&nbsp;!
              </h2>
              <p id="age-gate-desc" className="mt-6 text-lg text-fond/85 md:text-xl">
                Désolé, ce site est réservé aux personnes de plus de 18&nbsp;ans. Revenez nous voir le jour de votre
                majorité, on gardera une canette au frais.
              </p>
              <button
                type="button"
                onClick={() => setRefused(false)}
                className="pilule mt-8 text-sm text-fond/70 underline-offset-4 hover:text-fond hover:underline"
              >
                Je me suis trompé·e
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
