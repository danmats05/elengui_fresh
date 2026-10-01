"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP, FULL_MOTION } from "@/lib/gsap";
import { useAgeGate } from "@/components/providers/AgeGateProvider";
import { useDelaiEntree } from "@/components/providers/TransitionProvider";
import { drinks } from "@/data/drinks";
import { etapes } from "@/data/fabrication";
import Can from "@/components/ui/Can";
import Sun from "@/components/ui/Sun";
import FlowButton from "@/components/ui/FlowButton";
import StoryScroll, { FlowSection } from "@/components/ui/StoryScroll";

export default function Fabrication() {
  const root = useRef<HTMLElement>(null);
  const { status, justVerified } = useAgeGate();
  const delaiEntree = useDelaiEntree();

  // Introduction : titre, texte, soleil.
  useGSAP(
    () => {
      if (status !== "verified") return;
      gsap.matchMedia().add(FULL_MOTION, () => {
        gsap
          .timeline({ delay: justVerified ? 0.55 : 0.15 + delaiEntree, defaults: { ease: "expo.out" } })
          .set("[data-intro] [data-reveal]", { visibility: "visible" })
          .from("[data-intro-ligne]", { yPercent: 115, rotate: 3, duration: 1.3, stagger: 0.1 }, 0)
          .from("[data-intro-fade]", { y: 28, autoAlpha: 0, duration: 1, stagger: 0.08 }, 0.4)
          .from("[data-intro-soleil]", { scale: 0.5, rotate: -90, autoAlpha: 0, duration: 1.8 }, 0)
          // Frise : la ligne se trace, les cercles apparaissent l'un après l'autre.
          .from("[data-frise-ligne]", { scaleX: 0, duration: 1.4, ease: "power3.inOut" }, 0.8)
          .from("[data-frise-segment]", { scaleX: 0, duration: 0.7, stagger: 0.14, ease: "power3.inOut" }, 0.8)
          .from("[data-frise-point]", { scale: 0, duration: 0.7, stagger: 0.14, ease: "back.out(2.2)" }, 0.9)
          .from("[data-frise-texte]", { y: 12, autoAlpha: 0, duration: 0.7, stagger: 0.14 }, 1.05);
        gsap.to("[data-intro-soleil] > *", { rotate: 360, duration: 90, ease: "none", repeat: -1 });
      });
    },
    { scope: root, dependencies: [status] },
  );

  // Étapes : la carte pivote (StoryScroll) ; ses visuels sortent en bulle puis flottent.
  useGSAP(
    () => {
      gsap.matchMedia().add(FULL_MOTION, () => {
        gsap.utils.toArray<HTMLElement>("[data-flow-section]").forEach((etape) => {
          gsap.from(etape.querySelectorAll("[data-etape-visuel]"), {
            scale: 0,
            rotate: -25,
            duration: 1.2,
            stagger: 0.09,
            ease: "back.out(1.8)",
            scrollTrigger: { trigger: etape, start: "top 35%" },
          });
          gsap.from(etape.querySelectorAll("[data-etape-stop]"), {
            scale: 0,
            rotate: -40,
            duration: 0.9,
            delay: 0.5,
            ease: "back.out(2.6)",
            scrollTrigger: { trigger: etape, start: "top 35%" },
          });
          gsap.to(etape.querySelectorAll("[data-etape-flotte]"), {
            y: (i) => (i % 2 ? 14 : -16),
            rotate: (i) => (i % 2 ? -6 : 6),
            duration: (i) => 3.2 + i * 0.7,
            ease: "sine.inOut",
            yoyo: true,
            repeat: -1,
          });
        });
      });
    },
    { scope: root },
  );

  return (
    <main id="contenu" ref={root} className="overflow-x-clip bg-bissap text-fond">
      {/* Introduction */}
      <section
        data-intro
        aria-labelledby="fabrication-titre"
        className="grain relative isolate flex min-h-[100svh] flex-col items-center justify-center overflow-hidden px-[var(--gutter)] pb-16 pt-[calc(var(--header-h)+3rem)] text-center"
      >
        <div
          data-intro-soleil
          data-reveal
          className="pointer-events-none absolute left-1/2 top-1/2 -z-10 w-[140vw] -translate-x-1/2 -translate-y-1/2 opacity-20 md:w-[75vw]"
        >
          <div>
            <Sun color="var(--bissap-accent)" className="w-full" />
          </div>
        </div>

        <p data-intro-fade data-reveal className="etiquette text-sm text-pamplemousse md:text-base">
          Du fruit à la canette
        </p>
        <h1
          id="fabrication-titre"
          className="mt-5 text-[clamp(3.25rem,10.5vw,11rem)] leading-[0.86] text-passion-accent"
        >
          <span className="block overflow-hidden pb-[0.06em]">
            <span data-intro-ligne data-reveal className="block">
              Notre processus
            </span>
          </span>
          <span className="block overflow-hidden pb-[0.08em]">
            <span data-intro-ligne data-reveal className="block text-passion">
              de fabrication.
            </span>
          </span>
        </h1>
        <p
          data-intro-fade
          data-reveal
          className="mx-auto mt-7 max-w-[44rem] text-lg leading-snug text-fond/85 md:text-xl"
        >
          Nos fruits viennent de petits producteurs locaux, au Congo, qui les cultivent tout naturellement, sans
          pesticides ni engrais chimiques, et les cueillent à pleine maturité. Ajoutez des levures et un peu de patience
          : nos vins de fruits fermentent naturellement, sans alcool distillé ni sucre ajouté. Six étapes, du verger
          jusqu&apos;à votre verre.
        </p>

        {/* Frise : cercles numérotés reliés par une ligne droite */}
        <nav aria-label="Les étapes de fabrication" className="relative mt-14 w-full max-w-[72rem] md:mt-20">
          <span
            aria-hidden="true"
            data-frise-ligne
            className="absolute left-[8.33%] right-[8.33%] top-6 hidden h-0.5 origin-left bg-passion-accent/50 md:block"
          />
          <ol className="relative grid grid-cols-3 gap-y-10 md:grid-cols-6 md:gap-0">
            {etapes.map((e, i) => (
              <li key={e.titre} className="relative">
                {/* Mobile : trait vers le cercle suivant de la même ligne (3 par ligne) */}
                {i % 3 !== 2 && (
                  <span
                    aria-hidden="true"
                    data-frise-segment
                    className="absolute left-[calc(50%+1.5rem)] right-[calc(-50%+1.5rem)] top-6 h-0.5 origin-left bg-passion-accent/50 md:hidden"
                  />
                )}
                <a
                  href={`#etape-${i + 1}`}
                  className="group relative flex flex-col items-center gap-3 rounded-2xl text-center"
                >
                  <span
                    data-frise-point
                    className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full border-2 border-passion-accent bg-bissap font-accent text-lg text-passion-accent transition-colors duration-300 group-hover:bg-passion group-hover:text-texte"
                  >
                    {i + 1}
                  </span>
                  <span
                    data-frise-texte
                    className="etiquette text-xs text-fond/85 group-hover:text-fond md:text-[0.8125rem]"
                  >
                    {e.etiquette}
                  </span>
                </a>
              </li>
            ))}
          </ol>
        </nav>
      </section>

      {/* Étapes : cartes arrondies qui pivotent et s'empilent */}
      <StoryScroll aria-label="Les étapes de fabrication">
        {etapes.map((e, i) => (
          <FlowSection
            key={e.titre}
            id={`etape-${i + 1}`}
            aria-label={`Étape ${i + 1} : ${e.titre}`}
            style={{ backgroundColor: e.fond, color: e.texteCouleur }}
          >
            <div className="flex items-center justify-between gap-4">
              <p className="etiquette text-xs md:text-sm">
                Étape 0{i + 1} — {e.etiquette}
              </p>
              <p
                aria-hidden="true"
                className="font-accent text-[clamp(2.5rem,6vw,5rem)] leading-none"
                style={{ color: e.accent }}
              >
                0{i + 1}
              </p>
            </div>
            <hr className="border-current/30" />

            <div className="grid flex-1 items-center gap-10 md:grid-cols-[1.15fr_1fr]">
              <div>
                <h2 className="text-[clamp(3rem,8vw,8rem)]">{e.titre}</h2>
                <hr className="my-[2vw] border-current/30" />
                {e.texte.map((t) => (
                  <p key={t} className="mt-4 max-w-[40rem] text-lg leading-snug opacity-90 md:text-xl">
                    {t}
                  </p>
                ))}
                {i === etapes.length - 1 && (
                  <FlowButton href="/#gamme" className="mt-10">
                    Découvrir la gamme
                  </FlowButton>
                )}
              </div>

              {/* Visuels */}
              <div className="relative mx-auto grid aspect-square w-[min(100%,34rem)] place-items-center md:w-[min(115%,44rem)] md:-mr-[6%]">
                <div aria-hidden="true" className="absolute -inset-[8%]">
                  <div className="soleil-tourne">
                    <Sun color={e.accent} className="w-full opacity-50" />
                  </div>
                </div>
                {e.interdit ? (
                  <div data-etape-visuel className="relative w-[88%]">
                    <div data-etape-flotte>
                      <Image
                        src={e.interdit.src}
                        alt={e.interdit.alt}
                        width={e.interdit.w}
                        height={e.interdit.h}
                        sizes="(min-width: 768px) 38rem, 85vw"
                        className="h-auto w-full drop-shadow-[0_30px_40px_rgb(42_20_20/0.35)]"
                      />
                    </div>
                    {/* Main « stop » rouge (icône recolorée en masque) */}
                    <span
                      aria-hidden="true"
                      data-etape-stop
                      className="absolute -bottom-[4%] right-[2%] grid aspect-square w-[30%] place-items-center rounded-full bg-fond shadow-[0_16px_30px_rgb(42_20_20/0.35)] ring-[6px] ring-[#E53935]"
                    >
                      <span
                        className="block aspect-square w-[58%] bg-[#E53935]"
                        style={{
                          mask: 'url("/assets/icons8-hand-64.png") center / contain no-repeat',
                          WebkitMask: 'url("/assets/icons8-hand-64.png") center / contain no-repeat',
                        }}
                      />
                    </span>
                  </div>
                ) : e.photo ? (
                  <div data-etape-visuel className="relative w-[92%]">
                    <div data-etape-flotte>
                      <Image
                        src={e.photo.src}
                        alt={e.photo.alt}
                        width={e.photo.w}
                        height={e.photo.h}
                        sizes="(min-width: 768px) 40rem, 90vw"
                        className="h-auto w-full rounded-[2rem] object-cover shadow-[0_30px_60px_rgb(42_20_20/0.35)] md:rounded-[2.5rem]"
                      />
                    </div>
                  </div>
                ) : e.bouquet ? (
                  e.bouquet.map((v) => (
                    // Le centrage (translate) est sur ce conteneur : GSAP anime l'enfant et remettrait translate à none.
                    <div
                      key={v.src}
                      className="absolute"
                      style={{
                        left: `${v.x}%`,
                        top: `${v.y}%`,
                        width: `${v.taille}%`,
                        transform: "translate(-50%, -50%)",
                      }}
                    >
                      <div data-etape-visuel>
                        <div data-etape-flotte>
                          <Image
                            src={v.src}
                            alt=""
                            width={v.w}
                            height={v.h}
                            sizes="(min-width: 768px) 16rem, 40vw"
                            className="h-auto w-full drop-shadow-[0_18px_22px_rgb(42_20_20/0.35)]"
                            style={{ rotate: `${v.rot}deg` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))
                ) : e.visuels.length > 0 ? (
                  e.visuels.map((v, k) => (
                    <div
                      key={v.src}
                      data-etape-visuel
                      className={`absolute ${k ? "bottom-[2%] right-[0%] w-[54%]" : "left-[0%] top-[2%] w-[72%]"}`}
                    >
                      <div data-etape-flotte>
                        <Image
                          src={v.src}
                          alt=""
                          width={v.w}
                          height={v.h}
                          sizes="(min-width: 768px) 20rem, 60vw"
                          className="h-auto w-full drop-shadow-[0_24px_30px_rgb(42_20_20/0.35)]"
                        />
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="relative flex h-[78%] items-end justify-center gap-[3%]">
                    {drinks.map((d, k) => (
                      <div key={d.slug} data-etape-visuel className="h-full min-w-0 flex-1">
                        <div data-etape-flotte className="h-full" style={{ rotate: `${(k - 1.5) * 6}deg` }}>
                          <Can
                            drink={d}
                            sizes="8rem"
                            className="h-full w-full drop-shadow-[0_24px_30px_rgb(42_20_20/0.45)]"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </FlowSection>
        ))}
      </StoryScroll>
    </main>
  );
}
