import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';
import { IngredientService } from './ingredient.service';

@Controller('ingredient')
export class IngredientController {
  constructor(private ingredientService: IngredientService) {}

  @Get()
  findAll() {
    return this.ingredientService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.ingredientService.findOne(id);
  }

  @Post()
  create(@Body() body: any) {
    return this.ingredientService.create(body);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() body: any) {
    return this.ingredientService.update(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: number) {
    return this.ingredientService.delete(id);
  }
}
