import Image from "next/image";
import { gsap, REDUCED_MOTION } from "@/lib/gsap";
import type { DrinkSlug } from "@/data/drinks";

type Visuel = { src: string; w: number; h: number };

const v = (src: string, w: number, h: number): Visuel => ({ src: `/assets/${src}`, w, h });

const TRANCHE_PAMPLEMOUSSE = v("91360098-grapefruit-slice-grapefruit-isolated-on-white-removebg-preview.png", 500, 500);
const CITRON_VERT = v("citron-vert.png", 500, 500);
const CITRON_JAUNE = v("citon-jaune.png", 518, 482);
const ORANGE = v("orange.png", 559, 447);
const GINGEMBRE = v("gingembre-chine.jpg", 800, 800);
const MANGUE = v("mangue.webp", 1440, 1440);
const TRANCHE_MANGUE = v("tranche_mangue.webp", 350, 350);
const DEMI_PASSION = v("fruit_dlp.png", 520, 480);
const PASSION = v("fdlp.png", 500, 500);
const PAMPLEMOUSSE = v("Pamplemousse-220246-800px-copie.webp", 800, 800);
const HIBISCUS = v("fleur_hibiscus-removebg-preview.png", 500, 500);
const CALICE_BISSAP = v("fleur_hibiscus.png", 535, 467);

/**
 * Ingrédients de chaque boisson, sans doublon.
 * Ordre : [tranche du fruit principal, fruit principal entier, deuxième ingrédient, troisième ?]
 * (pour le bissap : fleur, calice, puis le gingembre).
 */
export const fruitsParBoisson: Record<DrinkSlug, Visuel[]> = {
  "rose-piquante": [TRANCHE_PAMPLEMOUSSE, PAMPLEMOUSSE, CITRON_VERT, GINGEMBRE],
  "mangue-doree": [TRANCHE_MANGUE, MANGUE, ORANGE],
  "passion-vive": [DEMI_PASSION, PASSION, CITRON_JAUNE],
  "bissap-royal": [HIBISCUS, CALICE_BISSAP, GINGEMBRE],
};

/** Rang de l'ingrédient ; une liste donne des choix de repli quand la boisson a moins d'ingrédients. */
type Rang = number | readonly number[];
type Eclat = { visuel: Rang; x: number; y: number; rot: number; taille: number; flou: number };

export const visuelDe = (fruits: Visuel[], rang: Rang) => {
  const choix = typeof rang === "number" ? [rang] : rang;
  return fruits[choix.find((r) => r < fruits.length) ?? 0];
};

/**
 * Position finale de chaque éclat, en % de la carte depuis son centre.
 * Les quatre premiers sont nets, entiers dans la carte (|x| + taille / 2 ≤ 48) et à côté de la canette.
 * Haut droite : tranche · haut gauche : fruit entier · bas gauche : 2e ingrédient · bas droite : 3e ingrédient.
 */
const dispositionCarte: Eclat[] = [
  { visuel: 0, x: 28, y: -18, rot: 22, taille: 38, flou: 0 },
  { visuel: 1, x: -28, y: -20, rot: -10, taille: 36, flou: 0 },
  { visuel: 2, x: -28, y: 24, rot: -18, taille: 36, flou: 0 },
  { visuel: [3, 1], x: 30, y: 27, rot: 16, taille: 32, flou: 0 },
  { visuel: 2, x: 3, y: -43, rot: 120, taille: 15, flou: 4.5 },
  { visuel: 0, x: 2, y: 43, rot: -40, taille: 17, flou: 4 },
];

/** Petites cartes (« Découvrir aussi ») : la canette occupe plus de place, les éclats restent sur les bords. */
const dispositionCompacte: Eclat[] = [
  { visuel: 0, x: 34, y: -22, rot: 22, taille: 28, flou: 0 },
  { visuel: 1, x: -34, y: -20, rot: -10, taille: 28, flou: 0 },
  { visuel: 2, x: -34, y: 26, rot: -18, taille: 28, flou: 0 },
  { visuel: [3, 1], x: 34, y: 26, rot: 16, taille: 26, flou: 0 },
  { visuel: 2, x: 0, y: -44, rot: 120, taille: 14, flou: 4 },
  { visuel: 0, x: 0, y: 44, rot: -40, taille: 14, flou: 4 },
];

export const dispositionDe = (compacte = false) => (compacte ? dispositionCompacte : dispositionCarte);

/** Éclats de fruits cachés derrière la canette ; animés par le parent (data-eclat). */
export default function EclatsFruits({ slug, compacte = false }: { slug: DrinkSlug; compacte?: boolean }) {
  const fruits = fruitsParBoisson[slug];
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0">
      {dispositionDe(compacte).map((e, i) => {
        const v = visuelDe(fruits, e.visuel);
        return (
          <div
            key={i}
            data-eclat={i}
            data-x={e.x}
            data-y={e.y}
            data-rot={e.rot}
            className="invisible absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-0 opacity-0"
            style={{ width: `${e.taille}%`, zIndex: e.flou ? 0 : 1 }}
          >
            <Image
              src={v.src}
              alt=""
              width={v.w}
              height={v.h}
              sizes="10rem"
              draggable={false}
              className="h-auto w-full drop-shadow-[0_18px_22px_rgb(42_20_20/0.45)]"
              style={e.flou ? { filter: `blur(${e.flou}px)` } : undefined}
            />
          </div>
        );
      })}
    </div>
  );
}

/** Survol d'une carte ([data-carte-boite] + éclats) : les fruits jaillissent de derrière la canette, puis y retournent. */
export function montrerFruits(carte: HTMLElement, ouvert: boolean) {
  if (window.matchMedia(REDUCED_MOTION).matches) return;
  const boite = carte.querySelector<HTMLElement>("[data-carte-boite]");
  const pieces = carte.querySelectorAll<HTMLElement>("[data-eclat]");
  if (!boite || !pieces.length) return;
  const { width, height } = boite.getBoundingClientRect();
  if (ouvert) {
    gsap.to(pieces, {
      x: (_, el: HTMLElement) => (Number(el.dataset.x) / 100) * width,
      y: (_, el: HTMLElement) => (Number(el.dataset.y) / 100) * height,
      rotate: (_, el: HTMLElement) => Number(el.dataset.rot),
      scale: 1,
      autoAlpha: 1,
      duration: 0.75,
      ease: "back.out(1.6)",
      stagger: { each: 0.045, from: "start" },
      overwrite: true,
    });
  } else {
    gsap.to(pieces, {
      x: 0,
      y: 0,
      rotate: 0,
      scale: 0,
      autoAlpha: 0,
      duration: 0.45,
      ease: "power3.in",
      stagger: { each: 0.03, from: "end" },
      overwrite: true,
    });
  }
}
