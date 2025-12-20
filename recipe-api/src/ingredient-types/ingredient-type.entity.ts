import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import { Ingredient } from '../ingredient/ingredient.entity';

@Entity()
export class IngredientType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @OneToMany(() => Ingredient, (ingredient) => ingredient.type)
  ingredients: Ingredient[];

  @Column({ nullable: true })
  description: string;

  @Column(({ nullable: true }))
  isActive: boolean;
}
