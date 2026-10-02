import Image from "next/image";
import { abv, volume, type Drink, type DrinkSlug } from "@/data/drinks";

/** Canettes dont le PNG est livré dans public/cans/ (dimensions du fichier recadré). */
const CAN_IMAGES: Partial<Record<DrinkSlug, { width: number; height: number }>> = {
  "rose-piquante": { width: 701, height: 1634 },
  "mangue-doree": { width: 673, height: 1340 },
  "passion-vive": { width: 672, height: 1344 },
  "bissap-royal": { width: 671, height: 1344 },
};

type CanProps = {
  drink: Drink;
  className?: string;
  priority?: boolean;
  /** Charger l'image tout de suite (sans attendre qu'elle approche de l'écran). */
  eager?: boolean;
  sizes?: string;
};

export default function Can({
  drink,
  className = "",
  priority,
  eager,
  sizes = "(min-width: 768px) 30vw, 60vw",
}: CanProps) {
  const image = CAN_IMAGES[drink.slug];
  if (image) {
    return (
      <Image
        src={drink.can}
        alt={`Canette ${drink.name}, ${drink.fruit.toLowerCase()}, ${abv}, ${volume}`}
        width={image.width}
        height={image.height}
        sizes={sizes}
        priority={priority}
        loading={priority ? undefined : eager ? "eager" : "lazy"}
        className={`select-none object-contain ${className}`}
        draggable={false}
      />
    );
  }

  return <CanPlaceholder drink={drink} className={className} />;
}

const METAL = "linear-gradient(90deg, #8d8a88 0%, #e9e6e3 22%, #fdfcfb 32%, #b9b5b2 60%, #807c79 100%)";

const CYLINDER =
  "linear-gradient(90deg, rgba(20,6,10,.42) 0%, rgba(20,6,10,.08) 14%, rgba(255,255,255,.28) 24%, rgba(255,255,255,.04) 34%, rgba(255,255,255,0) 62%, rgba(20,6,10,.18) 84%, rgba(20,6,10,.45) 100%)";

/** Canette provisoire : cylindre à la couleur de la boisson, avec son badge. */
function CanPlaceholder({ drink, className }: { drink: Drink; className?: string }) {
  return (
    <div
      role="img"
      aria-label={`Canette ${drink.name} (visuel provisoire), ${drink.fruit.toLowerCase()}, ${abv}, ${volume}`}
      className={`relative aspect-[9/23] select-none [container-type:inline-size] ${className}`}
    >
      {/* Couvercle */}
      <div className="absolute inset-x-[4%] top-0 h-[3.2%] rounded-t-[40%]" style={{ background: METAL }} />
      <div className="absolute inset-x-0 top-[2.6%] h-[2.4%] rounded-[30%]" style={{ background: METAL }} />

      {/* Corps */}
      <div
        className="absolute inset-x-0 top-[4.4%] bottom-[3.6%] overflow-hidden rounded-[6%/2.5%]"
        style={{ backgroundColor: drink.color, color: drink.text }}
      >
        <span
          className="titre absolute bottom-[6%] left-[7%] whitespace-nowrap leading-[0.82] [writing-mode:vertical-rl] rotate-180"
          style={{ fontSize: "27cqw" }}
        >
          {drink.name}
        </span>

        <div className="absolute right-[8%] top-[6%] w-[52%] -rotate-6">
          <Image src={drink.badge} alt="" width={200} height={200} className="h-auto w-full" />
        </div>

        <div className="absolute bottom-[7%] right-[8%] flex w-[44%] flex-col items-start gap-[3cqw] font-bold leading-tight">
          <span className="uppercase opacity-80" style={{ fontSize: "5.4cqw", letterSpacing: "0.04em" }}>
            Vin de fruits fermentés
          </span>
          <span style={{ fontSize: "8cqw" }}>{drink.flavors.join(", ")}</span>
          <span
            className="rounded-[2cqw] px-[3cqw] py-[1cqw]"
            style={{ fontSize: "7cqw", backgroundColor: drink.accent, color: "#2A1414" }}
          >
            {abv}
          </span>
          <span style={{ fontSize: "6cqw" }}>{volume}</span>
        </div>

        {/* Volume du cylindre + reflets */}
        <div className="pointer-events-none absolute inset-0" style={{ background: CYLINDER }} />
        <div className="pointer-events-none absolute inset-y-0 left-[22%] w-[3%] bg-white/30 blur-[2px]" />
      </div>

      {/* Fond de canette */}
      <div className="absolute inset-x-[3%] bottom-0 h-[4.4%] rounded-b-[45%]" style={{ background: METAL }} />
    </div>
  );
}
