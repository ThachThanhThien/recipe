export class RecipeIngredientItemModel {
  ingredientId: number;
  quantity: string;

  constructor() {
    this.ingredientId = 0;
    this.quantity = '';
  }
}

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

export class RecipeModel {
  id: number;
  title: any;
  description: any;
  instructions: any;
  image: string;
  prepTime: string;
  cookTime: string;
  servings: number;
  calories: number;
  difficulty: Difficulty;
  category: string;
  tags: string[];
  rating: number;
  reviews: number;
  isFeatured: boolean;
  isTrending: boolean;
  isActive: boolean;
  ingredients: RecipeIngredientItemModel[];
  recipeIngredients?: any[];

  constructor() {
    this.id = 0;
    this.title = {};
    this.description = {};
    this.instructions = {};
    this.image = '';
    this.prepTime = '';
    this.cookTime = '';
    this.servings = 1;
    this.calories = 0;
    this.difficulty = 'Easy';
    this.category = '';
    this.tags = [];
    this.rating = 0;
    this.reviews = 0;
    this.isFeatured = false;
    this.isTrending = false;
    this.isActive = true;
    this.ingredients = [];
  }
}
