import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Review } from './review.entity';
import { Recipe } from '../recipe/recipe.entity';
import { ReviewController } from './review.controller';
import { ReviewService } from './review.service';

@Module({
  imports: [TypeOrmModule.forFeature([Review, Recipe])],
  controllers: [ReviewController],
  providers: [ReviewService],
})
export class ReviewModule {}
