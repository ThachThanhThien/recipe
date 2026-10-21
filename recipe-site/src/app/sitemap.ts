import type { MetadataRoute } from "next";
import { getRecipes } from "@/lib/api";
import { SITE_URL } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const recipes = await getRecipes();

  const now = new Date();
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, lastModified: now, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/recipes`, lastModified: now, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/cook`, lastModified: now, changeFrequency: "monthly", priority: 0.5 },
    { url: `${SITE_URL}/favorites`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/shopping-list`, lastModified: now, changeFrequency: "monthly", priority: 0.3 },
  ];

  const recipeRoutes: MetadataRoute.Sitemap = recipes.map((r) => {
    let lastMod = now;
    if (r.updatedAt) {
      const d = new Date(r.updatedAt);
      if (!isNaN(d.getTime())) {
        lastMod = d;
      }
    } else if (r.createdAt) {
      const d = new Date(r.createdAt);
      if (!isNaN(d.getTime())) {
        lastMod = d;
      }
    }
    return {
      url: `${SITE_URL}/recipes/${r.id}`,
      lastModified: lastMod,
      changeFrequency: "weekly",
      priority: r.isFeatured ? 0.9 : 0.7,
    };
  });

  return [...staticRoutes, ...recipeRoutes];
}
