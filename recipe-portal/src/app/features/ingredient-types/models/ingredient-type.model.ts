export class IngredientTypeModel {
  id: number;
  name: any;
  isActive: boolean;
  description: any;

  constructor() {
    this.id = 0;
    this.name = {};
    this.description = {};
    this.isActive = true;
  }
}
