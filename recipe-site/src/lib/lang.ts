// Pure language constants, types and labels.
// IMPORTANT: do NOT import `next/headers` (or any server-only API) in this file —
// it is imported by client components like <LanguageSwitcher />.

export const SUPPORTED_LANGS = ["en", "vi"] as const;
export type Lang = (typeof SUPPORTED_LANGS)[number];

export const DEFAULT_LANG: Lang = "en";
export const LANG_COOKIE = "lang";

export function isLang(value: string | undefined | null): value is Lang {
  return !!value && (SUPPORTED_LANGS as readonly string[]).includes(value);
}

export function toLang(value: string | undefined | null): Lang {
  return isLang(value) ? value : DEFAULT_LANG;
}

/**
 * Every page lives under `app/[lang]/` and is pre-rendered once per language.
 * Visitors keep clean URLs (`/recipes/12`): next.config.ts rewrites them to
 * `/vi/...` or `/en/...` based on the `lang` cookie.
 */
export type LangParams = { params: Promise<{ lang: string }> };

export const LANG_LABELS: Record<Lang, { native: string; short: string }> = {
  en: { native: "English", short: "EN" },
  vi: { native: "Tiếng Việt", short: "VI" },
};
