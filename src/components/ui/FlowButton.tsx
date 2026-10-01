import Link from "next/link";

type FlowButtonProps = {
  href: string;
  children: React.ReactNode;
  className?: string;
  /** Couleurs : fond au repos, remplissage au survol, texte. Par défaut corail / jaune / brun. */
  couleurs?: { fond?: string; remplissage?: string; texte?: string };
  /** false : même animation, sans les flèches. */
  fleche?: boolean;
  onClick?: () => void;
};

function Arrow({ className }: { className: string }) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={`absolute z-[9] h-4 w-4 ${className}`}>
      <path
        d="M7.5 4.5 13 10l-5.5 5.5"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/** Bouton à flèche : au survol, un cercle jaune remplit le bouton, la flèche passe à gauche et les coins se resserrent. */
export default function FlowButton({
  href,
  children,
  className = "",
  couleurs = {},
  fleche = true,
  onClick,
}: FlowButtonProps) {
  const vars = {
    "--fb-fond": couleurs.fond ?? "var(--pamplemousse)",
    "--fb-remplissage": couleurs.remplissage ?? "var(--passion)",
    "--fb-texte": couleurs.texte ?? "var(--texte)",
  } as React.CSSProperties;
  return (
    <Link
      href={href}
      onClick={onClick}
      style={vars}
      className={`group relative inline-flex items-center overflow-hidden rounded-[2rem] bg-[var(--fb-fond)] px-11 py-5 font-titre text-[1.0625rem] font-bold leading-none text-[var(--fb-texte)] transition-[border-radius,scale] duration-[400ms] ease-[cubic-bezier(0.23,1,0.32,1)] hover:rounded-[12px] focus-visible:rounded-[12px] active:scale-[0.95] ${className}`}
    >
      {/* Flèche d'arrivée, à gauche */}
      {fleche && (
        <Arrow className="left-5 -translate-x-14 transition-transform duration-[500ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] will-change-transform group-hover:translate-x-0 group-focus-visible:translate-x-0" />
      )}

      <span
        className={`relative z-[1] ${fleche ? "-translate-x-3 transition-transform duration-[500ms] ease-[cubic-bezier(0.23,1,0.32,1)] will-change-transform group-hover:translate-x-3 group-focus-visible:translate-x-3" : ""}`}
      >
        {children}
      </span>

      {/* Cercle de remplissage */}
      <span
        aria-hidden="true"
        className="absolute left-1/2 top-1/2 h-80 w-80 -translate-x-1/2 -translate-y-1/2 scale-[0.05] rounded-full bg-[var(--fb-remplissage)] opacity-0 transition-[scale,opacity] duration-[550ms] ease-[cubic-bezier(0.19,1,0.22,1)] will-change-transform group-hover:scale-100 group-hover:opacity-100 group-focus-visible:scale-100 group-focus-visible:opacity-100"
      />

      {/* Flèche de départ, à droite */}
      {fleche && (
        <Arrow className="right-5 transition-transform duration-[500ms] ease-[cubic-bezier(0.34,1.56,0.64,1)] will-change-transform group-hover:translate-x-14 group-focus-visible:translate-x-14" />
      )}
    </Link>
  );
}
