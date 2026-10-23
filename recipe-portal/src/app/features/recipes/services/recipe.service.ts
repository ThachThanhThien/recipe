import { Injectable, inject } from '@angular/core';
import { Observable, map, switchMap } from 'rxjs';
import { GithubStore, findById, localize, nextId } from '../../../core/services/github-store.service';
import { LanguageService } from '../../../core/services/language.service';
import { RecipeModel } from '../models/recipe.model';

/** A recipe as stored in recipe-site/data/recipes.json (key order kept stable for clean diffs). */
type StoredRecipe = Omit<RecipeModel, 'tips' | 'image' | 'prepTime' | 'cookTime' | 'difficulty' | 'category'> & {
  tips: Record<string, string> | null;
  image: string | null;
  prepTime: string | null;
  cookTime: string | null;
  difficulty: RecipeModel['difficulty'] | null;
  category: string | null;
  createdAt: string;
  updatedAt: string;
};

@Injectable({
  providedIn: 'root',
})
export class RecipeService {
  private store = inject(GithubStore);
  private languageService = inject(LanguageService);

  /** All recipes (active and inactive), newest first, with text in the portal's current language. */
  getAll(): Observable<RecipeModel[]> {
    const lang = this.languageService.getLanguage();
    return this.store.read<StoredRecipe>('recipes').pipe(
      map((recipes) =>
        recipes
          .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
          .map((r) => ({
            ...(r as unknown as RecipeModel),
            title: localize(r.title, lang),
            description: localize(r.description, lang),
          })),
      ),
    );
  }

  /** One recipe exactly as stored — every language — for the edit form. */
  getById(id: number): Observable<RecipeModel> {
    return this.store
      .read<StoredRecipe>('recipes')
      .pipe(map((recipes) => findById(recipes, id, 'Recipe') as unknown as RecipeModel));
  }

  create(payload: any) {
    return this.checkIngredients(payload).pipe(
      switchMap(() =>
        this.store.write<StoredRecipe>(
          'recipes',
          (recipes) => {
            const now = new Date().toISOString();
            return [...recipes, toStored(payload, nextId(recipes), now, now)];
          },
          `Add recipe: ${localize(payload.title, 'en')}`,
        ),
      ),
    );
  }

  update(id: number, payload: any) {
    return this.checkIngredients(payload).pipe(
      switchMap(() =>
        this.store.write<StoredRecipe>(
          'recipes',
          (recipes) => {
            const existing = findById(recipes, id, 'Recipe');
            const updated = toStored(payload, existing.id, existing.createdAt, new Date().toISOString());
            return recipes.map((r) => (r.id === existing.id ? updated : r));
          },
          `Update recipe: ${localize(payload.title, 'en')}`,
        ),
      ),
    );
  }

  toggleActive(id: number, isActive: boolean) {
    return this.store.write<StoredRecipe>(
      'recipes',
      (recipes) => {
        findById(recipes, id, 'Recipe');
        const now = new Date().toISOString();
        return recipes.map((r) => (r.id === Number(id) ? { ...r, isActive, updatedAt: now } : r));
      },
      `${isActive ? 'Show' : 'Hide'} recipe #${id}`,
    );
  }

  delete(id: number) {
    return this.store.write<StoredRecipe>(
      'recipes',
      (recipes) => {
        findById(recipes, id, 'Recipe');
        return recipes.filter((r) => r.id !== Number(id));
      },
      `Delete recipe #${id}`,
    );
  }

  private checkIngredients(payload: any): Observable<void> {
    const wanted: number[] = (payload.ingredients ?? []).map((i: any) => Number(i.ingredientId));
    return this.store.read<{ id: number }>('ingredients').pipe(
      map((ingredients) => {
        const known = new Set(ingredients.map((i) => i.id));
        if (wanted.some((id) => !known.has(id))) {
          throw new Error('One or more ingredient IDs are invalid');
        }
      }),
    );
  }
}

function toStored(p: any, id: number, createdAt: string, updatedAt: string): StoredRecipe {
  return {
    id,
    title: p.title,
    description: p.description ?? null,
    instructions: p.instructions ?? null,
    tips: hasText(p.tips) ? p.tips : null,
    image: p.image || null,
    prepTime: p.prepTime || null,
    cookTime: p.cookTime || null,
    servings: p.servings ?? 1,
    calories: p.calories ?? 0,
    difficulty: p.difficulty || null,
    category: p.category || null,
    tags: p.tags ?? [],
    rating: p.rating ?? 0,
    reviews: p.reviews ?? 0,
    isFeatured: !!p.isFeatured,
    isTrending: !!p.isTrending,
    isActive: p.isActive ?? true,
    ingredients: (p.ingredients ?? []).map((i: any) => ({
      ingredientId: Number(i.ingredientId),
      quantity: String(i.quantity ?? ''),
    })),
    createdAt,
    updatedAt,
  };
}

/** True when any language of a `{ en, vi }` value has text. */
function hasText(value: unknown): boolean {
  return !!value && typeof value === 'object' && Object.values(value).some((v) => String(v ?? '').trim());
}
