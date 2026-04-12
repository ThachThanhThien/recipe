import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';
import { RecipeIngredient } from '../recipe-ingredient/recipe-ingredient.entity';
import type { Multilingual } from '../common/interfaces/multilingual.interface';

@Entity()
export class Recipe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'simple-json', nullable: true })
  title: Multilingual;

  @Column({ type: 'simple-json', nullable: true })
  description: Multilingual;

  @Column({ type: 'simple-json', nullable: true })
  instructions: Multilingual;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => RecipeIngredient, (ri) => ri.recipe, { cascade: true })
  recipeIngredients: RecipeIngredient[];
}
