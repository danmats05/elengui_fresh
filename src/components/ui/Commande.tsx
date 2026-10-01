"use client";

import { useRef, useState } from "react";
import { gsap, useGSAP, FULL_MOTION } from "@/lib/gsap";
import { formatPrix } from "@/data/produits";
import Sun from "@/components/ui/Sun";
import Chevron from "@/components/ui/Chevron";

export type Client = { prenom: string; nom: string; email: string; telephone: string; adresse: string; ville: string };

const villes = ["Brazzaville", "Pointe-Noire", "Dolisie", "Nkayi", "Ouesso", "Autre ville"];

const champ =
  "mt-1.5 w-full rounded-xl bg-transparent px-4 py-3 ring-2 ring-inset ring-[var(--p-accent)] outline-none placeholder:opacity-50 focus-visible:ring-current aria-[invalid=true]:ring-pamplemousse";

type Erreurs = Partial<Record<keyof Client | "motDePasse", string>>;

/** Étape 2 : inscription et coordonnées de livraison. */
export function FormulaireCommande({
  total,
  articles,
  onRetour,
  onValider,
}: {
  total: number;
  articles: number;
  onRetour: () => void;
  onValider: (client: Client) => void;
}) {
  const [client, setClient] = useState<Client>({
    prenom: "",
    nom: "",
    email: "",
    telephone: "",
    adresse: "",
    ville: villes[0],
  });
  const [compte, setCompte] = useState(true);
  const [motDePasse, setMotDePasse] = useState("");
  const [erreurs, setErreurs] = useState<Erreurs>({});
  const [envoi, setEnvoi] = useState(false);

  const maj = (cle: keyof Client) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setClient((c) => ({ ...c, [cle]: e.target.value }));
    if (erreurs[cle]) setErreurs((er) => ({ ...er, [cle]: undefined }));
  };

  const valider = (e: React.FormEvent) => {
    e.preventDefault();
    const er: Erreurs = {};
    if (!client.prenom.trim()) er.prenom = "Indiquez votre prénom.";
    if (!client.nom.trim()) er.nom = "Indiquez votre nom.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(client.email.trim())) er.email = "Adresse e-mail invalide.";
    if (client.telephone.replace(/\D/g, "").length < 8) er.telephone = "Numéro de téléphone incomplet.";
    if (!client.adresse.trim()) er.adresse = "Indiquez une adresse de livraison.";
    if (compte && motDePasse.length < 8) er.motDePasse = "8 caractères minimum.";
    setErreurs(er);
    const premier = Object.keys(er)[0];
    if (premier) {
      document.getElementById(`cmd-${premier}`)?.focus();
      return;
    }
    // Simulation d'envoi (vitrine : aucune donnée n'est transmise).
    setEnvoi(true);
    window.setTimeout(() => onValider(client), 900);
  };

  const Champ = ({
    id,
    label,
    type = "text",
    auto,
    ...rest
  }: {
    id: keyof Client;
    label: string;
    type?: string;
    auto?: string;
    placeholder?: string;
    inputMode?: React.HTMLAttributes<HTMLInputElement>["inputMode"];
  }) => (
    <div>
      <label htmlFor={`cmd-${id}`} className="text-sm">
        {label}
      </label>
      <input
        id={`cmd-${id}`}
        type={type}
        autoComplete={auto}
        value={client[id]}
        onChange={maj(id)}
        aria-invalid={!!erreurs[id]}
        aria-describedby={erreurs[id] ? `cmd-${id}-err` : undefined}
        className={champ}
        {...rest}
      />
      {erreurs[id] && (
        <p id={`cmd-${id}-err`} className="mt-1 text-sm font-bold">
          {erreurs[id]}
        </p>
      )}
    </div>
  );

  return (
    <form onSubmit={valider} noValidate className="flex h-full flex-col">
      <div className="-mx-2 flex-1 space-y-4 overflow-y-auto px-2 pb-2 pt-6">
        <p className="opacity-85">
          Créez votre compte pour suivre vos commandes et profiter de 10&nbsp;% sur la première.
        </p>
        <div className="grid grid-cols-2 gap-3">
          {Champ({ id: "prenom", label: "Prénom", auto: "given-name" })}
          {Champ({ id: "nom", label: "Nom", auto: "family-name" })}
        </div>
        {Champ({ id: "email", label: "E-mail", type: "email", auto: "email", placeholder: "vous@exemple.com" })}
        {Champ({
          id: "telephone",
          label: "Téléphone",
          type: "tel",
          auto: "tel",
          inputMode: "tel",
          placeholder: "+242 06 000 00 00",
        })}
        {Champ({ id: "adresse", label: "Adresse de livraison", auto: "street-address" })}
        <div>
          <label htmlFor="cmd-ville" className="text-sm">
            Ville
          </label>
          <select id="cmd-ville" value={client.ville} onChange={maj("ville")} className={`${champ} appearance-none`}>
            {villes.map((v) => (
              <option key={v} value={v} className="text-texte">
                {v}
              </option>
            ))}
          </select>
        </div>

        <label className="flex cursor-pointer items-center gap-3 pt-1">
          <input
            type="checkbox"
            checked={compte}
            onChange={(e) => setCompte(e.target.checked)}
            className="h-5 w-5 accent-current"
          />
          <span>Créer mon compte Elengi Fresh</span>
        </label>
        {compte && (
          <div>
            <label htmlFor="cmd-motDePasse" className="text-sm">
              Mot de passe
            </label>
            <input
              id="cmd-motDePasse"
              type="password"
              autoComplete="new-password"
              value={motDePasse}
              onChange={(e) => {
                setMotDePasse(e.target.value);
                if (erreurs.motDePasse) setErreurs((er) => ({ ...er, motDePasse: undefined }));
              }}
              aria-invalid={!!erreurs.motDePasse}
              aria-describedby="cmd-motDePasse-aide"
              className={champ}
            />
            <p id="cmd-motDePasse-aide" className={`mt-1 text-sm ${erreurs.motDePasse ? "font-bold" : "opacity-70"}`}>
              {erreurs.motDePasse ?? "8 caractères minimum."}
            </p>
          </div>
        )}
      </div>

      <div className="pt-5">
        <div className="flex items-baseline justify-between">
          <span className="text-lg">
            Total ({articles} pack{articles > 1 ? "s" : ""})
          </span>
          <span className="font-titre text-xl font-bold tabular-nums">{formatPrix(total)}</span>
        </div>
        <p className="mt-1 text-right text-sm opacity-75">Paiement à la livraison (espèces ou mobile money).</p>
        <button
          type="submit"
          disabled={envoi}
          className="flow mt-4 w-full rounded-[2rem] bg-[var(--p-bouton)] py-4 font-titre text-lg font-bold text-[var(--p-bouton-texte)] hover:rounded-[12px] focus-visible:rounded-[12px] disabled:cursor-wait"
        >
          {envoi ? "Validation en cours…" : "Confirmer la commande"}
        </button>
        <button
          type="button"
          onClick={onRetour}
          className="mx-auto mt-3 block text-sm opacity-80 underline-offset-4 hover:opacity-100 hover:underline"
        >
          <Chevron direction="gauche" className="mr-1 inline h-3.5 w-3.5 align-[-2px]" />
          Retour au panier
        </button>
      </div>
    </form>
  );
}

/** Étape 3 : commande validée, avec une animation de confirmation. */
export function CommandeValidee({
  client,
  numero,
  onTerminer,
}: {
  client: Client;
  numero: string;
  onTerminer: () => void;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.set("[data-ok-fade]", { autoAlpha: 1 });
      gsap.matchMedia().add(FULL_MOTION, () => {
        gsap
          .timeline({ defaults: { ease: "expo.out" } })
          .from("[data-ok-soleil]", { scale: 0, rotate: -120, duration: 1.2, ease: "back.out(1.4)" }, 0)
          .from("[data-ok-disque]", { scale: 0, duration: 0.7, ease: "back.out(2)" }, 0.15)
          .fromTo(
            "[data-ok-coche]",
            { strokeDashoffset: 48 },
            { strokeDashoffset: 0, duration: 0.55, ease: "power2.out" },
            0.55,
          )
          .from("[data-ok-fade]", { y: 24, autoAlpha: 0, duration: 0.8, stagger: 0.08 }, 0.7);
        gsap.to("[data-ok-soleil]", { rotate: "+=360", duration: 40, ease: "none", repeat: -1, delay: 1.2 });
      });
    },
    { scope: root },
  );

  return (
    <div ref={root} className="flex h-full flex-col items-center justify-center pb-6 text-center">
      <div className="relative grid h-56 w-56 place-items-center">
        <div data-ok-soleil className="absolute inset-0">
          <Sun color="var(--p-accent)" className="w-full opacity-50" />
        </div>
        <div data-ok-disque className="relative grid h-24 w-24 place-items-center rounded-full bg-[var(--p-bouton)]">
          <svg viewBox="0 0 48 48" aria-hidden="true" className="h-12 w-12 text-[var(--p-bouton-texte)]">
            <path
              data-ok-coche
              d="M12 25l8 8 16-17"
              fill="none"
              stroke="currentColor"
              strokeWidth="5"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="48"
            />
          </svg>
        </div>
      </div>

      <h3 data-ok-fade role="status" className="mt-6 font-titre text-4xl font-extrabold leading-none">
        Commande validée&nbsp;!
      </h3>
      <p data-ok-fade className="mt-4 max-w-[24rem] text-lg leading-snug opacity-90">
        Merci {client.prenom}, votre commande <strong className="font-titre font-bold">{numero}</strong> est confirmée.
      </p>
      <p data-ok-fade className="mt-2 max-w-[24rem] opacity-80">
        Un récapitulatif part vers {client.email}. Livraison à {client.ville} sous 48&nbsp;h.
      </p>
      <button
        data-ok-fade
        type="button"
        onClick={onTerminer}
        className="pilule bouton flow mt-8 bg-[var(--p-bouton)] text-[var(--p-bouton-texte)]"
      >
        Continuer mes achats
      </button>
    </div>
  );
}
