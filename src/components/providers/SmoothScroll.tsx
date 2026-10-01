"use client";

import { useEffect, useState } from "react";
import { ReactLenis, useLenis } from "lenis/react";
import { gsap, ScrollTrigger, REDUCED_MOTION } from "@/lib/gsap";

/** Lenis piloté par le ticker GSAP, désactivé si l'utilisateur préfère réduire les animations. */
export default function SmoothScroll() {
  const [enabled, setEnabled] = useState(false);

  // Les repères des animations au scroll sont recalculés dès que la hauteur de la page change
  // (images, polices, contenu ajouté) : sinon ils restent figés sur la page incomplète du chargement.
  useEffect(() => {
    let hauteur = 0;
    let minuteur = 0;
    const ro = new ResizeObserver(() => {
      const h = document.documentElement.scrollHeight;
      if (Math.abs(h - hauteur) < 2) return;
      hauteur = h;
      window.clearTimeout(minuteur);
      minuteur = window.setTimeout(() => ScrollTrigger.refresh(), 150);
    });
    ro.observe(document.body);
    return () => {
      ro.disconnect();
      window.clearTimeout(minuteur);
    };
  }, []);

  useEffect(() => {
    const mq = window.matchMedia(REDUCED_MOTION);
    const sync = () => setEnabled(!mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  if (!enabled) return null;
  return (
    <>
      {/* lerp plus élevé = la page rattrape la molette plus vite (défaut 0,1, plus « lourd ») ;
          wheelMultiplier > 1 = chaque cran de molette fait défiler un peu plus loin. */}
      <ReactLenis root options={{ autoRaf: false, lerp: 0.16, wheelMultiplier: 1.15 }} />
      <GsapBridge />
    </>
  );
}

function GsapBridge() {
  const lenis = useLenis();

  useEffect(() => {
    if (!lenis) return;
    lenis.on("scroll", ScrollTrigger.update);
    const update = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(update);
    gsap.ticker.lagSmoothing(0);
    ScrollTrigger.refresh();

    return () => {
      lenis.off("scroll", ScrollTrigger.update);
      gsap.ticker.remove(update);
    };
  }, [lenis]);

  return null;
}
