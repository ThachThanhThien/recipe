import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronLeft, Clock, Flame, Star, Timer, Users, type LucideIcon } from "lucide-react";
import { RecipeImage } from "@/components/recipe-image";
import { RecipeGrid } from "@/components/recipe-card";
import { FavoriteButton } from "@/components/favorite-button";
import { StartCookingButton } from "@/components/cooking-mode";
import { RecipeSession } from "@/components/recipe-session";
import { RecipeBody } from "@/components/recipe-body";
import { TrackView } from "@/components/track-view";
import { Container, SectionHeader } from "@/components/ui";
import { getRecipe, getRecipeSummaries } from "@/lib/api";
import { pickLocale, splitInstructions } from "@/lib/i18n";
import { toLang, type Lang } from "@/lib/lang";
import { t } from "@/lib/translations";
import { formatMinutes, parseMinutes } from "@/lib/time";
import { recipeJsonLd, SITE_URL } from "@/lib/seo";
import { resolveImageUrl } from "@/lib/image";

type DetailParams = { params: Promise<{ lang: string; id: string }> };

// Every active recipe is pre-rendered. Unknown ids render on demand and land on
// this segment's not-found page.
export async function generateStaticParams() {
  const recipes = await getRecipeSummaries();
  return recipes.map((r) => ({ id: String(r.id) }));
}

export async function generateMetadata({ params }: DetailParams) {
  const { id, lang: rawLang } = await params;
  const lang = toLang(rawLang);
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

export default async function RecipeDetailPage({ params }: DetailParams) {
  const { id, lang: rawLang } = await params;
  const lang = toLang(rawLang);
  const recipe = await getRecipe(id, { lang });
  if (!recipe) notFound();

  const title = pickLocale(recipe.title, lang, t(lang, "detail.fallbackTitle"));
  const description = pickLocale(recipe.description, lang);
  const steps = splitInstructions(recipe.instructions, lang);
  const ingredients = recipe.recipeIngredients.map((ri) => ({
    id: ri.id,
    name: pickLocale(ri.ingredient.name, lang),
    quantity: ri.quantity ?? "",
    unit: ri.ingredient.unit ?? "",
  }));

  const related = (await getRecipeSummaries({ lang }))
    .filter((r) => r.id !== recipe.id && r.category === recipe.category)
    .slice(0, 4);

  return (
    <RecipeSession
      recipeId={recipe.id}
      title={title}
      baseServings={recipe.servings}
      ingredients={ingredients}
      steps={steps}
    >
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(recipeJsonLd(recipe)) }}
      />
      <TrackView id={recipe.id} />

      <Container className="pt-2 sm:pt-6">
        <div className="flex items-center justify-between gap-3 py-2">
          <Link
            href="/recipes"
            className="-ml-2 inline-flex h-11 items-center gap-1 rounded-xl px-2 text-sm font-medium text-muted-foreground hover:bg-muted hover:text-foreground"
          >
            <ChevronLeft size={18} aria-hidden />
            {t(lang, "detail.back")}
          </Link>
          <FavoriteButton recipeId={recipe.id} variant="pill" />
        </div>

        <div className="mt-2 grid items-start gap-6 lg:grid-cols-2 lg:gap-10">
          <div className="relative aspect-[16/10] overflow-hidden rounded-2xl bg-muted lg:aspect-[4/3]">
            <RecipeImage
              src={recipe.image}
              alt={title}
              seed={recipe.id}
              priority
              sizes="(max-width: 1024px) 100vw, 560px"
            />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-sm">
              {recipe.category && <span className="font-medium text-primary">{recipe.category}</span>}
              {recipe.difficulty && (
                <>
                  {recipe.category && <span aria-hidden className="text-muted-foreground">·</span>}
                  <span className="text-muted-foreground">{t(lang, `difficulty.${recipe.difficulty}`)}</span>
                </>
              )}
              {recipe.rating > 0 && (
                <>
                  <span aria-hidden className="text-muted-foreground">·</span>
                  <span className="inline-flex items-center gap-1 text-muted-foreground">
                    <Star size={14} className="fill-amber-400 text-amber-400" aria-hidden />
                    <span className="sr-only">{t(lang, "detail.rating")}:</span>
                    {recipe.rating.toFixed(1)}
                  </span>
                </>
              )}
            </div>
            <h1 className="mt-1.5 text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">{title}</h1>
            {description && <p className="mt-3 leading-relaxed text-muted-foreground">{description}</p>}

            <dl className="mt-5 grid grid-cols-4 divide-x divide-border rounded-2xl border border-border bg-card py-3">
              <Stat icon={Clock} label={t(lang, "detail.prep")} {...timeStat(recipe.prepTime, lang)} />
              <Stat icon={Timer} label={t(lang, "detail.cook")} {...timeStat(recipe.cookTime, lang)} />
              <Stat icon={Users} label={t(lang, "detail.servings")} value={String(recipe.servings || 1)} />
              <Stat icon={Flame} label={t(lang, "detail.calories")} value={recipe.calories ? String(recipe.calories) : "—"} />
            </dl>

            <StartCookingButton className="mt-5" />

            {recipe.tags && recipe.tags.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-2" aria-label={t(lang, "detail.tags")}>
                {recipe.tags.map((tag) => (
                  <li key={tag}>
                    <Link
                      href={`/recipes?q=${encodeURIComponent(tag)}`}
                      className="inline-flex h-8 items-center rounded-full bg-muted px-3 text-xs font-medium text-muted-foreground hover:text-foreground"
                    >
                      #{tag}
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        <RecipeBody />

        {related.length > 0 && (
          <section className="mt-14">
            <SectionHeader
              title={t(lang, "detail.related")}
              href={recipe.category ? `/recipes?category=${encodeURIComponent(recipe.category)}` : "/recipes"}
              linkLabel={t(lang, "home.seeAll")}
            />
            <RecipeGrid recipes={related} />
          </section>
        )}
      </Container>
    </RecipeSession>
  );
}

/** "2 h 30 min" plus any note the author added, e.g. "(marinade)". */
function timeStat(text: string | null, lang: Lang): { value: string; note?: string } {
  if (!text) return { value: "—" };
  const formatted = formatMinutes(parseMinutes(text), lang);
  if (!formatted) return { value: parseMinutes(text) === 0 ? "0" : text };
  return { value: formatted, note: text.match(/\(([^)]+)\)/)?.[1] };
}

function Stat({ icon: Icon, label, value, note }: { icon: LucideIcon; label: string; value: string; note?: string }) {
  return (
    <div className="flex flex-col items-center gap-0.5 px-1 text-center">
      <Icon size={18} className="mb-1 text-muted-foreground" aria-hidden />
      {/* Label first for screen readers, shown under the value. */}
      <dt className="order-last text-xs text-muted-foreground">{label}</dt>
      <dd className="text-sm font-semibold leading-tight">{value}</dd>
      {note && <dd className="text-[11px] leading-tight text-muted-foreground">({note})</dd>}
    </div>
  );
}
