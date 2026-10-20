/**
 * Lower-cases, strips Vietnamese/Latin accents and turns punctuation into spaces,
 * so "pho" matches "Phở" and "ga" matches "(Gà)" — nobody types tone marks while cooking.
 */
export function normalizeText(text: string): string {
  return text
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, " ")
    .trim();
}

function words(query: string): string[] {
  return normalizeText(query).split(" ").filter(Boolean);
}

/** Every query word starts a word somewhere in the (normalized) text. */
function hasAllWords(text: string, terms: string[]): boolean {
  const padded = ` ${text}`;
  return terms.every((term) => padded.includes(` ${term}`));
}

/**
 * How well a recipe matches: 3 = title contains the whole phrase, 2 = title has every
 * word, 1 = found elsewhere (description, tags, ingredients), 0 = no match.
 * `title` and `haystack` must already be normalized.
 */
export function searchScore(title: string, haystack: string, query: string): number {
  const terms = words(query);
  if (terms.length === 0) return 1;
  if (` ${title} `.includes(` ${terms.join(" ")}`)) return 3;
  if (hasAllWords(title, terms)) return 2;
  return hasAllWords(haystack, terms) ? 1 : 0;
}
