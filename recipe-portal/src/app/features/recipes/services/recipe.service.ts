import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ApiBaseService } from '../../../core/services/api-base.service';
import { RecipeModel } from '../models/recipe.model';

export interface Paginated<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface RecipeListQuery {
  q?: string;
  category?: string;
  difficulty?: 'Easy' | 'Medium' | 'Hard';
  tag?: string;
  featured?: boolean;
  trending?: boolean;
  includeInactive?: boolean;
  sort?: 'newest' | 'oldest' | 'rating' | 'popular' | 'fastest' | 'title';
  page?: number;
  limit?: number;
}

@Injectable({
  providedIn: 'root',
})
export class RecipeService extends ApiBaseService {
  /** Backward-compatible: returns just the items array (uses a high limit). */
  getAll(): Observable<RecipeModel[]> {
    return this.getPage({ includeInactive: true, limit: 100 }).pipe(map((p) => p.items));
  }

  /** Full paginated/filtered response — preferred for tables with search & paging. */
  getPage(query: RecipeListQuery = {}): Observable<Paginated<RecipeModel>> {
    const params: Record<string, string> = {};
    for (const [k, v] of Object.entries(query)) {
      if (v !== undefined && v !== null && v !== '') params[k] = String(v);
    }
    return this.http.get<Paginated<RecipeModel>>(this.buildUrl('recipe'), { params });
  }

  getById(id: number) {
    return this.http.get<RecipeModel>(this.buildUrl(`recipe/${id}`));
  }

  create(payload: any) {
    return this.http.post<RecipeModel>(this.buildUrl('recipe'), payload);
  }

  update(id: number, payload: any) {
    return this.http.put<RecipeModel>(this.buildUrl(`recipe/${id}`), payload);
  }

  toggleActive(id: number, isActive: boolean) {
    return this.http.patch<RecipeModel>(this.buildUrl(`recipe/${id}/active`), { isActive });
  }

  delete(id: number) {
    return this.http.delete(this.buildUrl(`recipe/${id}`));
  }
}
