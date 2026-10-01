"use client";

import { createContext, useCallback, useContext, useState, useSyncExternalStore } from "react";
import { AGE_STORAGE_KEY } from "@/data/site";

/** "unknown" pendant le rendu serveur, avant que le stockage puisse être lu. */
type Status = "unknown" | "pending" | "verified";

type AgeGateValue = {
  status: Status;
  /** true si la validation vient d'avoir lieu (on attend la sortie de la modale). */
  justVerified: boolean;
  confirm: () => void;
};

const listeners = new Set<() => void>();

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const readStatus = (): Status => {
  try {
    return localStorage.getItem(AGE_STORAGE_KEY) === "1" ? "verified" : "pending";
  } catch {
    // Stockage bloqué : on se fie à l'attribut posé dans la session courante.
    return document.documentElement.hasAttribute("data-age-ok") ? "verified" : "pending";
  }
};

const AgeGateContext = createContext<AgeGateValue | null>(null);

export function AgeGateProvider({ children }: { children: React.ReactNode }) {
  const status = useSyncExternalStore(subscribe, readStatus, () => "unknown" as const);
  const [justVerified, setJustVerified] = useState(false);

  const confirm = useCallback(() => {
    try {
      localStorage.setItem(AGE_STORAGE_KEY, "1");
    } catch {}
    document.documentElement.setAttribute("data-age-ok", "");
    setJustVerified(true);
    listeners.forEach((l) => l());
  }, []);

  return (
    <AgeGateContext.Provider value={{ status, justVerified, confirm }}>
      {children}
    </AgeGateContext.Provider>
  );
}

export function useAgeGate() {
  const ctx = useContext(AgeGateContext);
  if (!ctx) throw new Error("useAgeGate doit être utilisé dans <AgeGateProvider>");
  return ctx;
}
