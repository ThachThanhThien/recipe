import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Review } from './review.entity';
import { Recipe } from '../recipe/recipe.entity';
import { CreateReviewDto } from './dto/create-review.dto';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepo: Repository<Review>,
    @InjectRepository(Recipe)
    private recipeRepo: Repository<Recipe>,
  ) {}

  async findForRecipe(recipeId: number): Promise<Review[]> {
    return this.reviewRepo.find({
      where: { recipe: { id: recipeId } },
      order: { createdAt: 'DESC' },
    });
  }

  async createForRecipe(recipeId: number, data: CreateReviewDto): Promise<Review> {
    const recipe = await this.recipeRepo.findOne({ where: { id: recipeId } });
    if (!recipe) {
      throw new NotFoundException(`Recipe with id ${recipeId} not found`);
    }

    const review = this.reviewRepo.create({
      recipe: { id: recipeId } as Recipe,
      reviewerName: data.reviewerName.trim(),
      rating: Math.max(1, Math.min(5, Math.round(data.rating))),
      comment: (data.comment ?? '').trim(),
    });
    const saved = await this.reviewRepo.save(review);

    // Recompute aggregates
    const { avg, count } = await this.reviewRepo
      .createQueryBuilder('r')
      .select('AVG(r.rating)', 'avg')
      .addSelect('COUNT(r.id)', 'count')
      .where('r.recipeId = :recipeId', { recipeId })
      .getRawOne<{ avg: string | null; count: string }>() ?? { avg: '0', count: '0' };

    recipe.rating = avg ? Math.round(parseFloat(avg) * 10) / 10 : 0;
    recipe.reviews = parseInt(count, 10) || 0;
    await this.recipeRepo.save(recipe);

    return saved;
  }
}
