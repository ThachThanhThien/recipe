import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import type { Multilingual } from '../../common/interfaces/multilingual.interface';
import type { Difficulty } from '../recipe.entity';

export class RecipeIngredientItemDto {
  @ApiProperty({ description: 'The ID of the ingredient' })
  @IsNumber()
  @IsNotEmpty()
  ingredientId: number;

  @ApiProperty({ description: 'The quantity (e.g. "200", "1/2 cup")' })
  @IsString()
  @IsNotEmpty()
  quantity: string;
}

export class CreateRecipeDto {
  @ApiProperty({ description: 'The title of the recipe (Multilingual)' })
  @IsObject()
  title: Multilingual;

  @ApiProperty({ description: 'The description of the recipe (Multilingual)', required: false })
  @IsObject()
  @IsOptional()
  description?: Multilingual;

  @ApiProperty({ description: 'The cooking instructions (Multilingual)', required: false })
  @IsObject()
  @IsOptional()
  instructions?: Multilingual;

  @ApiProperty({ description: 'Image URL', required: false })
  @IsString()
  @IsOptional()
  image?: string;

  @ApiProperty({ description: 'Prep time (e.g. "10 mins")', required: false })
  @IsString()
  @IsOptional()
  prepTime?: string;

  @ApiProperty({ description: 'Cook time (e.g. "12 mins")', required: false })
  @IsString()
  @IsOptional()
  cookTime?: string;

  @ApiProperty({ description: 'Number of servings', required: false })
  @IsNumber()
  @IsOptional()
  servings?: number;

  @ApiProperty({ description: 'Calories per serving', required: false })
  @IsNumber()
  @IsOptional()
  calories?: number;

  @ApiProperty({ description: 'Difficulty level', enum: ['Easy', 'Medium', 'Hard'], required: false })
  @IsEnum(['Easy', 'Medium', 'Hard'])
  @IsOptional()
  difficulty?: Difficulty;

  @ApiProperty({ description: 'Category', required: false })
  @IsString()
  @IsOptional()
  category?: string;

  @ApiProperty({ description: 'Tags', required: false })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiProperty({ description: 'Average rating', required: false })
  @IsNumber()
  @IsOptional()
  rating?: number;

  @ApiProperty({ description: 'Number of reviews', required: false })
  @IsNumber()
  @IsOptional()
  reviews?: number;

  @ApiProperty({ description: 'Whether the recipe is featured', default: false, required: false })
  @IsBoolean()
  @IsOptional()
  isFeatured?: boolean;

  @ApiProperty({ description: 'Whether the recipe is trending', default: false, required: false })
  @IsBoolean()
  @IsOptional()
  isTrending?: boolean;

  @ApiProperty({ description: 'Whether the recipe is active', default: true, required: false })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiProperty({
    description: 'The ingredients for this recipe',
    type: [RecipeIngredientItemDto],
  })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => RecipeIngredientItemDto)
  ingredients: RecipeIngredientItemDto[];
}
