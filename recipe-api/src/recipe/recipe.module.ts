import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recipe } from './recipe.entity';
import { RecipeIngredient } from '../recipe-ingredient/recipe-ingredient.entity';
import { Ingredient } from '../ingredient/ingredient.entity';
import { RecipeService } from './recipe.service';
import { RecipeController } from './recipe.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Recipe, RecipeIngredient, Ingredient])],
  providers: [RecipeService],
  controllers: [RecipeController],
  exports: [RecipeService],
})
export class RecipeModule {}
