import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecipeIngredientService } from './recipe-ingredient.service';
import { RecipeIngredient } from './recipe-ingredient.entity';
import { RecipeIngredientController } from './recipe-ingredient.controller';
import { Recipe } from '../recipe/recipe.entity';

@Module({
  imports: [TypeOrmModule.forFeature([RecipeIngredient, Recipe])],
  providers: [RecipeIngredientService],
  controllers: [RecipeIngredientController],
  exports: [RecipeIngredientService],
})
export class RecipeIngredientModule {}
