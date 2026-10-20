import { Injectable, inject } from '@angular/core';
import { Observable, map } from 'rxjs';
import { GithubStore, findById, localize, nextId } from '../../../core/services/github-store.service';
import { LanguageService } from '../../../core/services/language.service';
import { IngredientTypeModel } from '../models/ingredient-type.model';

/** An ingredient type as stored in recipe-site/data/ingredient-types.json. */
interface StoredIngredientType {
  id: number;
  name: any;
  description: any;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class IngredientTypeService {
  private store = inject(GithubStore);
  private languageService = inject(LanguageService);

  /** All ingredient types, text in the portal's current language. */
  getAll(): Observable<IngredientTypeModel[]> {
    const lang = this.languageService.getLanguage();
    return this.store.read<StoredIngredientType>('ingredient-types').pipe(
      map((types) =>
        types.map((t) => ({ ...t, name: localize(t.name, lang), description: localize(t.description, lang) })),
      ),
    );
  }

  /** One type exactly as stored — every language — for the edit form. */
  getById(id: number): Observable<IngredientTypeModel> {
    return this.store
      .read<StoredIngredientType>('ingredient-types')
      .pipe(map((types) => findById(types, id, 'Ingredient type')));
  }

  create(payload: IngredientTypeModel) {
    return this.store.write<StoredIngredientType>(
      'ingredient-types',
      (types) => [...types, toStored(payload, nextId(types))],
      `Add ingredient type: ${localize(payload.name, 'en')}`,
    );
  }

  update(id: number, payload: IngredientTypeModel) {
    return this.store.write<StoredIngredientType>(
      'ingredient-types',
      (types) => {
        const existing = findById(types, id, 'Ingredient type');
        return types.map((t) => (t.id === existing.id ? toStored(payload, existing.id) : t));
      },
      `Update ingredient type: ${localize(payload.name, 'en')}`,
    );
  }

  toggleActive(id: number, isActive: boolean) {
    return this.store.write<StoredIngredientType>(
      'ingredient-types',
      (types) => {
        findById(types, id, 'Ingredient type');
        return types.map((t) => (t.id === Number(id) ? { ...t, isActive } : t));
      },
      `${isActive ? 'Activate' : 'Deactivate'} ingredient type #${id}`,
    );
  }

  delete(id: number) {
    return this.store.write<StoredIngredientType>(
      'ingredient-types',
      (types) => {
        findById(types, id, 'Ingredient type');
        return types.filter((t) => t.id !== Number(id));
      },
      `Delete ingredient type #${id}`,
    );
  }
}

function toStored(p: IngredientTypeModel, id: number): StoredIngredientType {
  return {
    id,
    name: p.name,
    description: p.description ?? null,
    isActive: p.isActive ?? true,
  };
}
