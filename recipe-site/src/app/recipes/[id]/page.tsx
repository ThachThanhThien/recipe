import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Clock, Flame, Users, ChefHat, Star } from "lucide-react";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { RecipeImage } from "@/components/recipe-image";
import { IngredientList } from "@/components/ingredient-list";
import { InstructionSteps } from "@/components/instruction-steps";
import { RecipeCard } from "@/components/recipe-card";
import { FavoriteButton } from "@/components/favorite-button";
import { StartCookingButton } from "@/components/cooking-mode";
import { ReviewSection } from "@/components/review-section";
import { TrackView } from "@/components/track-view";
import { getRecipe, getRecipes, getReviews } from "@/lib/api";
import { pickLocale, splitInstructions } from "@/lib/i18n";
import { getLang } from "@/lib/lang-server";
import { t } from "@/lib/translations";
import { recipeJsonLd, SITE_URL } from "@/lib/seo";
import { resolveImageUrl } from "@/lib/image";
import { cn } from "@/lib/utils";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lang = await getLang();
  const recipe = await getRecipe(id, { lang });
  if (!recipe) return { title: t(lang, "detail.notFound") };
  const title = pickLocale(recipe.title, lang, t(lang, "detail.fallbackTitle"));
  const description = pickLocale(recipe.description, lang, t(lang, "detail.fallbackDesc"));
  const image = resolveImageUrl(recipe.image);
  const url = `${SITE_URL}/recipes/${recipe.id}`;
  return {
    title: `${title} | TastyFresh`,
    description,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title,
      description,
      url,
      siteName: "TastyFresh",
      images: image ? [{ url: image, alt: title }] : undefined,
    },
    twitter: {
      card: image ? "summary_large_image" : "summary",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

export default async function RecipeDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const lang = await getLang();
  const [recipe, reviewsRaw] = await Promise.all([
    getRecipe(id, { lang }),
    getReviews(id, { lang }),
  ]);
  if (!recipe) notFound();

  const title = pickLocale(recipe.title, lang, t(lang, "detail.fallbackTitle"));
  const description = pickLocale(recipe.description, lang);
  const steps = splitInstructions(recipe.instructions, lang);
  const reviews = reviewsRaw ?? [];

  let related: Awaited<ReturnType<typeof getRecipes>> = [];
  try {
    const all = await getRecipes({ lang });
    related = all
      .filter((r) => r.id !== recipe.id && (r.category === recipe.category || r.isFeatured))
      .slice(0, 3);
  } catch {
    related = [];
  }

  const difficulty = recipe.difficulty ?? "Easy";
  const difficultyLabel = t(lang, `difficulty.${difficulty}` as const);
  const jsonLd = recipeJsonLd(recipe);

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <TrackView id={recipe.id} />
      <Header lang={lang} />

      <main className="flex-grow pt-24 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="flex items-center justify-between mb-8">
            <Link
              href="/recipes"
              className="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors font-bold uppercase tracking-widest text-xs"
            >
              <ChevronLeft size={14} /> {t(lang, "detail.back")}
            </Link>
            <FavoriteButton recipeId={recipe.id} size="md" variant="inline" />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
            <div className="lg:col-span-7">
              <div className="relative aspect-[16/10] rounded-[2rem] overflow-hidden shadow-xl mb-10">
                <RecipeImage src={recipe.image} alt={title} seed={recipe.id} priority />
                <div className="absolute top-4 left-4 right-4 flex flex-wrap gap-2">
                  {recipe.isFeatured && (
                    <span className="bg-primary text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full shadow-md">
                      {t(lang, "detail.featured")}
                    </span>
                  )}
                  {recipe.isTrending && (
                    <span className="bg-accent text-white text-[10px] uppercase tracking-widest font-bold px-3 py-1.5 rounded-full shadow-md">
                      {t(lang, "detail.trending")}
                    </span>
                  )}
                  {recipe.category && (
                    <span className="glass text-foreground text-xs font-semibold px-3 py-1.5 rounded-full">
                      {recipe.category}
                    </span>
                  )}
                </div>
              </div>

              <div className="mb-8">
                <div className="flex items-center gap-2 text-primary font-bold uppercase tracking-widest text-xs mb-3">
                  <ChefHat size={16} /> {t(lang, "detail.kitchen")}
                </div>
                <h1 className="font-outfit text-4xl md:text-5xl lg:text-6xl font-black mb-5 leading-tight">{title}</h1>
                {description && (
                  <p className="text-lg text-muted-foreground leading-relaxed">{description}</p>
                )}

                {recipe.tags && recipe.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-5">
                    {recipe.tags.map((tag) => (
                      <span
                        key={tag}
                        className="bg-secondary/60 text-foreground/80 text-xs font-semibold px-3 py-1 rounded-full"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-card rounded-3xl border border-border/40 mb-12">
                <Stat icon={<Clock size={20} />} label={t(lang, "detail.prep")} value={recipe.prepTime || "—"} color="text-blue-500" />
                <Stat icon={<Clock size={20} />} label={t(lang, "detail.cook")} value={recipe.cookTime || "—"} color="text-orange-500" />
                <Stat icon={<Users size={20} />} label={t(lang, "detail.servings")} value={`${recipe.servings || 1}`} color="text-green-500" />
                <Stat
                  icon={<Flame size={20} />}
                  label={t(lang, "detail.calories")}
                  value={recipe.calories ? `${recipe.calories} kcal` : "—"}
                  color="text-red-500"
                />
              </div>

              <section className="mb-14">
                <div className="flex items-center gap-4 mb-6">
                  <h2 className="font-outfit text-3xl font-black">{t(lang, "detail.instructions")}</h2>
                  <div className="h-px flex-grow bg-border/40" />
                  <span className={cn(
                    "px-3 py-1 rounded-full text-xs font-bold",
                    difficulty === "Easy" && "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300",
                    difficulty === "Medium" && "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
                    difficulty === "Hard" && "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300",
                  )}>
                    {difficultyLabel}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground mb-6">
                  {t(lang, "detail.instructionsHelp")}
                </p>
                <InstructionSteps
                  steps={steps}
                  emptyText={t(lang, "detail.noInstructions")}
                  markStepAriaPrefix={t(lang, "detail.markStepComplete")}
                />
              </section>
            </div>

            <aside className="lg:col-span-5">
              <div className="lg:sticky lg:top-28 flex flex-col gap-6">
                <IngredientList recipe={recipe} />

                <StartCookingButton title={title} steps={steps} />

                <div className="bg-charcoal rounded-3xl p-6 text-white">
                  <h4 className="font-outfit font-bold mb-2">{t(lang, "detail.rating")}</h4>
                  <div className="flex items-center gap-1 text-yellow-400 mb-1">
                    {[1, 2, 3, 4, 5].map((s) => (
                      <Star
                        key={s}
                        size={16}
                        className={cn(
                          "transition-colors",
                          s <= Math.round(recipe.rating) ? "fill-yellow-400 text-yellow-400" : "text-white/20",
                        )}
                      />
                    ))}
                    <span className="text-white font-bold ml-2 text-base">
                      {recipe.rating ? recipe.rating.toFixed(1) : "—"}
                    </span>
                    <span className="text-white/40 text-sm ml-1">
                      ({recipe.reviews} {recipe.reviews === 1 ? t(lang, "detail.review") : t(lang, "detail.reviews")})
                    </span>
                  </div>
                  <a href="#reviews-heading" className="text-xs uppercase tracking-widest font-bold text-primary hover:text-white transition-colors">
                    {t(lang, "detail.readReviews")}
                  </a>
                </div>
              </div>
            </aside>
          </div>

          <ReviewSection recipeId={recipe.id} initialReviews={reviews} />

          {related.length > 0 && (
            <section className="mt-20">
              <div className="flex items-center gap-3 mb-8">
                <h2 className="font-outfit text-3xl font-black">{t(lang, "detail.related")}</h2>
                <div className="h-px flex-grow bg-border/40" />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {related.map((r, i) => (
                  <RecipeCard key={r.id} recipe={r} index={i} />
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

function Stat({
  icon,
  label,
  value,
  color,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  color: string;
}) {
  return (
    <div className="flex flex-col items-center justify-center p-3 rounded-2xl bg-secondary/30">
      <span className={cn("mb-2", color)} aria-hidden>
        {icon}
      </span>
      <span className="text-[10px] uppercase font-bold tracking-widest text-muted-foreground">{label}</span>
      <span className="text-base font-black mt-0.5 text-center">{value}</span>
    </div>
  );
}
