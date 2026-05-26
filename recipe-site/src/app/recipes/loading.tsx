import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { RecipeGridSkeleton } from "@/components/recipe-card-skeleton";
import { getLang } from "@/lib/lang-server";

export default async function Loading() {
  const lang = await getLang();
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header lang={lang} />
      <main className="flex-grow pt-28 pb-20 px-4 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <header className="mb-10 text-center max-w-2xl mx-auto">
            <div className="h-12 w-2/3 bg-secondary/60 rounded mx-auto animate-pulse mb-3" />
            <div className="h-4 w-1/2 bg-secondary/40 rounded mx-auto animate-pulse" />
          </header>
          <div className="h-16 bg-secondary/40 rounded-3xl mb-8 animate-pulse" />
          <RecipeGridSkeleton count={9} />
        </div>
      </main>
      <Footer />
    </div>
  );
}
