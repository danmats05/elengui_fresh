import type { Metadata } from "next";
import Fabrication from "@/components/sections/Fabrication";

export const metadata: Metadata = {
  title: "Notre fabrication",
  description:
    "Du fruit à la canette : comment Elengi Fresh fermente naturellement ses vins de fruits, sans alcool distillé, jusqu'à 6 % vol.",
};

export default function Page() {
  return <Fabrication />;
}
