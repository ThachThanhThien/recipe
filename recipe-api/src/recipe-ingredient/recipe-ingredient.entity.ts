import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Recipe } from '../recipe/recipe.entity';
import { Ingredient } from '../ingredient/ingredient.entity';

@Entity()
export class RecipeIngredient {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Recipe, (recipe) => recipe.recipeIngredients, {
    onDelete: 'CASCADE',
  })
  recipe: Recipe;

  @ManyToOne(() => Ingredient, (ingredient) => ingredient.recipeIngredients, {
    eager: true,
  })
  ingredient: Ingredient;

  @Column()
  quantity: string;
}
