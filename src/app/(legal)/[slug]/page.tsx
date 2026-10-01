import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { MISE_A_JOUR, pageLegale, pagesLegales } from "@/data/legal";
import Chevron from "@/components/ui/Chevron";

export const dynamicParams = false;

export function generateStaticParams() {
  return pagesLegales.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata(props: PageProps<"/[slug]">): Promise<Metadata> {
  const page = pageLegale((await props.params).slug);
  return page ? { title: page.titre, description: page.intro } : {};
}

export default async function Page(props: PageProps<"/[slug]">) {
  const page = pageLegale((await props.params).slug);
  if (!page) notFound();

  return (
    <main id="contenu" className="bg-bissap text-fond">
      <div className="mx-auto max-w-[110rem] px-[var(--gutter)] pb-20 pt-[calc(var(--header-h)+4rem)] md:pb-28">
        <Link href="/" className="etiquette inline-flex items-center gap-2 text-xs opacity-80 hover:opacity-100">
          <Chevron direction="gauche" className="h-3.5 w-3.5" /> Accueil
        </Link>
        <h1 className="mt-6 text-[clamp(3rem,7vw,7rem)] text-passion-accent">{page.titre}</h1>
        <p className="mt-5 max-w-[40rem] text-lg text-fond/85 md:text-xl">{page.intro}</p>
        <p className="etiquette mt-4 text-xs text-fond/60">Mise à jour : {MISE_A_JOUR}</p>

        <div className="mt-14 grid gap-12 lg:grid-cols-[16rem_1fr] lg:gap-20">
          <nav aria-label="Pages légales" className="lg:sticky lg:top-28 lg:self-start">
            <ul className="flex flex-wrap gap-2 lg:flex-col">
              {pagesLegales.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/${p.slug}`}
                    aria-current={p.slug === page.slug ? "page" : undefined}
                    className="pilule px-4 py-2.5 text-sm text-fond/80 ring-1 ring-inset ring-fond/25 hover:text-fond aria-[current=page]:bg-passion-accent aria-[current=page]:text-texte aria-[current=page]:ring-0"
                  >
                    {p.titre}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <article className="max-w-[46rem] space-y-10 rounded-[2rem] bg-bissap-profond p-7 md:p-12">
            {page.blocs.map((b) => (
              <section key={b.titre}>
                <h2 className="font-titre text-2xl font-bold text-passion-accent md:text-3xl">{b.titre}</h2>
                {b.liste && (
                  <ul className="mt-4 space-y-2 text-lg leading-snug text-fond/90">
                    {b.liste.map((l) => (
                      <li key={l} className="flex gap-3">
                        <span aria-hidden="true" className="mt-2.5 h-2 w-2 shrink-0 rounded-full bg-pamplemousse" />
                        {l}
                      </li>
                    ))}
                  </ul>
                )}
                {b.paragraphes?.map((t) => (
                  <p key={t} className="mt-4 text-lg leading-snug text-fond/90">
                    {t}
                  </p>
                ))}
              </section>
            ))}
          </article>
        </div>
      </div>
    </main>
  );
}
