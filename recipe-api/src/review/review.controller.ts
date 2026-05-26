import { Body, Controller, Get, Param, ParseIntPipe, Post } from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { ReviewService } from './review.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { Review } from './review.entity';

@ApiTags('review')
@Controller('recipe/:recipeId/review')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @Get()
  @ApiOperation({ summary: 'List reviews for a recipe (newest first)' })
  findAll(@Param('recipeId', ParseIntPipe) recipeId: number): Promise<Review[]> {
    return this.reviewService.findForRecipe(recipeId);
  }

  @Post()
  @ApiOperation({ summary: 'Submit a review for a recipe' })
  create(
    @Param('recipeId', ParseIntPipe) recipeId: number,
    @Body() body: CreateReviewDto,
  ): Promise<Review> {
    return this.reviewService.createForRecipe(recipeId, body);
  }
}
