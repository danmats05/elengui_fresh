"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useLenis } from "lenis/react";
import { gsap, useGSAP, FULL_MOTION } from "@/lib/gsap";
import { LIBELLE_DEPOTS, navLinks } from "@/data/site";
import ListeDepots from "@/components/ui/PanneauDepots";
import Sun from "@/components/ui/Sun";
import { usePathname } from "next/navigation";
import { usePanier } from "@/components/providers/PanierProvider";
import FlowButton from "@/components/ui/FlowButton";

/** Caddie avec le nombre de packs ajoutés. */
function BoutonPanier({ className = "" }: { className?: string }) {
  const { articles, ouvrir } = usePanier();
  return (
    <button
      type="button"
      onClick={ouvrir}
      aria-haspopup="dialog"
      data-header-item
      data-reveal
      aria-label={articles ? `Panier, ${articles} article${articles > 1 ? "s" : ""}` : "Panier, vide"}
      className={`pilule verre relative h-11 w-11 justify-center text-fond hover:bg-fond/20 ${className}`}
    >
      <span
        aria-hidden="true"
        className="block h-6 w-6 bg-current"
        style={{
          mask: 'url("/assets/icons8-caddie-100.svg") center / contain no-repeat',
          WebkitMask: 'url("/assets/icons8-caddie-100.svg") center / contain no-repeat',
        }}
      />
      {articles > 0 && (
        <span
          aria-hidden="true"
          className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-passion px-1 font-titre text-[0.6875rem] font-bold text-texte"
        >
          {articles > 99 ? "99+" : articles}
        </span>
      )}
    </button>
  );
}

export default function Header() {
  const root = useRef<HTMLElement>(null);
  // Fiches boissons : seul le caddie reste affiché, fixe.
  const fiche = usePathname().startsWith("/boissons/");
  const [menuOpen, setMenuOpen] = useState(false);
  const [depotsOuvert, setDepotsOuvert] = useState(false);
  const [depotsMobile, setDepotsMobile] = useState(false);
  const panneauDepots = useRef<HTMLDivElement>(null);
  const boutonDepots = useRef<HTMLButtonElement>(null);
  const lenis = useLenis();

  // Entrée des éléments du header.
  useGSAP(
    () => {
      gsap.matchMedia().add(FULL_MOTION, () => {
        gsap.from("[data-header-item]", {
          y: -24,
          autoAlpha: 0,
          duration: 0.9,
          ease: "expo.out",
          stagger: 0.06,
          delay: 0.2,
        });
      });
    },
    { scope: root, dependencies: [fiche], revertOnUpdate: true },
  );

  // Barre masquée quand on descend, de retour quand on remonte.
  // Écouteur de défilement natif : indépendant de la longueur de la page (et donc des changements de page).
  useEffect(() => {
    if (fiche) {
      gsap.set(root.current, { yPercent: 0 });
      return;
    }
    let precedent = window.scrollY;
    let cache = false;
    let raf = 0;
    const maj = () => {
      raf = 0;
      const y = window.scrollY;
      const delta = y - precedent;
      if (Math.abs(delta) < 4) return;
      const doitCacher = delta > 0 && y > window.innerHeight * 0.6;
      precedent = y;
      if (doitCacher === cache) return;
      cache = doitCacher;
      gsap.to(root.current, { yPercent: cache ? -110 : 0, duration: 0.45, ease: "power3.out", overwrite: "auto" });
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(maj);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [fiche]);

  // Menu mobile : rideau qui descend, liens qui montent un par un ; l'inverse à la fermeture.
  // Chaque changement annule complètement l'animation précédente (ouvertures/fermetures rapides).
  const menu = useRef<HTMLDivElement>(null);
  const animMenu = useRef<gsap.core.Timeline | null>(null);
  const rotationSoleil = useRef<gsap.core.Tween | null>(null);
  useEffect(() => {
    const el = menu.current;
    if (!el) return;
    const liens = el.querySelectorAll("[data-menu-lien]");
    const bouton = el.querySelector("[data-menu-bouton]");
    const soleil = el.querySelector("[data-menu-soleil]");
    const contenu = [...liens, bouton];
    const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    animMenu.current?.kill();

    if (menuOpen) {
      gsap.set(el, { visibility: "visible" });
      if (reduit) {
        gsap.set(el, { clipPath: "inset(0 0 0% 0 round 2rem)" });
        gsap.set([...contenu, soleil], { clearProps: "transform,opacity,visibility" });
        return;
      }
      // Rotation continue du soleil : relancée si l'élément a changé (menu recréé après navigation).
      const tourne = el.querySelector("[data-menu-soleil-tourne]");
      if (!rotationSoleil.current || !rotationSoleil.current.targets().includes(tourne)) {
        rotationSoleil.current?.kill();
        rotationSoleil.current = gsap.to(tourne, { rotate: "+=360", duration: 60, ease: "none", repeat: -1 });
      }
      animMenu.current = gsap
        .timeline()
        .fromTo(
          el,
          { clipPath: "inset(0 0 100% 0 round 2rem)" },
          { clipPath: "inset(0 0 0% 0 round 2rem)", duration: 0.7, ease: "expo.inOut" },
        )
        .fromTo(
          soleil,
          { scale: 0.6, rotate: -60, autoAlpha: 0 },
          { scale: 1, rotate: 0, autoAlpha: 1, duration: 1.2, ease: "expo.out" },
          0.2,
        )
        .fromTo(
          liens,
          { yPercent: 110, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 0.8, ease: "expo.out", stagger: 0.07 },
          0.3,
        )
        .fromTo(
          bouton,
          { yPercent: 40, autoAlpha: 0 },
          { yPercent: 0, autoAlpha: 1, duration: 0.8, ease: "expo.out" },
          0.55,
        );
    } else {
      const masquer = () => {
        gsap.set(el, { visibility: "hidden" });
      };
      if (reduit || getComputedStyle(el).visibility === "hidden") {
        masquer();
        return;
      }
      animMenu.current = gsap
        .timeline({ onComplete: masquer })
        .to(contenu, { yPercent: -60, autoAlpha: 0, duration: 0.3, ease: "power2.in", stagger: 0.04 })
        // fromTo avec les deux valeurs explicites : GSAP ne sait pas interpoler depuis la valeur calculée
        // par le navigateur (format différent), et sauterait directement à la fin.
        .fromTo(
          el,
          { clipPath: "inset(0 0 0% 0 round 2rem)" },
          { clipPath: "inset(0 0 100% 0 round 2rem)", duration: 0.55, ease: "expo.inOut" },
          0.15,
        );
    }
  }, [menuOpen]);

  useEffect(
    () => () => {
      animMenu.current?.kill();
      rotationSoleil.current?.kill();
    },
    [],
  );

  // Panneau « Où nous trouver » (desktop) : apparition, fermeture par Échap / clic à côté / défilement.
  useEffect(() => {
    const el = panneauDepots.current;
    if (!el) return;
    const reduit = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    gsap.killTweensOf([el, ...el.querySelectorAll("[data-depot-ville]")]);
    if (!depotsOuvert) {
      if (reduit) gsap.set(el, { autoAlpha: 0 });
      else gsap.to(el, { autoAlpha: 0, y: -12, duration: 0.25, ease: "power2.in" });
      return;
    }
    if (reduit) gsap.set(el, { autoAlpha: 1, y: 0 });
    else {
      gsap.fromTo(el, { autoAlpha: 0, y: -16 }, { autoAlpha: 1, y: 0, duration: 0.5, ease: "expo.out" });
      gsap.fromTo(
        el.querySelectorAll("[data-depot-ville]"),
        { y: 14, autoAlpha: 0 },
        { y: 0, autoAlpha: 1, duration: 0.5, ease: "expo.out", stagger: 0.05, delay: 0.08 },
      );
    }
    const fermer = () => setDepotsOuvert(false);
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Escape") return;
      fermer();
      boutonDepots.current?.focus();
    };
    const onClic = (e: MouseEvent) => {
      const cible = e.target as Node;
      if (!el.contains(cible) && !boutonDepots.current?.contains(cible)) fermer();
    };
    const y0 = window.scrollY;
    const onScroll = () => Math.abs(window.scrollY - y0) > 120 && fermer();
    window.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onClic);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onClic);
      window.removeEventListener("scroll", onScroll);
    };
  }, [depotsOuvert]);

  // Menu mobile : bloque le scroll et se ferme avec Échap.
  useEffect(() => {
    if (!menuOpen) return;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setMenuOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      lenis?.start();
      document.documentElement.style.overflow = "";
      window.removeEventListener("keydown", onKey);
    };
  }, [menuOpen, lenis]);

  if (fiche) {
    return (
      <header ref={root} className="pointer-events-none fixed inset-x-0 top-0 z-50">
        <div className="flex min-h-[var(--header-h)] items-center justify-end px-[var(--gutter)]">
          <BoutonPanier className="verre-fort pointer-events-auto !h-12 !w-12" />
        </div>
      </header>
    );
  }

  return (
    <>
      <header ref={root} className={`fixed inset-x-0 top-0 z-50 transition-colors duration-500 bg-transparent`}>
        <div className="flex min-h-[var(--header-h)] items-center gap-3 px-[var(--gutter)] md:gap-8">
          <Link
            href="/"
            data-header-item
            data-reveal
            className="verre flex h-[var(--header-h)] w-[9.5rem] rounded-b-2xl md:rounded-b-3xl shrink-0 items-center justify-center self-start md:h-[6.5rem] md:w-[12.5rem]"
            onClick={() => setMenuOpen(false)}
          >
            <Image
              src="/brand/elengi-fresh-logo-clair.svg"
              alt="Elengi Fresh, retour à l'accueil"
              width={613}
              height={220}
              priority
              className="h-auto w-32 md:w-44"
            />
          </Link>

          <nav aria-label="Navigation principale" className="hidden md:block">
            <ul className="flex items-center gap-2">
              {navLinks.map((link) => (
                <li key={link.href} data-header-item data-reveal>
                  <Link
                    href={link.href}
                    className="pilule verre px-4 py-2.5 text-[0.9375rem] text-fond hover:bg-fond/20"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
              <li data-header-item data-reveal>
                <button
                  ref={boutonDepots}
                  type="button"
                  aria-expanded={depotsOuvert}
                  aria-controls="panneau-depots"
                  onClick={() => setDepotsOuvert((v) => !v)}
                  className="pilule verre px-4 py-2.5 text-[0.9375rem] text-fond hover:bg-fond/20 aria-expanded:bg-fond/20"
                >
                  {LIBELLE_DEPOTS}
                  <svg
                    viewBox="0 0 20 20"
                    aria-hidden="true"
                    className={`h-3.5 w-3.5 transition-transform duration-300 ${depotsOuvert ? "rotate-180" : ""}`}
                  >
                    <path
                      d="M5 7.5 10 12.5l5-5"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </li>
            </ul>
          </nav>

          <BoutonPanier className="ml-auto" />

          {/* Panneau des dépôts (desktop), sous la barre */}
          <div
            ref={panneauDepots}
            id="panneau-depots"
            role="region"
            aria-label={LIBELLE_DEPOTS}
            inert={!depotsOuvert}
            data-lenis-prevent
            className="invisible absolute left-[calc(var(--gutter)+13.5rem)] top-[calc(100%-0.25rem)] hidden max-h-[calc(100svh-8rem)] w-[min(44rem,calc(100vw-var(--gutter)*2-13.5rem))] overflow-y-auto rounded-[1.75rem] bg-bissap-profond/90 p-7 opacity-0 shadow-[0_24px_60px_rgb(42_20_20/0.4)] backdrop-blur-xl md:block"
          >
            <p className="mb-6 text-fond/80">Toute la gamme vous attend, bien fraîche, dans nos dépôts&nbsp;:</p>
            <ListeDepots />
          </div>

          <button
            type="button"
            data-header-item
            data-reveal
            aria-expanded={menuOpen}
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-controls="menu-mobile"
            onClick={() => setMenuOpen((v) => !v)}
            className="pilule verre px-4 py-2.5 text-[0.9375rem] text-fond hover:bg-fond/20 md:hidden"
          >
            <span aria-hidden="true" className="grid h-[1.15em] overflow-hidden">
              {["Menu", "Fermer"].map((mot, i) => (
                <span
                  key={mot}
                  className={`col-start-1 row-start-1 text-center transition-transform duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${
                    menuOpen ? (i ? "translate-y-0" : "-translate-y-full") : i ? "translate-y-full" : "translate-y-0"
                  }`}
                >
                  {mot}
                </span>
              ))}
            </span>
            <span aria-hidden="true" className="relative block h-2.5 w-4">
              <span
                className={`absolute left-0 top-0 h-0.5 w-full rounded bg-current transition-transform duration-300 ${menuOpen ? "translate-y-1 rotate-45" : ""}`}
              />
              <span
                className={`absolute bottom-0 left-0 h-0.5 w-full rounded bg-current transition-transform duration-300 ${menuOpen ? "-translate-y-1 -rotate-45" : ""}`}
              />
            </span>
          </button>
        </div>
      </header>

      {/* Menu mobile */}
      <div
        ref={menu}
        id="menu-mobile"
        aria-hidden={!menuOpen}
        inert={!menuOpen}
        className="grain invisible fixed inset-x-3 bottom-3 top-[calc(var(--header-h)+0.5rem)] z-40 overflow-hidden rounded-[2rem] bg-bissap shadow-[0_24px_60px_rgb(42_20_20/0.45)] md:hidden"
      >
        <div data-menu-soleil className="pointer-events-none absolute -right-[38%] bottom-[8%] w-[125vw]">
          <div data-menu-soleil-tourne>
            <Sun color="var(--bissap-accent)" className="w-full opacity-40" />
          </div>
        </div>
        <nav
          aria-label="Navigation mobile"
          data-lenis-prevent
          className="relative max-h-full overflow-y-auto px-[var(--gutter)] pb-36 pt-10"
        >
          <ul className="flex flex-col gap-2">
            {navLinks.map((link, i) => (
              <li key={link.href} className="overflow-hidden">
                <Link
                  data-menu-lien
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="titre block rounded-2xl py-2 text-[clamp(2.25rem,11vw,4rem)] text-passion-accent hover:text-passion"
                >
                  <span className="mr-3 align-top text-base font-bold text-pamplemousse">0{i + 1}</span>
                  {link.label}
                </Link>
              </li>
            ))}
            <li className="overflow-hidden">
              <button
                data-menu-lien
                type="button"
                aria-expanded={depotsMobile}
                aria-controls="menu-depots"
                onClick={() => setDepotsMobile((v) => !v)}
                className="titre flex w-full items-start rounded-2xl py-2 text-left text-[clamp(2.25rem,11vw,4rem)] text-passion-accent hover:text-passion"
              >
                <span className="mr-3 mt-[0.15em] font-titre text-base font-bold text-pamplemousse">
                  0{navLinks.length + 1}
                </span>
                <span className="flex-1">{LIBELLE_DEPOTS}</span>
                <svg
                  viewBox="0 0 20 20"
                  aria-hidden="true"
                  className={`mt-[0.35em] h-6 w-6 shrink-0 transition-transform duration-500 ${depotsMobile ? "rotate-180" : ""}`}
                >
                  <path
                    d="M5 7.5 10 12.5l5-5"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </button>
              {/* Accordéon : la hauteur s'anime via grid-template-rows (0fr → 1fr) */}
              <div
                id="menu-depots"
                inert={!depotsMobile}
                className={`grid transition-[grid-template-rows,opacity] duration-500 ease-[cubic-bezier(0.65,0,0.35,1)] ${depotsMobile ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}
              >
                <div className="overflow-hidden">
                  <div className="pb-4 pl-8 pt-3">
                    <ListeDepots compacte />
                  </div>
                </div>
              </div>
            </li>
          </ul>
        </nav>
        <div
          data-menu-bouton
          className="absolute inset-x-0 bottom-0 px-[var(--gutter)] pb-[max(2rem,env(safe-area-inset-bottom))]"
        >
          <FlowButton
            href="/#gamme"
            fleche={false}
            onClick={() => setMenuOpen(false)}
            className="w-full justify-center"
          >
            Voir nos boissons
          </FlowButton>
        </div>
      </div>
    </>
  );
}
