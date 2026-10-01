"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { gsap, useGSAP, FULL_MOTION } from "@/lib/gsap";
import { usePathname } from "next/navigation";
import { navLinks } from "@/data/site";
import { pagesLegales } from "@/data/legal";
import { findDrink } from "@/data/drinks";

const CONTACT = "bonjour@elengi-fresh.fr";

function Instagram() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7">
      <rect x="3" y="3" width="18" height="18" rx="5" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="4.2" fill="none" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17.3" cy="6.7" r="1.2" fill="currentColor" />
    </svg>
  );
}

function Facebook() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true" className="h-7 w-7">
      <rect x="3" y="3" width="18" height="18" rx="4" fill="currentColor" />
      <path
        d="M13.4 21v-7h2.4l.4-2.8h-2.8V9.4c0-.8.3-1.4 1.4-1.4h1.5V5.5c-.3 0-1.2-.1-2.2-.1-2.2 0-3.6 1.3-3.6 3.7v2.1H8.1V14h2.4v7"
        fill="var(--bissap-profond)"
      />
    </svg>
  );
}

export default function Footer() {
  const root = useRef<HTMLElement>(null);
  const [email, setEmail] = useState("");
  const [etat, setEtat] = useState<"idle" | "erreur" | "ok">("idle");
  // La marge autour du footer reprend la couleur de la section du dessus.
  const chemin = usePathname();
  const boisson = findDrink(chemin.split("/boissons/")[1] ?? "");
  const fondPage = boisson ? boisson.accent : "var(--bissap)";

  // Le badge tourne au fil du scroll et finit à l'endroit dès que le footer occupe les trois quarts de l'écran.
  useGSAP(
    () => {
      gsap.matchMedia().add(FULL_MOTION, () => {
        gsap.fromTo(
          "[data-footer-badge]",
          { rotate: -300 },
          {
            rotate: 0,
            ease: "none",
            scrollTrigger: { trigger: root.current, start: "top bottom", end: "top 25%", scrub: 0.6 },
          },
        );
      });
    },
    { scope: root },
  );

  const inscrire = (e: React.FormEvent) => {
    e.preventDefault();
    setEtat(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()) ? "ok" : "erreur");
  };

  return (
    <footer
      ref={root}
      className="relative z-10 overflow-x-clip px-3 pb-3 md:px-5 md:pb-5"
      style={{ backgroundColor: fondPage }}
      aria-labelledby="footer-titre"
    >
      <div className="footer-carte relative isolate text-fond">
        {/* Fond de la carte, découpé en cercle autour du badge (avec une marge) */}
        <div
          aria-hidden="true"
          className="footer-fond grain absolute inset-0 -z-10 rounded-[2rem] bg-bissap-profond md:rounded-[2.5rem]"
        />
        {/* Grand badge, coupé par les bords comme sur un sticker */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute left-1/2 -top-[14vw] z-20 w-[70vw] -translate-x-1/2 md:-left-[min(5vw,4.5rem)] md:-top-[min(4vw,3rem)] md:w-[min(45vw,42rem)] md:translate-x-0"
        >
          <div data-footer-badge>
            <Image
              src="/brand/elengi-fresh-badge-passion-footer.svg"
              alt=""
              width={400}
              height={400}
              sizes="(min-width: 768px) 45vw, 70vw"
              className="h-auto w-full"
            />
          </div>
        </div>

        <div className="mx-auto grid max-w-[110rem] px-[var(--gutter)] pb-8 pt-[calc(56vw+3rem)] md:grid-cols-12 md:pt-20 lg:min-h-[38rem]">
          <div className="md:col-span-6 md:col-start-7 lg:col-span-5 lg:col-start-8">
            <h2 id="footer-titre" className="text-[clamp(2.75rem,5vw,5rem)] text-passion-accent">
              L&apos;amitié fermente ici
            </h2>
            <p className="mt-5 max-w-[34rem] text-lg leading-snug text-fond/85 md:text-xl">
              Inscrivez-vous et recevez 10&nbsp;% sur votre première commande, avec nos nouveautés en avant-première.
            </p>

            <form onSubmit={inscrire} noValidate className="mt-8 flex max-w-[34rem] flex-col gap-3 sm:flex-row">
              <label htmlFor="newsletter-email" className="sr-only">
                Adresse e-mail
              </label>
              <input
                id="newsletter-email"
                type="email"
                autoComplete="email"
                placeholder="Adresse e-mail"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (etat !== "idle") setEtat("idle");
                }}
                aria-invalid={etat === "erreur"}
                aria-describedby="newsletter-message"
                className="min-w-0 flex-1 rounded-full bg-passion-accent px-6 py-4 text-lg text-texte placeholder:text-texte/55 outline-none focus-visible:ring-4 focus-visible:ring-passion"
              />
              <button
                type="submit"
                className="pilule flow justify-center bg-bissap px-8 py-4 font-titre text-lg text-fond ring-2 ring-inset ring-fond/25 [--flow-remplissage:var(--passion)] hover:text-texte focus-visible:text-texte"
              >
                S&apos;inscrire
              </button>
            </form>
            <p id="newsletter-message" aria-live="polite" className="mt-3 min-h-6 text-sm">
              {etat === "erreur" && "Merci de saisir une adresse e-mail valide."}
              {etat === "ok" && "Merci ! Votre code de bienvenue arrive dans votre boîte mail."}
            </p>

            <p className="mt-6 max-w-[34rem] text-fond/85">
              Pour devenir revendeur ou nous trouver près de chez vous, écrivez-nous à{" "}
              <a href={`mailto:${CONTACT}`} className="underline underline-offset-4 hover:text-passion-accent">
                {CONTACT}
              </a>
            </p>

            <div className="mt-12 grid gap-10 sm:grid-cols-2">
              <nav aria-label="Liens du pied de page">
                <ul className="space-y-2 text-lg">
                  {navLinks.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="hover:text-passion-accent hover:underline">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                  <li>
                    <a href={`mailto:${CONTACT}`} className="hover:text-passion-accent hover:underline">
                      Nous contacter
                    </a>
                  </li>
                </ul>
              </nav>
              <div className="sm:border-l sm:border-fond/20 sm:pl-10">
                <p className="text-lg">Suivez-nous&nbsp;:</p>
                <ul className="mt-3 flex gap-4">
                  <li>
                    <a
                      href="#"
                      aria-label="Elengi Fresh sur Instagram"
                      className="block rounded-lg hover:text-passion-accent"
                    >
                      <Instagram />
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      aria-label="Elengi Fresh sur Facebook"
                      className="block rounded-lg hover:text-passion-accent"
                    >
                      <Facebook />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <div className="mt-12 border-t border-fond/20 pt-6 md:col-span-12 md:self-end">
            <ul className="etiquette flex flex-wrap gap-x-8 gap-y-2 text-xs">
              {pagesLegales.map((l) => (
                <li key={l.slug}>
                  <Link href={`/${l.slug}`} className="hover:text-passion-accent">
                    {l.court}
                  </Link>
                </li>
              ))}
            </ul>
            <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
              <div className="etiquette flex flex-wrap gap-x-8 gap-y-2 text-xs text-fond/70">
                <span>© {new Date().getFullYear()} Elengi Fresh</span>
                <span>L&apos;abus d&apos;alcool est dangereux pour la santé, à consommer avec modération.</span>
              </div>
              {/* Signature : logo du portfolio, atténué au repos, en couleur au survol */}
              <a
                href="https://danjoris.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Site réalisé par Dan Joris (danjoris.com, nouvel onglet)"
                className="group ml-auto block shrink-0 rounded-lg"
              >
                <Image
                  src="/assets/dj white.png"
                  alt=""
                  width={1024}
                  height={1024}
                  sizes="3rem"
                  className="h-8 w-8 object-contain opacity-30 transition-[opacity,scale,filter] duration-500 ease-[cubic-bezier(0.34,1.56,0.64,1)] group-hover:scale-110 group-hover:opacity-100 group-hover:drop-shadow-[0_0_12px_rgb(255_248_240/0.45)] group-focus-visible:opacity-100"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
