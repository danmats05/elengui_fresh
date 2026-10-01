"use client";

import { useRef } from "react";
import { gsap, ScrollTrigger, useGSAP, FULL_MOTION } from "@/lib/gsap";

type MarqueeProps = {
  texte: string;
  className?: string;
  style?: React.CSSProperties;
  /** Secondes pour parcourir une moitié de la piste. */
  duree?: number;
};

const COPIES = 6;

/** Bande de texte qui défile en boucle ; le scroll lui donne un coup d'accélérateur. */
export default function Marquee({ texte, className = "", style, duree = 22 }: MarqueeProps) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.matchMedia().add(FULL_MOTION, () => {
        // La piste contient deux moitiés identiques : on boucle sur -50 %.
        const boucle = gsap.to("[data-marquee-piste]", { xPercent: -50, duration: duree, ease: "none", repeat: -1 });

        ScrollTrigger.create({
          trigger: root.current,
          start: "top bottom",
          end: "bottom top",
          onUpdate: (self) => {
            boucle.timeScale(1 + Math.min(Math.abs(self.getVelocity()) / 300, 6));
            gsap.to(boucle, { timeScale: 1, duration: 1, ease: "power2.out", overwrite: true });
          },
        });
      });
    },
    { scope: root, dependencies: [duree] },
  );

  const moitie = Array.from({ length: COPIES }, (_, i) => (
    <span key={i} className="shrink-0 pr-[0.35em]">
      {texte}
    </span>
  ));

  return (
    <div ref={root} className={`overflow-hidden ${className}`} style={style}>
      <p className="sr-only">{texte.replace(/\s*·\s*$/, "")}</p>
      <div data-marquee-piste aria-hidden="true" className="flex w-max whitespace-nowrap">
        {moitie}
        {moitie}
      </div>
    </div>
  );
}
