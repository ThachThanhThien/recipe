import { Injectable } from '@angular/core';
import { ApiBaseService } from '../../../core/services/api-base.service';
import { IngredientTypeModel } from '../models/ingredient-type.model';

@Injectable({
  providedIn: 'root',
})
export class IngredientTypeService extends ApiBaseService {
  getAll() {
    return this.http.get<IngredientTypeModel[]>(this.buildUrl('ingredient-type'));
  }

  getById(id: number) {
    return this.http.get<IngredientTypeModel>(this.buildUrl(`ingredient-type/${id}`));
  }

  create(payload: IngredientTypeModel) {
    return this.http.post(this.buildUrl('ingredient-type'), payload);
  }

  update(id: number, payload: IngredientTypeModel) {
    return this.http.put(this.buildUrl(`ingredient-type/${id}`), payload);
  }

  delete(id: number) {
    return this.http.delete(this.buildUrl(`ingredient-type/${id}`));
  }
}
