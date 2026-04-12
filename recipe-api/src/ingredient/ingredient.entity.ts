import { Column, Entity, JoinTable, ManyToMany, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IngredientType } from '../ingredient-types/ingredient-type.entity';
import { RecipeIngredient } from '../recipe-ingredient/recipe-ingredient.entity';
import type { Multilingual } from '../common/interfaces/multilingual.interface';

@Entity()
export class Ingredient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'simple-json', nullable: true })
  name: Multilingual;

  @Column({ type: 'simple-json', nullable: true })
  description?: Multilingual;

  @Column({ nullable: true })
  unit?: string;

  @ManyToMany(() => IngredientType, (type) => type.ingredients)
  @JoinTable()
  types: IngredientType[];

  @OneToMany(() => RecipeIngredient, (ri) => ri.ingredient)
  recipeIngredients: RecipeIngredient[];

  @Column({ default: true })
  isActive: boolean;
}
