import type { Lang } from "./lang";
import { t } from "./translations";

const UNIT = /(\d+(?:[.,]\d+)?)\s*(hours?|hrs?|h|giờ|minutes?|mins?|m|phút)(?![a-z])/gi;

/**
 * Minutes in a free-text duration such as "1 hr 30 mins", "6 hrs (soak) + 10 mins"
 * or "40 mins (+ 4 hrs chill)" — every amount is added up. Null when nothing parses.
 */
export function parseMinutes(text: string | null | undefined): number | null {
  if (!text) return null;
  let total = 0;
  let found = false;
  for (const [, amount, unit] of text.matchAll(UNIT)) {
    const value = parseFloat(amount.replace(",", "."));
    total += /^(h|giờ)/i.test(unit) ? value * 60 : value;
    found = true;
  }
  return found ? Math.round(total) : null;
}

/** Prep + cook time in minutes, or null when neither can be read. */
export function totalMinutes(prepTime: string | null, cookTime: string | null): number | null {
  const prep = parseMinutes(prepTime);
  const cook = parseMinutes(cookTime);
  if (prep === null && cook === null) return null;
  return (prep ?? 0) + (cook ?? 0);
}

/** "1 h 30 min" / "1 giờ 30 phút". Null for unknown or zero durations. */
export function formatMinutes(minutes: number | null, lang: Lang): string | null {
  if (!minutes) return null;
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  const parts = [];
  if (h) parts.push(`${h} ${t(lang, "time.h")}`);
  if (m) parts.push(`${m} ${t(lang, "time.min")}`);
  return parts.join(" ");
}
