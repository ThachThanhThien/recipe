import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBooleanString,
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export type RecipeSort =
  | 'newest'
  | 'oldest'
  | 'rating'
  | 'popular'
  | 'fastest'
  | 'title';

export class QueryRecipeDto {
  @ApiPropertyOptional({ description: 'Free-text search over title/description (any language)' })
  @IsOptional()
  @IsString()
  q?: string;

  @ApiPropertyOptional({ description: 'Filter by category (e.g. Dessert, Main Course)' })
  @IsOptional()
  @IsString()
  category?: string;

  @ApiPropertyOptional({ description: 'Filter by difficulty', enum: ['Easy', 'Medium', 'Hard'] })
  @IsOptional()
  @IsEnum(['Easy', 'Medium', 'Hard'])
  difficulty?: 'Easy' | 'Medium' | 'Hard';

  @ApiPropertyOptional({ description: 'Filter by tag (single tag, case-insensitive contains)' })
  @IsOptional()
  @IsString()
  tag?: string;

  @ApiPropertyOptional({ description: 'Filter by featured recipes only', example: 'true' })
  @IsOptional()
  @IsBooleanString()
  featured?: string;

  @ApiPropertyOptional({ description: 'Filter by trending recipes only', example: 'true' })
  @IsOptional()
  @IsBooleanString()
  trending?: string;

  @ApiPropertyOptional({ description: 'Include inactive recipes', example: 'false' })
  @IsOptional()
  @IsBooleanString()
  includeInactive?: string;

  @ApiPropertyOptional({
    description: 'Sort order',
    enum: ['newest', 'oldest', 'rating', 'popular', 'fastest', 'title'],
    default: 'newest',
  })
  @IsOptional()
  @IsEnum(['newest', 'oldest', 'rating', 'popular', 'fastest', 'title'])
  sort?: RecipeSort;

  @ApiPropertyOptional({ description: 'Page number (1-based)', default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number;

  @ApiPropertyOptional({ description: 'Page size (max 100)', default: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  limit?: number;
}
