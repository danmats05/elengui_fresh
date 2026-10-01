import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { drinks, findDrink, ingredients } from "@/data/drinks";
import FicheProduit from "@/components/sections/FicheProduit";

export const dynamicParams = false;

export function generateStaticParams() {
  return drinks.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata(props: PageProps<"/boissons/[slug]">): Promise<Metadata> {
  const { slug } = await props.params;
  const drink = findDrink(slug);
  if (!drink) return {};
  return {
    title: drink.name,
    description: `${drink.name} : vin de fruits fermenté, ${ingredients(drink).toLowerCase()}. 6 % vol., 330 ml.`,
  };
}

export default async function Page(props: PageProps<"/boissons/[slug]">) {
  const { slug } = await props.params;
  const drink = findDrink(slug);
  if (!drink) notFound();
  return <FicheProduit drink={drink} />;
}
