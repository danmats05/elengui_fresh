"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap, ScrollTrigger, useGSAP, REDUCED_MOTION } from "@/lib/gsap";

const cx = (...parts: Array<string | undefined | false | null>) => parts.filter(Boolean).join(" ");

export type FlowSectionProps = {
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
  "aria-label"?: string;
};

/** Une carte plein écran : arrive en pivotant depuis son coin bas gauche et recouvre la précédente. */
export function FlowSection({ id, className, style = {}, children, "aria-label": ariaLabel }: FlowSectionProps) {
  return (
    <section
      id={id}
      data-flow-section
      aria-label={ariaLabel}
      className={cx("relative min-h-screen w-full overflow-hidden", className)}
    >
      <div
        data-flow-inner
        className="relative flex min-h-screen w-full flex-col justify-between gap-6 rounded-[2rem] px-[var(--gutter)] pb-[clamp(2rem,4vw,4rem)] pt-[clamp(2rem,6vw,5rem)] will-change-transform md:rounded-[3rem]"
        style={{ transformOrigin: "bottom left", ...style }}
      >
        {children}
      </div>
    </section>
  );
}

/** Empile des FlowSection : chacune est épinglée pendant que la suivante pivote par-dessus. */
export default function StoryScroll({
  children,
  className,
  "aria-label": ariaLabel,
}: {
  children: React.ReactNode;
  className?: string;
  "aria-label"?: string;
}) {
  const root = useRef<HTMLDivElement>(null);
  const [reduit, setReduit] = useState(false);
  const nombre = React.Children.count(children);

  useEffect(() => {
    const mq = window.matchMedia(REDUCED_MOTION);
    const maj = () => setReduit(mq.matches);
    maj();
    mq.addEventListener("change", maj);
    return () => mq.removeEventListener("change", maj);
  }, []);

  useGSAP(
    () => {
      if (!root.current || reduit) return;
      const sections = gsap.utils.toArray<HTMLElement>("[data-flow-section]", root.current);
      if (!sections.length) return;
      const triggers: ScrollTrigger[] = [];

      sections.forEach((section, i) => {
        gsap.set(section, { zIndex: i + 1 });
        const inner = section.querySelector<HTMLElement>("[data-flow-inner]");
        if (!inner) return;

        if (i > 0) {
          gsap.set(inner, { rotation: 30, transformOrigin: "bottom left" });
          const tween = gsap.to(inner, {
            rotation: 0,
            ease: "none",
            scrollTrigger: { trigger: section, start: "top bottom", end: "top 25%", scrub: true },
          });
          if (tween.scrollTrigger) triggers.push(tween.scrollTrigger);
        }

        if (i < sections.length - 1) {
          triggers.push(
            ScrollTrigger.create({
              trigger: section,
              start: "bottom bottom",
              end: "bottom top",
              pin: true,
              pinSpacing: false,
            }),
          );
        }
      });

      ScrollTrigger.refresh();
      return () => triggers.forEach((t) => t.kill());
    },
    { scope: root, dependencies: [nombre, reduit] },
  );

  return (
    <div ref={root} aria-label={ariaLabel} className={cx("w-full overflow-x-clip", className)}>
      {children}
    </div>
  );
}
