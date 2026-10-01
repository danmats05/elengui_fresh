"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, useGSAP);

// Mobile : la barre d'adresse qui apparaît/disparaît redimensionne la fenêtre ; sans ce réglage,
// chaque apparition relance un recalcul de toutes les animations au scroll (saut visible).
ScrollTrigger.config({ ignoreMobileResize: true });

export const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";
export const FULL_MOTION = "(prefers-reduced-motion: no-preference)";

export { gsap, ScrollTrigger, useGSAP };
