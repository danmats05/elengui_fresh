import Image from "next/image";

/** Badge « NEW » qui se balance doucement (animation CSS, coupée si l'utilisateur réduit les animations). */
export default function BadgeNew({
  className = "",
  sizes = "8rem",
  priority = false,
}: {
  className?: string;
  sizes?: string;
  priority?: boolean;
}) {
  return (
    <Image
      src="/assets/new.png"
      alt="Nouveau"
      width={512}
      height={513}
      sizes={sizes}
      priority={priority}
      className={`badge-balance h-auto w-full drop-shadow-[0_10px_14px_rgb(42_20_20/0.4)] ${className}`}
    />
  );
}
