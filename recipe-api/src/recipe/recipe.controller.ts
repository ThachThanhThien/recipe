import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Put,
  ParseIntPipe,
} from '@nestjs/common';
import { RecipeService } from './recipe.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { Recipe } from './recipe.entity';

@Controller('recipe')
export class RecipeController {
  constructor(private recipeService: RecipeService) {}

  @Get()
  findAll(): Promise<Recipe[]> {
    return this.recipeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Recipe> {
    return this.recipeService.findOne(id);
  }

  @Post()
  create(@Body() body: CreateRecipeDto): Promise<Recipe> {
    return this.recipeService.create(body);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateRecipeDto,
  ): Promise<Recipe> {
    return this.recipeService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.recipeService.remove(id);
  }

  @Patch(':id/active')
  toggleActive(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { isActive: boolean },
  ): Promise<Recipe> {
    return this.recipeService.toggleActive(id, !!body.isActive);
  }
}
