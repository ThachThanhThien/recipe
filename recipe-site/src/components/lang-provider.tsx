"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";
import { DEFAULT_LANG, type Lang } from "@/lib/lang";
import { translator } from "@/lib/translations";

const LangContext = createContext<Lang>(DEFAULT_LANG);

/** Makes the page's language (from the `[lang]` segment) available to client components. */
export function LangProvider({ lang, children }: { lang: Lang; children: ReactNode }) {
  return <LangContext value={lang}>{children}</LangContext>;
}

export function useLang(): Lang {
  return useContext(LangContext);
}

export function useT() {
  const lang = useLang();
  return useMemo(() => translator(lang), [lang]);
}
