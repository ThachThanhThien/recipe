export class RecipeIngredientItemModel {
  ingredientId: number;
  quantity: string;

  constructor() {
    this.ingredientId = 0;
    this.quantity = '';
  }
}

export class RecipeModel {
  id: number;
  title: any;
  description: any;
  instructions: any;
  isActive: boolean;
  ingredients: RecipeIngredientItemModel[];
  recipeIngredients?: any[];

  constructor() {
    this.id = 0;
    this.title = {};
    this.description = {};
    this.instructions = {};
    this.isActive = true;
    this.ingredients = [];
  }
}
