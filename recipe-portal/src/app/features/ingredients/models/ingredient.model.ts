export class IngredientModel {
  id: number;
  name: any;
  description: any;
  unit: string;
  isActive: boolean;
  typeIds: number[];
  types?: any[];
  ingredientTypeName?: string;

  constructor() {
    this.id = 0;
    this.name = {};
    this.description = {};
    this.unit = '';
    this.isActive = true;
    this.typeIds = [];
  }
}
