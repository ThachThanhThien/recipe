import { Injectable } from '@angular/core';
import { ApiBaseService } from '../../../core/services/api-base.service';
import { IngredientModel } from '../models/ingredient.model';

@Injectable({
  providedIn: 'root',
})
export class IngredientService extends ApiBaseService {
  getAll() {
    return this.http.get<IngredientModel[]>(this.buildUrl('ingredient'));
  }

  getById(id: number) {
    return this.http.get<IngredientModel>(this.buildUrl(`ingredient/${id}`));
  }

  create(payload: IngredientModel) {
    return this.http.post<IngredientModel>(this.buildUrl('ingredient'), payload);
  }

  update(id: number, payload: IngredientModel) {
    return this.http.put<IngredientModel>(this.buildUrl(`ingredient/${id}`), payload);
  }

  toggleActive(id: number, isActive: boolean) {
    return this.http.patch<IngredientModel>(this.buildUrl(`ingredient/${id}/active`), { isActive });
  }

  delete(id: number) {
    return this.http.delete(this.buildUrl(`ingredient/${id}`));
  }
}
