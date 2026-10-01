type ChevronProps = { direction?: "droite" | "gauche"; className?: string };

/** Flèche de direction : uniquement la pointe, sans trait horizontal. */
export default function Chevron({ direction = "droite", className = "h-4 w-4" }: ChevronProps) {
  return (
    <svg viewBox="0 0 20 20" aria-hidden="true" className={className}>
      <path
        d={direction === "droite" ? "M7.5 4.5 13 10l-5.5 5.5" : "M12.5 4.5 7 10l5.5 5.5"}
        fill="none"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
