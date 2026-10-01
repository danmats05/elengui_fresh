"use client";

import { createContext, useContext, useEffect, useLayoutEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useLenis } from "lenis/react";
import { gsap, ScrollTrigger, REDUCED_MOTION } from "@/lib/gsap";
import { findDrink } from "@/data/drinks";
import Sun from "@/components/ui/Sun";

/** Délai (s) à ajouter aux animations d'entrée d'une page quand on y arrive par une transition. */
const TransitionContext = createContext(0);
export const useDelaiEntree = () => useContext(TransitionContext);

/** Couleur de fond de la page d'arrivée (le voile la prend pour que le passage soit continu). */
const couleurDe = (chemin: string) => {
  const boisson = findDrink(chemin.split("/boissons/")[1] ?? "");
  return boisson ? boisson.accent : "var(--bissap)";
};

const SORTIE = 0.65;

/**
 * Transitions entre pages :
 * sortie → le contenu s'efface et un voile de la couleur de la page suivante monte ;
 * entrée → retour en haut (ou sur l'ancre), le voile s'efface en fondu et les animations de la page démarrent.
 */
export function TransitionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const chemin = usePathname();
  const lenis = useLenis();
  const voile = useRef<HTMLDivElement>(null);
  const enCours = useRef(false);
  const ancre = useRef<string | null>(null);
  const [delai, setDelai] = useState(0);
  const [couleur, setCouleur] = useState("var(--bissap)");

  const naviguer = (url: URL) => {
    enCours.current = true;
    ancre.current = url.hash || null;
    const destination = url.pathname + url.search + url.hash;

    if (window.matchMedia(REDUCED_MOTION).matches) {
      router.push(destination, { scroll: false });
      return;
    }

    setCouleur(couleurDe(url.pathname));
    lenis?.stop();
    const site = document.getElementById("site");
    gsap
      .timeline({ onComplete: () => router.push(destination, { scroll: false }) })
      .to(site, { opacity: 0, y: -40, duration: SORTIE * 0.8, ease: "power2.in" }, 0)
      .fromTo(
        voile.current,
        { autoAlpha: 1, clipPath: "inset(100% 0% 0% 0% round 40% 40% 0 0)" },
        { clipPath: "inset(0% 0% 0% 0% round 0% 0% 0 0)", duration: SORTIE, ease: "expo.inOut" },
        0,
      )
      .fromTo(
        "[data-voile-soleil]",
        { scale: 0.4, rotate: -90, autoAlpha: 0 },
        { scale: 1, rotate: 0, autoAlpha: 1, duration: 0.6, ease: "back.out(1.6)" },
        SORTIE * 0.55,
      );
  };

  /** Défilement fluide (ralenti au départ et à l'arrivée) ; force : fonctionne même si un menu a bloqué Lenis. */
  const defiler = (cible: HTMLElement | number) => {
    const reduit = window.matchMedia(REDUCED_MOTION).matches;
    // Laisse le menu mobile se fermer avant de partir.
    window.setTimeout(() => {
      if (lenis) {
        lenis.scrollTo(cible, {
          duration: reduit ? 0 : 1.6,
          immediate: reduit,
          force: true,
          easing: (t) => (t < 0.5 ? 16 * t ** 5 : 1 - (-2 * t + 2) ** 5 / 2),
        });
      } else if (typeof cible === "number") {
        window.scrollTo({ top: cible, behavior: reduit ? "auto" : "smooth" });
      } else {
        cible.scrollIntoView({ behavior: reduit ? "auto" : "smooth" });
      }
    }, 60);
  };

  // Interception des liens internes vers une autre page.
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const lien = (e.target as Element | null)?.closest?.("a[href]") as HTMLAnchorElement | null;
      if (!lien || lien.target === "_blank" || lien.hasAttribute("download")) return;
      // Un glissement du carrousel ne doit pas ouvrir la fiche.
      if (lien.closest("[data-vient-de-glisser]")) return;
      const url = new URL(lien.href, location.href);
      if (url.origin !== location.origin) return;

      // Ancre sur la même page : défilement animé jusqu'à la section.
      if (url.pathname === location.pathname) {
        const cible = url.hash ? document.querySelector<HTMLElement>(decodeURIComponent(url.hash)) : null;
        e.preventDefault();
        history.replaceState(null, "", url.hash || url.pathname);
        defiler(cible ?? 0);
        return;
      }

      // Pas de stopPropagation : le onClick du lien doit pouvoir s'exécuter (ex. fermer le menu mobile).
      // Next ignore les clics déjà « preventDefault », il ne navigue donc pas en double.
      e.preventDefault();
      if (enCours.current) return;
      naviguer(url);
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  });

  // Arrivée sur la nouvelle page : position de défilement, puis fondu du voile.
  useLayoutEffect(() => {
    const site = document.getElementById("site");
    const cible = ancre.current ? document.querySelector(ancre.current) : null;
    lenis?.start();
    if (cible) {
      if (lenis) lenis.scrollTo(cible as HTMLElement, { immediate: true, force: true });
      else cible.scrollIntoView();
    } else if (lenis) {
      lenis.scrollTo(0, { immediate: true, force: true });
    } else {
      window.scrollTo(0, 0);
    }
    ancre.current = null;

    if (!enCours.current) return;
    enCours.current = false;
    setDelai(0.35);
    // clearProps : aucun transform résiduel sur #site, sinon il devient le repère des éléments
    // position: fixed qu'il contient (barre, menu mobile) au lieu de l'écran.
    gsap.set(site, { clearProps: "opacity,transform,translate" });
    requestAnimationFrame(() => ScrollTrigger.refresh());
    gsap
      .timeline({ onComplete: () => setDelai(0) })
      .to("[data-voile-soleil]", { scale: 1.3, autoAlpha: 0, duration: 0.45, ease: "power2.in" }, 0)
      .to(voile.current, { autoAlpha: 0, duration: 0.7, ease: "power2.out" }, 0.15);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chemin]);

  return (
    <TransitionContext.Provider value={delai}>
      {children}
      <div
        ref={voile}
        aria-hidden="true"
        className="pointer-events-none invisible fixed inset-0 z-[90] grid place-items-center"
        style={{ backgroundColor: couleur }}
      >
        <div data-voile-soleil className="w-28 md:w-36">
          <Sun color="var(--passion)" className="w-full" />
        </div>
      </div>
    </TransitionContext.Provider>
  );
}
