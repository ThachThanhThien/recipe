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
import { IngredientService } from './ingredient.service';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { Ingredient } from './ingredient.entity';

@Controller('ingredient')
export class IngredientController {
  constructor(private ingredientService: IngredientService) {}

  @Get()
  findAll(): Promise<Ingredient[]> {
    return this.ingredientService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Ingredient> {
    return this.ingredientService.findOne(id);
  }

  @Post()
  create(@Body() body: CreateIngredientDto): Promise<Ingredient> {
    return this.ingredientService.create(body);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateIngredientDto,
  ): Promise<Ingredient> {
    return this.ingredientService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.ingredientService.remove(id);
  }

  @Patch(':id/active')
  toggleActive(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { isActive: boolean },
  ): Promise<Ingredient> {
    return this.ingredientService.toggleActive(id, !!body.isActive);
  }
}
