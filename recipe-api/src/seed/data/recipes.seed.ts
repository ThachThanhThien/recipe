import type { Difficulty } from '../../recipe/recipe.entity';
import { vietnameseRecipesPart1 } from './recipes.vn.part1';
import { vietnameseRecipesPart2 } from './recipes.vn.part2';
import { internationalRecipesPart1 } from './recipes.intl.part1';
import { internationalRecipesPart2 } from './recipes.intl.part2';

export interface SeedIngredient {
  en: string;
  vi: string;
  quantity: string;
  unit?: string;
  type?: string;
}

export interface RecipeSeed {
  title: { en: string; vi: string };
  description: { en: string; vi: string };
  instructions: { en: string; vi: string };
  image: string;
  prepTime: string;
  cookTime: string;
  servings: number;
  calories: number;
  difficulty: Difficulty;
  category: string;
  tags: string[];
  rating?: number;
  reviews?: number;
  isFeatured?: boolean;
  isTrending?: boolean;
  ingredients: SeedIngredient[];
}

export const recipeSeedData: RecipeSeed[] = [
  ...vietnameseRecipesPart1,
  ...vietnameseRecipesPart2,
  ...internationalRecipesPart1,
  ...internationalRecipesPart2,
];
