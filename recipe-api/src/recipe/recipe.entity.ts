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

export type Difficulty = 'Easy' | 'Medium' | 'Hard';

@Entity()
export class Recipe {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', unique: true, nullable: true })
  slug: string;

  @Column({ type: 'simple-json', nullable: true })
  title: Multilingual;

  @Column({ type: 'simple-json', nullable: true })
  description: Multilingual;

  @Column({ type: 'simple-json', nullable: true })
  instructions: Multilingual;

  @Column({ nullable: true })
  image: string;

  @Column({ nullable: true })
  prepTime: string;

  @Column({ nullable: true })
  cookTime: string;

  @Column({ type: 'int', default: 1 })
  servings: number;

  @Column({ type: 'int', default: 0 })
  calories: number;

  @Column({ type: 'simple-enum', nullable: true })
  difficulty: Difficulty;

  @Column({ nullable: true })
  category: string;

  @Column({ type: 'simple-json', nullable: true })
  tags: string[];

  @Column({ type: 'float', default: 0 })
  rating: number;

  @Column({ type: 'int', default: 0 })
  reviews: number;

  @Column({ default: false })
  isFeatured: boolean;

  @Column({ default: false })
  isTrending: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ default: true })
  isActive: boolean;

  @OneToMany(() => RecipeIngredient, (ri) => ri.recipe, { cascade: true })
  recipeIngredients: RecipeIngredient[];
}
