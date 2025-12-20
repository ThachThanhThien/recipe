import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Ingredient } from './ingredient.entity';
import { IngredientService } from './ingredient.service';
import { IngredientController } from './ingredient.controller';
import { IngredientType } from '../ingredient-types/ingredient-type.entity';
import { RecipeIngredient } from '../recipe-ingredient/recipe-ingredient.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Ingredient, IngredientType, RecipeIngredient])],
  providers: [IngredientService],
  controllers: [IngredientController],
  exports: [IngredientService],
})
export class IngredientModule {}
