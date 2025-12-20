export class IngredientTypeModel {
  id: number;
  name: string;
  isActive: boolean;
  description: string;

  constructor() {
    this.id = 0;
    this.name = '';
    this.description = '';
    this.isActive = true;
  }
}
