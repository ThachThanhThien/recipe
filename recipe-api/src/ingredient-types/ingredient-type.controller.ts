import { IngredientTypeService } from './ingredient-type.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
} from '@nestjs/common';

@Controller('ingredient-type')
export class IngredientTypeController {
  constructor(
    private readonly ingredientTypesService: IngredientTypeService,
  ) {}

  @Get()
  findAll() {
    return this.ingredientTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: number) {
    return this.ingredientTypesService.findOne(id);
  }

  @Post()
  create(@Body() body: any) {
    return this.ingredientTypesService.create(body);
  }

  @Put(':id')
  update(@Param('id') id: number, @Body() body: any) {
    return this.ingredientTypesService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id') id: number) {
    return this.ingredientTypesService.delete(id);
  }
}
