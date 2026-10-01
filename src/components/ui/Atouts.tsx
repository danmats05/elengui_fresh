const atouts = [
  { label: "Fermentation lente", icone: "/assets/icons8-sablier-100.svg" },
  { label: "Vrais fruits", icone: "/assets/icons8-agrumes-100.svg" },
  { label: "Sans alcool distillé", icone: "/assets/icons8-pas-d_alcool-100.svg" },
  { label: "Fruits et fleurs", icone: "/assets/icons8-fleur-100.svg" },
] as const;

/** Icône affichée en masque : la forme vient du SVG, la couleur du texte courant. */
function Icone({ src }: { src: string }) {
  const mask = `url("${src}") center / contain no-repeat`;
  return (
    <span
      aria-hidden="true"
      className="block h-12 w-12 bg-current md:h-14 md:w-14"
      style={{ mask, WebkitMask: mask }}
    />
  );
}

/** Les 4 atouts avec leurs icônes ; la couleur suit `currentColor`. */
export default function Atouts({ className = "" }: { className?: string }) {
  return (
    <ul className={`grid grid-cols-4 gap-3 ${className}`}>
      {atouts.map((a) => (
        <li key={a.label} className="flex flex-col items-center gap-2.5 text-center">
          <Icone src={a.icone} />
          <span className="etiquette text-[0.625rem] leading-tight tracking-[0.04em] md:text-xs md:tracking-[0.08em]">
            {a.label}
          </span>
        </li>
      ))}
    </ul>
  );
}
