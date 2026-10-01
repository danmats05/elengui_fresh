"use client";

import { useRef } from "react";
import Image from "next/image";
import { gsap, useGSAP, FULL_MOTION } from "@/lib/gsap";
import { useAgeGate } from "@/components/providers/AgeGateProvider";
import { useDelaiEntree } from "@/components/providers/TransitionProvider";
import { getDrink } from "@/data/drinks";
import Can from "@/components/ui/Can";
import BadgeNew from "@/components/ui/BadgeNew";
import FlowButton from "@/components/ui/FlowButton";
import Sun from "@/components/ui/Sun";
import Engagements from "@/components/sections/Engagements";

const heroDrink = getDrink("rose-piquante");

export default function Hero() {
  const root = useRef<HTMLElement>(null);
  const { status, justVerified } = useAgeGate();
  const delaiEntree = useDelaiEntree();

  // Boucles et parallaxe : actives dès le montage.
  useGSAP(
    () => {
      gsap.matchMedia().add(FULL_MOTION, () => {
        gsap.to("[data-hero-float]", {
          y: -22,
          rotate: 2.5,
          duration: 2.8,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });
        gsap.to("[data-hero-sun-spin]", { rotate: 360, duration: 120, ease: "none", repeat: -1 });
        // Flottement doux des fruits autour de la canette.
        gsap.to("[data-hero-fruit]", {
          y: (i) => (i % 2 ? 12 : -14),
          rotate: (i) => (i % 2 ? -5 : 6),
          duration: (i) => 3.4 + i * 0.8,
          ease: "sine.inOut",
          yoyo: true,
          repeat: -1,
        });

        const scroll = { trigger: root.current, start: "top top", end: "bottom top", scrub: true };
        gsap.to("[data-hero-parallax-can]", { yPercent: 22, rotate: 8, ease: "none", scrollTrigger: scroll });
        gsap.to("[data-hero-parallax-sun]", { yPercent: 30, ease: "none", scrollTrigger: scroll });
        gsap.to("[data-hero-parallax-text]", { yPercent: -14, ease: "none", scrollTrigger: scroll });
        // Profondeur : le fruit du fond suit moins la canette, la tranche du premier plan davantage.
        gsap.to("[data-hero-depth='loin']", { yPercent: -18, ease: "none", scrollTrigger: scroll });
        gsap.to("[data-hero-depth='proche']", { yPercent: 28, ease: "none", scrollTrigger: scroll });
      });
    },
    { scope: root },
  );

  // Entrée : attend la validation de l'age gate, puis que les images du hero soient prêtes
  // (1,2 s maximum), pour que canette et fruits apparaissent d'un seul mouvement.
  useGSAP(
    () => {
      if (status !== "verified") return;
      gsap.matchMedia().add(FULL_MOTION, () => {
        const entree = gsap
          .timeline({ paused: true, delay: justVerified ? 0.55 : 0.15 + delaiEntree, defaults: { ease: "expo.out" } })
          .set("[data-reveal]", { visibility: "visible" })
          .from("[data-hero-sun]", { scale: 0.6, autoAlpha: 0, duration: 2 }, 0)
          .from("[data-hero-line]", { yPercent: 115, rotate: 3, duration: 1.3, stagger: 0.1 }, 0.05)
          .from("[data-hero-fade]", { y: 28, autoAlpha: 0, duration: 1, stagger: 0.08 }, 0.45)
          .from("[data-hero-can]", { yPercent: 70, rotate: -28, autoAlpha: 0, duration: 1.8 }, 0.2)
          .from("[data-hero-fruit]", { scale: 0, duration: 1.2, stagger: 0.18, ease: "back.out(2)" }, 0.6)
          .from("[data-hero-badge]", { scale: 0, rotate: -90, duration: 1, ease: "back.out(2.2)" }, 1.1);

        const images = [...(root.current?.querySelectorAll("img") ?? [])].filter((img) => !img.complete);
        const pretes = Promise.all(images.map((img) => img.decode().catch(() => undefined)));
        const delaiMax = new Promise((r) => setTimeout(r, 1200));
        let annule = false;
        Promise.race([pretes, delaiMax]).then(() => {
          if (!annule) entree.play();
        });
        return () => {
          annule = true;
        };
      });
    },
    { scope: root, dependencies: [status] },
  );

  return (
    <section
      ref={root}
      data-hero
      aria-labelledby="hero-titre"
      className="grain relative isolate flex min-h-[100svh] flex-col overflow-hidden bg-bissap text-fond"
    >
      {/* Soleil géant + halo derrière la canette */}
      <div
        data-hero-parallax-sun
        className="pointer-events-none absolute -right-[45vw] top-[38%] -z-10 w-[130vw] md:-right-[18vw] md:top-[-12%] md:w-[78vw]"
      >
        <div data-hero-sun data-reveal className="relative">
          <div className="absolute inset-[18%] rounded-full bg-bissap-accent/45 blur-[90px]" />
          <div data-hero-sun-spin>
            <Sun color="var(--bissap-accent)" className="relative h-auto w-full opacity-30" />
          </div>
        </div>
      </div>

      <div className="mx-auto grid w-full flex-1 max-w-[110rem] grid-cols-1 items-center gap-y-6 px-[var(--gutter)] pb-14 pt-[calc(var(--header-h)+2.5rem)] md:grid-cols-12 md:pb-10 md:pt-[var(--header-h)]">
        <div data-hero-parallax-text className="relative z-10 md:col-span-7">
          <h1 id="hero-titre" className="text-[clamp(3.6rem,9.5vw,9.5rem)] text-passion-accent">
            <span className="block overflow-hidden pb-[0.08em]">
              <span data-hero-line data-reveal className="block origin-bottom-left">
                Vin de fruits,
              </span>
            </span>
            <span className="-mt-[0.08em] block overflow-hidden pb-[0.08em]">
              <span data-hero-line data-reveal className="block origin-bottom-left">
                un pur <span className="text-passion">plaisir.</span>
              </span>
            </span>
          </h1>

          <p data-hero-fade data-reveal className="mt-7 max-w-[34rem] text-lg leading-snug text-fond/85 md:text-xl">
            Nos fruits fermentent doucement, avec une touche de soleil qui les rend légers et délicieux. Quatre saveurs
            vives, à partager entre <span className="whitespace-nowrap">amis :</span> impossible de n&apos;en goûter
            qu&apos;une.
          </p>

          <div data-hero-fade data-reveal className="mt-10">
            <FlowButton href="/#gamme">Découvrir la gamme</FlowButton>
          </div>
        </div>

        {/* Canette : parallaxe > entrée > flottement > inclinaison */}
        <div className="relative flex justify-center md:col-span-5 md:pr-[4vw]">
          <div data-hero-parallax-can className="relative">
            {/* Arrière-plan : pamplemousses plus petits, en retrait et légèrement flous */}
            <div
              data-hero-depth="loin"
              className="absolute -left-[6.5rem] bottom-[30%] w-24 md:-left-[10rem] md:bottom-[3%] md:w-[8.5rem] xl:-left-[15rem] xl:bottom-[26%] xl:w-[clamp(9rem,12.5vw,12.5rem)]"
            >
              <div data-hero-fruit data-reveal>
                <Image
                  src="/assets/Pamplemousse-220246-800px-copie.webp"
                  priority
                  alt=""
                  width={800}
                  height={800}
                  sizes="(min-width: 1280px) 13vw, (min-width: 768px) 9rem, 7rem"
                  className="h-auto w-full -rotate-12 opacity-90 blur-[2.5px] drop-shadow-[0_20px_25px_rgb(42_20_20/0.35)]"
                />
              </div>
            </div>

            <div data-hero-can data-reveal className="relative z-10">
              <div data-hero-float className="relative">
                <div className="relative rotate-[16deg] drop-shadow-[0_40px_50px_rgb(42_20_20/0.55)]">
                  {/* Pastille « nouveauté » accrochée au coin du couvercle (repère incliné de la canette), redressée de 16° */}
                  <div
                    data-hero-badge
                    data-reveal
                    className="absolute right-0 top-[3%] z-30 w-24 -translate-y-1/2 translate-x-1/2 -rotate-[16deg] md:left-0 md:right-auto md:w-32 md:-translate-x-1/2"
                  >
                    <BadgeNew priority sizes="(min-width: 768px) 8rem, 6rem" />
                  </div>
                  <Can
                    drink={heroDrink}
                    priority
                    className="h-auto w-[clamp(10rem,42vw,14rem)] md:w-[clamp(14rem,20vw,20rem)]"
                  />
                </div>
              </div>
            </div>

            {/* Pamplemousses en miroir, en haut à gauche : un peu plus grands que ceux du bas */}
            <div
              data-hero-depth="loin"
              className="absolute -left-[3.5rem] -top-[4%] w-32 md:-left-[5rem] md:-top-[5%] md:w-[11rem] xl:-left-[6.5rem] xl:-top-[7%] xl:w-[clamp(12rem,17vw,17.5rem)]"
            >
              <div data-hero-fruit data-reveal>
                <Image
                  src="/assets/Pamplemousse-220246-800px-copie.webp"
                  priority
                  alt=""
                  width={800}
                  height={800}
                  sizes="(min-width: 1280px) 17vw, (min-width: 768px) 11rem, 8rem"
                  className="h-auto w-full -scale-x-100 rotate-12 drop-shadow-[0_20px_25px_rgb(42_20_20/0.35)]"
                />
              </div>
            </div>

            {/* Citron vert, en haut à droite, légèrement en retrait */}
            <div
              data-hero-depth="loin"
              className="absolute -right-[6.5rem] top-[30%] w-28 md:-right-[8.5rem] md:top-[2%] md:w-[10rem] xl:-right-[13rem] xl:top-[1%] xl:w-[clamp(11rem,14vw,14.5rem)]"
            >
              <div data-hero-fruit data-reveal>
                <Image
                  src="/assets/citron-vert.png"
                  priority
                  alt=""
                  width={500}
                  height={500}
                  sizes="(min-width: 1280px) 14vw, (min-width: 768px) 10rem, 7rem"
                  className="h-auto w-full -rotate-[24deg] blur-[1px] drop-shadow-[0_20px_25px_rgb(42_20_20/0.35)]"
                />
              </div>
            </div>

            {/* Gingembre, en bas devant la canette */}
            <div
              data-hero-depth="proche"
              className="absolute -bottom-[8%] -left-[4.5rem] z-20 w-36 md:-left-[6rem] md:w-[12rem] xl:-left-[9rem] xl:-bottom-[10%] xl:w-[clamp(13rem,17vw,17.5rem)]"
            >
              <div data-hero-fruit data-reveal>
                <Image
                  src="/assets/gingembre-chine.jpg"
                  priority
                  alt=""
                  width={800}
                  height={800}
                  sizes="(min-width: 1280px) 17vw, (min-width: 768px) 12rem, 9rem"
                  className="h-auto w-full rotate-[10deg] blur-[1px] drop-shadow-[0_24px_30px_rgb(42_20_20/0.5)]"
                />
              </div>
            </div>

            {/* Premier plan : la tranche, plus grande et nette */}
            <div
              data-hero-depth="proche"
              className="absolute -right-[6rem] top-[60%] z-20 w-36 md:-right-[6.5rem] md:top-[61%] md:w-[12rem] xl:-right-[12.5rem] xl:top-[58%] xl:w-[clamp(13rem,18.5vw,19rem)]"
            >
              <div data-hero-fruit data-reveal>
                <Image
                  src="/assets/91360098-grapefruit-slice-grapefruit-isolated-on-white-removebg-preview.png"
                  priority
                  alt=""
                  width={500}
                  height={500}
                  sizes="(min-width: 1280px) 19vw, (min-width: 768px) 12rem, 9rem"
                  className="h-auto w-full rotate-[14deg] drop-shadow-[0_30px_35px_rgb(42_20_20/0.5)]"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <Engagements />
    </section>
  );
}
