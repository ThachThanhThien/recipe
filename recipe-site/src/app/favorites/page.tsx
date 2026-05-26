import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { FavoritesGrid } from "@/components/favorites-grid";
import { EmptyState } from "@/components/empty-state";
import { getRecipes } from "@/lib/api";
import { getLang } from "@/lib/lang-server";
import { t } from "@/lib/translations";

export const metadata = {
  title: "Your favorites | TastyFresh",
  description: "Recipes you've saved for later.",
};

export default async function FavoritesPage() {
  const lang = await getLang();
  let recipes: Awaited<ReturnType<typeof getRecipes>> = [];
  let apiError = false;

  try {
    recipes = await getRecipes({ lang });
  } catch {
    apiError = true;
  }

  const favoritesLabel = t(lang, "nav.favorites").toLowerCase();

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header lang={lang} />
      <main className="flex-grow pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <header className="mb-10 text-center max-w-2xl mx-auto">
            <h1 className="font-outfit text-4xl md:text-5xl font-black mb-3">
              {lang === "vi" ? (
                <>
                  {t(lang, "nav.favorites")} <span className="text-primary italic">của bạn</span>
                </>
              ) : (
                <>
                  Your <span className="text-primary italic">{favoritesLabel}</span>
                </>
              )}
            </h1>
            <p className="text-muted-foreground">
              {lang === "vi"
                ? "Đã lưu trên thiết bị này — không cần tài khoản."
                : "Saved on this device — no account needed."}
            </p>
          </header>
          {apiError ? (
            <EmptyState
              icon="🔌"
              title={t(lang, "recipes.apiUnavailableTitle")}
              description={
                lang === "vi"
                  ? "Không thể kết nối API để tải công thức đã lưu."
                  : "We couldn't reach the recipe API to load your saved recipes."
              }
            />
          ) : (
            <FavoritesGrid allRecipes={recipes} />
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
