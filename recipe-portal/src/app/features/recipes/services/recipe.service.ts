import { Injectable } from '@angular/core';
import { ApiBaseService } from '../../../core/services/api-base.service';
import { RecipeModel } from '../models/recipe.model';

@Injectable({
  providedIn: 'root',
})
export class RecipeService extends ApiBaseService {
  getAll() {
    return this.http.get<RecipeModel[]>(this.buildUrl('recipe'));
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
