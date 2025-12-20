import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { RecipeIngredientService } from './recipe-ingredient.service';

@Controller('recipe-ingredient')
export class RecipeIngredientController {
  constructor(private recipeIngredientService: RecipeIngredientService) {}
}
