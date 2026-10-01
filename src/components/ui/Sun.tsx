import type { HTMLAttributes } from "react";

type SunProps = Omit<HTMLAttributes<HTMLSpanElement>, "color"> & {
  color?: string;
};

/** Silhouette du soleil : icons8-sun-64 vectorisé (potrace), net à toutes les tailles. */
const SOURCE = "/assets/soleil.svg";
const ICONE = `url("${SOURCE}") center / contain no-repeat`;

/** Soleil décoratif : silhouette de l'icône, remplie avec la couleur demandée. */
export default function Sun({ color = "currentColor", className = "", style, ...props }: SunProps) {
  return (
    <span
      aria-hidden="true"
      className={`block aspect-square ${className}`}
      style={{ backgroundColor: color, mask: ICONE, WebkitMask: ICONE, ...style }}
      {...props}
    />
  );
}
