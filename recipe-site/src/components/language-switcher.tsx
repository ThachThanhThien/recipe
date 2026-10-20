"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { useT } from "@/components/lang-provider";
import { LANG_COOKIE, LANG_LABELS, SUPPORTED_LANGS, type Lang } from "@/lib/lang";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;
const LANG_PREFIX = new RegExp(`^/(${SUPPORTED_LANGS.join("|")})(?=/|$)`);

/**
 * Each language is a separate pre-rendered page. Store the choice in the cookie
 * that next.config.ts rewrites on, then reload the clean (unprefixed) URL.
 */
function reloadInLanguage(next: Lang) {
  document.cookie = `${LANG_COOKIE}=${next}; path=/; max-age=${ONE_YEAR_SECONDS}; samesite=lax`;
  const path = window.location.pathname.replace(LANG_PREFIX, "") || "/";
  window.location.assign(path + window.location.search + window.location.hash);
}

export function LanguageSwitcher({ current }: { current: Lang }) {
  const t = useT();
  const [pending, setPending] = useState(false);

  const switchTo = (next: Lang) => {
    if (next === current || pending) return;
    setPending(true);
    reloadInLanguage(next);
  };

  return (
    <div role="group" aria-label={t("nav.language")} className="flex h-11 items-center rounded-xl bg-muted p-1">
      {SUPPORTED_LANGS.map((code) => {
        const active = code === current;
        return (
          <button
            key={code}
            type="button"
            lang={code}
            onClick={() => switchTo(code)}
            disabled={pending}
            aria-pressed={active}
            aria-label={LANG_LABELS[code].native}
            className={cn(
              "h-9 min-w-11 rounded-lg px-2 text-xs font-semibold transition-colors",
              active ? "bg-card text-foreground shadow-card" : "text-muted-foreground hover:text-foreground",
              pending && !active && "opacity-50",
            )}
          >
            {LANG_LABELS[code].short}
          </button>
        );
      })}
    </div>
  );
}
