import { Column, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { IngredientType } from '../ingredient-types/ingredient-type.entity';
import { RecipeIngredient } from '../recipe-ingredient/recipe-ingredient.entity';

@Entity()
export class Ingredient {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column()
  typeId: number;

  @ManyToOne(() => IngredientType, (type) => type.ingredients, {
    nullable: true,
  })
  type: IngredientType;

  @OneToMany(() => RecipeIngredient, (ri) => ri.ingredient)
  recipeIngredients: RecipeIngredient[];

  @Column()
  isActive: boolean;
}
