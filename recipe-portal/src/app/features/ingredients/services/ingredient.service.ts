import { Injectable, inject } from '@angular/core';
import { Observable, forkJoin, map, switchMap } from 'rxjs';
import { GithubStore, findById, localize, nextId } from '../../../core/services/github-store.service';
import { LanguageService } from '../../../core/services/language.service';
import { IngredientModel } from '../models/ingredient.model';

/** An ingredient as stored in recipe-site/data/ingredients.json. */
interface StoredIngredient {
  id: number;
  name: any;
  description: any;
  unit: string | null;
  typeIds: number[];
  isActive: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class IngredientService {
  private store = inject(GithubStore);
  private languageService = inject(LanguageService);

  /** All ingredients with their types, text in the portal's current language. */
  getAll(): Observable<IngredientModel[]> {
    const lang = this.languageService.getLanguage();
    return forkJoin([
      this.store.read<StoredIngredient>('ingredients'),
      this.store.read<{ id: number; name: any }>('ingredient-types'),
    ]).pipe(
      map(([ingredients, types]) => {
        const typesById = new Map(types.map((t) => [t.id, t]));
        return ingredients.map((i) => ({
          ...i,
          unit: i.unit ?? '',
          name: localize(i.name, lang),
          description: localize(i.description, lang),
          types: i.typeIds
            .filter((id) => typesById.has(id))
            .map((id) => ({ id, name: localize(typesById.get(id)!.name, lang) })),
        }));
      }),
    );
  }

  /** One ingredient exactly as stored — every language — for the edit form. */
  getById(id: number): Observable<IngredientModel> {
    return this.store
      .read<StoredIngredient>('ingredients')
      .pipe(map((ingredients) => findById(ingredients, id, 'Ingredient') as unknown as IngredientModel));
  }

  create(payload: IngredientModel) {
    return this.checkTypes(payload).pipe(
      switchMap(() =>
        this.store.write<StoredIngredient>(
          'ingredients',
          (ingredients) => [...ingredients, toStored(payload, nextId(ingredients))],
          `Add ingredient: ${localize(payload.name, 'en')}`,
        ),
      ),
    );
  }

  update(id: number, payload: IngredientModel) {
    return this.checkTypes(payload).pipe(
      switchMap(() =>
        this.store.write<StoredIngredient>(
          'ingredients',
          (ingredients) => {
            const existing = findById(ingredients, id, 'Ingredient');
            return ingredients.map((i) => (i.id === existing.id ? toStored(payload, existing.id) : i));
          },
          `Update ingredient: ${localize(payload.name, 'en')}`,
        ),
      ),
    );
  }

  toggleActive(id: number, isActive: boolean) {
    return this.store.write<StoredIngredient>(
      'ingredients',
      (ingredients) => {
        findById(ingredients, id, 'Ingredient');
        return ingredients.map((i) => (i.id === Number(id) ? { ...i, isActive } : i));
      },
      `${isActive ? 'Activate' : 'Deactivate'} ingredient #${id}`,
    );
  }

  delete(id: number) {
    return this.store.write<StoredIngredient>(
      'ingredients',
      (ingredients) => {
        findById(ingredients, id, 'Ingredient');
        return ingredients.filter((i) => i.id !== Number(id));
      },
      `Delete ingredient #${id}`,
    );
  }

  private checkTypes(payload: IngredientModel): Observable<void> {
    const wanted = (payload.typeIds ?? []).map(Number);
    return this.store.read<{ id: number }>('ingredient-types').pipe(
      map((types) => {
        const known = new Set(types.map((t) => t.id));
        if (wanted.some((id) => !known.has(id))) {
          throw new Error('One or more ingredient type IDs are invalid');
        }
      }),
    );
  }
}

function toStored(p: IngredientModel, id: number): StoredIngredient {
  return {
    id,
    name: p.name,
    description: p.description ?? null,
    unit: p.unit || null,
    typeIds: (p.typeIds ?? []).map(Number).sort((a, b) => a - b),
    isActive: p.isActive ?? true,
  };
}
