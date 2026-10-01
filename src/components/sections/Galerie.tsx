"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, ScrollTrigger, useGSAP, FULL_MOTION } from "@/lib/gsap";
import FlowButton from "@/components/ui/FlowButton";
import Marquee from "@/components/sections/Marquee";
import Atouts from "@/components/ui/Atouts";

/** Photos du carrousel (public/assets/carrousel), recadrées au format des tuiles (3/4). */
const photo = (fichier: string, position = "center") => ({
  src: encodeURI(`/assets/carrousel/${fichier}`),
  position,
});

type Tuile = { src: string; position: string };

const colonnes: Tuile[][] = [
  [
    photo("wUxev.jpeg"), // pamplemousse
    photo("Gemini_Generated_Image_b72scdb72scdb72s.jpeg", "58% center"), // Rose Piquante servie
    photo("_.jpeg"), // citron vert
    photo("Gemini_Generated_Image_12a1jg12a1jg12a1.jpeg", "center 30%"), // Passion Vive en main
    photo("_ (1).jpeg"), // calices de bissap
    photo("Gemini_Generated_Image_i68yuzi68yuzi68y.jpeg", "45% center"), // Bissap Royal dans les lunettes
  ],
  [
    photo("836754805817423619.jpeg"), // orange
    photo("Gemini_Generated_Image_p3d5u3p3d5u3p3d5.jpeg", "center 18%"), // Mangue Dorée à la plage
    photo("Passionfruit Halves_ A Golden Tropical Feast.jpeg"), // fruit de la passion
    photo("Gemini_Generated_Image_e5dra6e5dra6e5dr.jpeg", "52% center"), // Passion Vive servie
    photo("592786369749383118.jpeg"), // citron
  ],
];

function TuileVisuel({ tuile }: { tuile: Tuile }) {
  return (
    <div className="pb-4 md:pb-5">
      <div className="relative aspect-[3/4] overflow-hidden rounded-[1.75rem] bg-bissap/10 [transform:translateZ(0)] md:rounded-[2rem]">
        <Image
          src={tuile.src}
          alt=""
          fill
          sizes="(min-width: 768px) 25vw, 45vw"
          // Chargées dès le départ : en différé, chaque tuile qui entre dans le cadre clignoterait le temps de charger.
          loading="eager"
          className="object-cover"
          style={{ objectPosition: tuile.position }}
          draggable={false}
        />
      </div>
    </div>
  );
}

export default function Galerie() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(FULL_MOTION, () => {
        // Défilement vertical continu : chaque colonne contient sa liste en double, on boucle sur la moitié.
        const boucles = gsap.utils
          .toArray<HTMLElement>("[data-galerie-col]")
          .map((col, i) =>
            gsap.fromTo(
              col,
              { yPercent: i % 2 ? -50 : 0 },
              { yPercent: i % 2 ? 0 : -50, duration: i % 2 ? 42 : 36, ease: "none", repeat: -1 },
            ),
          );

        // Le scroll donne un coup d'accélérateur, qui retombe doucement.
        ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            const boost = 1 + Math.min(Math.abs(self.getVelocity()) / 400, 5);
            boucles.forEach((t) => {
              t.timeScale(boost);
              gsap.to(t, { timeScale: 1, duration: 1.2, ease: "power2.out", overwrite: true });
            });
          },
        });

        gsap.from("[data-galerie-texte]", {
          y: 40,
          autoAlpha: 0,
          duration: 1,
          ease: "expo.out",
          stagger: 0.1,
          scrollTrigger: { trigger: "[data-galerie-texte-bloc]", start: "top 75%" },
        });
      });
    },
    { scope: root },
  );

  return (
    <section ref={root} aria-labelledby="galerie-titre" className="relative z-10 overflow-x-clip bg-fond text-texte">
      <div className="mx-auto flex w-full max-w-[110rem] flex-col-reverse gap-12 md:h-[100svh] md:min-h-[44rem] px-[var(--gutter)] md:grid md:grid-cols-12 md:items-center md:gap-8">
        {/* Colonnes de visuels qui défilent */}
        <div
          aria-hidden="true"
          className="relative grid h-[80svh] grid-cols-2 gap-4 overflow-hidden [mask-image:linear-gradient(to_bottom,transparent,#000_18%)] md:col-span-6 md:h-full md:gap-5 md:[mask-image:none]"
        >
          {colonnes.map((col, i) => (
            <div key={i} className="overflow-hidden">
              <div data-galerie-col className="will-change-transform [backface-visibility:hidden]">
                {[...col, ...col].map((tuile, j) => (
                  <TuileVisuel key={j} tuile={tuile} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Texte */}
        <div data-galerie-texte-bloc className="pt-20 md:col-span-6 md:col-start-7 md:pl-[3vw] md:pt-0">
          <h2
            id="galerie-titre"
            data-galerie-texte
            className="whitespace-nowrap text-[clamp(3rem,5.8vw,6.25rem)] text-bissap"
          >
            Né du fruit.
            <br />
            <span className="text-bissap-accent">Tout simplement.</span>
          </h2>

          <p data-galerie-texte className="mt-7 max-w-[32rem] text-lg leading-snug text-texte/80 md:text-xl">
            Tout part de fruits bien mûrs, de levures et d&apos;un peu de patience. Nos recettes s&apos;inspirent de la
            tradition congolaise du vin de fruits, avec ce petit supplément de soleil qui fait toute la différence.
          </p>

          <div data-galerie-texte>
            <Atouts className="mt-9 max-w-[32rem] text-bissap" />
          </div>

          <div data-galerie-texte className="mt-10">
            <FlowButton href="/#gamme" fleche={false} className="px-9">
              Voir nos boissons
            </FlowButton>
          </div>
        </div>
      </div>

      {/* Bande penchée : plus large que l'écran pour que ses extrémités ne laissent pas de vide */}
      <div className="relative z-20 -mx-[6vw] -mt-12 rotate-3 md:mt-0">
        {/* Aplat pourpre de la section suivante, incliné comme la bande : la jonction suit la pente */}
        <div aria-hidden="true" className="absolute inset-x-0 top-1/2 -z-10 h-[calc(50%+4vw)] bg-bissap" />
        <Marquee
          texte="Elengi Fresh, goût na goût · "
          className="titre bg-passion py-3 text-[clamp(2.25rem,5vw,4.5rem)] text-bissap md:py-4"
        />
      </div>
    </section>
  );
}
