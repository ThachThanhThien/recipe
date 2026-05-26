export type Multilingual = { [key: string]: string };

export const DEFAULT_LANG = process.env.NEXT_PUBLIC_DEFAULT_LANG ?? "en";

export function isMultilingual(value: unknown): value is Multilingual {
  if (!value || typeof value !== "object" || Array.isArray(value)) return false;
  const entries = Object.entries(value as Record<string, unknown>);
  if (entries.length === 0) return false;
  return entries.every(([k, v]) => typeof k === "string" && k.length >= 2 && k.length <= 5 && typeof v === "string");
}

export function pickLocale(value: Multilingual | string | null | undefined, lang: string = DEFAULT_LANG, fallback = ""): string {
  if (value == null) return fallback;
  if (typeof value === "string") return value;
  if (isMultilingual(value)) {
    return value[lang] || value[DEFAULT_LANG] || Object.values(value)[0] || fallback;
  }
  return fallback;
}

export function splitInstructions(value: Multilingual | string | null | undefined, lang?: string): string[] {
  const text = pickLocale(value, lang);
  if (!text) return [];

  // Prefer explicit line breaks when the author provided them — they always win
  // over heuristic sentence-splitting. Fall back to sentence-splitting only for
  // single-paragraph instructions with no line breaks.
  const hasLineBreaks = /\r?\n/.test(text);
  const parts = hasLineBreaks
    ? text.split(/\r?\n+/)
    : text.split(/(?<=\.)\s+(?=[A-Z0-9])/);

  return parts
    .map((s) => s.trim())
    // Strip leading step markers like "1.", "2)", "10 -", "Step 3:" — the UI
    // renders its own numbered badge for each step, so these prefixes would
    // appear duplicated.
    .map((s) => s.replace(/^(?:step\s*)?\d+\s*[.):\-]\s*/i, ""))
    .filter(Boolean);
}
