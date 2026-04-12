import { IngredientTypeService } from './ingredient-type.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Patch,
  ParseIntPipe,
} from '@nestjs/common';
import { CreateIngredientTypeDto } from './dto/create-ingredient-type.dto';
import { UpdateIngredientTypeDto } from './dto/update-ingredient-type.dto';
import { IngredientType } from './ingredient-type.entity';

@Controller('ingredient-type')
export class IngredientTypeController {
  constructor(
    private readonly ingredientTypesService: IngredientTypeService,
  ) {}

  @Get()
  findAll(): Promise<IngredientType[]> {
    return this.ingredientTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number): Promise<IngredientType> {
    return this.ingredientTypesService.findOne(id);
  }

  @Post()
  create(@Body() body: CreateIngredientTypeDto): Promise<IngredientType> {
    return this.ingredientTypesService.create(body);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateIngredientTypeDto,
  ): Promise<IngredientType> {
    return this.ingredientTypesService.update(id, body);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.ingredientTypesService.remove(id);
  }

  @Patch(':id/active')
  setActive(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { isActive: boolean },
  ): Promise<IngredientType> {
    return this.ingredientTypesService.setActive(id, !!body.isActive);
  }
}
