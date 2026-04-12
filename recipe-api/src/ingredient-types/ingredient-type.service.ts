import { InjectRepository } from '@nestjs/typeorm';
import { IngredientType } from './ingredient-type.entity';
import { Repository } from 'typeorm';
import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateIngredientTypeDto } from './dto/create-ingredient-type.dto';
import { UpdateIngredientTypeDto } from './dto/update-ingredient-type.dto';

@Injectable()
export class IngredientTypeService {
  constructor(
    @InjectRepository(IngredientType)
    private ingredientTypeRepo: Repository<IngredientType>,
  ) {}

  findAll(): Promise<IngredientType[]> {
    return this.ingredientTypeRepo.find();
  }

  async findOne(id: number): Promise<IngredientType> {
    const type = await this.ingredientTypeRepo.findOne({ where: { id } });
    if (!type) {
      throw new NotFoundException(`IngredientType with id ${id} not found`);
    }
    return type;
  }

  create(data: CreateIngredientTypeDto): Promise<IngredientType> {
    const type = this.ingredientTypeRepo.create(data);
    return this.ingredientTypeRepo.save(type);
  }

  async update(
    id: number,
    data: UpdateIngredientTypeDto,
  ): Promise<IngredientType> {
    await this.findOne(id); // Ensure it exists
    await this.ingredientTypeRepo.update(id, data);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const type = await this.findOne(id);
    await this.ingredientTypeRepo.remove(type);
  }

  async setActive(id: number, isActive: boolean): Promise<IngredientType> {
    await this.update(id, { isActive });
    return this.findOne(id);
  }
}
