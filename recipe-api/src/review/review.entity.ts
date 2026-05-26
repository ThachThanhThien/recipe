import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Recipe } from '../recipe/recipe.entity';

@Entity()
export class Review {
  @PrimaryGeneratedColumn()
  id: number;

  @ManyToOne(() => Recipe, { onDelete: 'CASCADE', nullable: false })
  recipe: Recipe;

  @Column()
  reviewerName: string;

  @Column({ type: 'int' })
  rating: number;

  @Column({ type: 'text', default: '' })
  comment: string;

  @CreateDateColumn()
  createdAt: Date;
}
