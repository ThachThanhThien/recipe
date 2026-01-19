export class IngredientModel {
  id: number;
  name: string;
  description: string;
  isActive: boolean;
  typeId: number | null;
  ingredientTypeName?: string;

  constructor() {
    this.id = 0;
    this.name = '';
    this.description = '';
    this.isActive = true;
    this.typeId = null;
  }
}
