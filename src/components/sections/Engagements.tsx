import { Fragment } from "react";
import { engagements } from "@/data/site";
import Marquee from "@/components/sections/Marquee";

/** Bandeau des engagements, posé en bas du hero. */
export default function Engagements() {
  return (
    <div
      data-hero-fade
      data-reveal
      className="relative z-20 bg-bissap-profond etiquette px-[var(--gutter)] py-3.5 text-center text-sm md:py-3.5 md:text-base"
    >
      <h2 className="sr-only">Nos engagements</h2>
      {/* Mobile : les engagements défilent sur une seule ligne */}
      <Marquee
        texte={`${engagements.flat().join(" · ")} · `}
        duree={55}
        className="-mx-[var(--gutter)] text-fond md:hidden"
      />
      <ul className="hidden md:block">
        {engagements.map((line, i) => (
          <li key={i} className={i === 0 ? "text-fond" : "text-passion-accent"}>
            {line.map((item, j) => (
              <Fragment key={item}>
                <span className="whitespace-nowrap">
                  {item}
                  {j < line.length - 1 && <span aria-hidden="true"> ·</span>}
                </span>{" "}
              </Fragment>
            ))}
          </li>
        ))}
      </ul>
    </div>
  );
}
