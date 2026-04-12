import { Column, Entity, ManyToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Ingredient } from '../ingredient/ingredient.entity';
import type { Multilingual } from '../common/interfaces/multilingual.interface';

@Entity()
export class IngredientType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'simple-json', nullable: true })
  name: Multilingual;

  @ManyToMany(() => Ingredient, (ingredient) => ingredient.types)
  ingredients: Ingredient[];

  @Column({ type: 'simple-json', nullable: true })
  description?: Multilingual;

  @Column({ default: true })
  isActive: boolean;
}
