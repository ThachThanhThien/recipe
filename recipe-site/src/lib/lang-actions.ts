"use server";

import { cookies } from "next/headers";
import { revalidatePath } from "next/cache";
import { DEFAULT_LANG, isLang, LANG_COOKIE, type Lang } from "./lang";

const ONE_YEAR_SECONDS = 60 * 60 * 24 * 365;

/**
 * Switch the active language and revalidate the calling path so server
 * components re-render with the new locale on the next navigation/refresh.
 */
export async function setLangAction(next: string, currentPath: string): Promise<Lang> {
  const resolved: Lang = isLang(next) ? next : DEFAULT_LANG;
  const store = await cookies();
  store.set({
    name: LANG_COOKIE,
    value: resolved,
    path: "/",
    sameSite: "lax",
    maxAge: ONE_YEAR_SECONDS,
    httpOnly: false,
  });
  // Invalidate the page the user is on so it re-fetches in the new language.
  if (currentPath) {
    revalidatePath(currentPath);
  } else {
    revalidatePath("/", "layout");
  }
  return resolved;
}
