// Server Components only — `next/headers` itself enforces the boundary by
// throwing if imported from a client module.
import { cookies } from "next/headers";
import { DEFAULT_LANG, isLang, LANG_COOKIE, type Lang } from "./lang";

/**
 * Read the active language for the current request from a cookie.
 * Server Components only — pulls in `next/headers`, which is not available
 * to client code. Calling this opts the route into dynamic rendering, which
 * is correct: every request can render in a different language.
 */
export async function getLang(): Promise<Lang> {
  const store = await cookies();
  const value = store.get(LANG_COOKIE)?.value;
  return isLang(value) ? value : DEFAULT_LANG;
}
