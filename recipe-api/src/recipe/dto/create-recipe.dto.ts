import { ApiProperty } from '@nestjs/swagger';
import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';

import type { Multilingual } from '../../common/interfaces/multilingual.interface';

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
