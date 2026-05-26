import { Suspense } from "react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { RecipeBrowser } from "@/components/recipe-browser";
import { RecipeGridSkeleton } from "@/components/recipe-card-skeleton";
import { EmptyState } from "@/components/empty-state";
import { getRecipes } from "@/lib/api";
import { getLang } from "@/lib/lang-server";
import { t } from "@/lib/translations";

export const metadata = {
  title: "All Recipes | TastyFresh",
  description: "Browse our full collection of hand-crafted recipes — filter by category, difficulty, or time.",
};

export default async function RecipesPage() {
  const lang = await getLang();
  let recipes: Awaited<ReturnType<typeof getRecipes>> = [];
  let apiError = false;

  try {
    recipes = await getRecipes({ lang });
  } catch {
    apiError = true;
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header lang={lang} />

      <main className="flex-grow pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <header className="mb-10 text-center max-w-2xl mx-auto">
            <h1 className="font-outfit text-4xl md:text-5xl font-black mb-4">
              {t(lang, "recipes.title1")}{" "}
              <span className="text-primary italic">{t(lang, "recipes.title2")}</span>
            </h1>
            <p className="text-muted-foreground text-base md:text-lg">
              {t(lang, "recipes.subtitle")}
            </p>
          </header>

          {apiError ? (
            <EmptyState
              icon="🔌"
              title={t(lang, "recipes.apiUnavailableTitle")}
              description={t(lang, "recipes.apiUnavailableDesc")}
            />
          ) : recipes.length === 0 ? (
            <EmptyState
              icon="🍳"
              title={t(lang, "home.noRecipesTitle")}
              description={t(lang, "recipes.emptyDesc")}
            />
          ) : (
            <Suspense fallback={<RecipeGridSkeleton />}>
              <RecipeBrowser recipes={recipes} />
            </Suspense>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
