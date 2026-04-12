import { Ingredient } from './ingredient.entity';
import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { CreateIngredientDto } from './dto/create-ingredient.dto';
import { UpdateIngredientDto } from './dto/update-ingredient.dto';
import { IngredientType } from '../ingredient-types/ingredient-type.entity';

@Injectable()
export class IngredientService {
  constructor(
    @InjectRepository(Ingredient)
    private ingredientRepo: Repository<Ingredient>,
    @InjectRepository(IngredientType)
    private typeRepo: Repository<IngredientType>,
  ) {}

  findAll(): Promise<Ingredient[]> {
    return this.ingredientRepo.find({
      relations: ['types'],
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Ingredient> {
    const ingredient = await this.ingredientRepo.findOne({
      where: { id },
      relations: ['types'],
    });
    if (!ingredient) {
      throw new NotFoundException(`Ingredient with id ${id} not found`);
    }
    return ingredient;
  }

  async create(data: CreateIngredientDto): Promise<Ingredient> {
    const { typeIds, ...rest } = data;
    const ingredient = this.ingredientRepo.create(rest);

    if (typeIds && typeIds.length > 0) {
      const types = await this.typeRepo.findBy({ id: In(typeIds) });
      if (types.length !== typeIds.length) {
        throw new BadRequestException('One or more ingredient type IDs are invalid');
      }
      ingredient.types = types;
    }

    const saved = await this.ingredientRepo.save(ingredient);
    return this.findOne(saved.id);
  }

  async update(id: number, data: UpdateIngredientDto): Promise<Ingredient> {
    const { typeIds, ...rest } = data;
    const ingredient = await this.findOne(id);

    if (typeIds !== undefined) {
      if (typeIds.length > 0) {
        const types = await this.typeRepo.findBy({ id: In(typeIds) });
        if (types.length !== typeIds.length) {
          throw new BadRequestException('One or more ingredient type IDs are invalid');
        }
        ingredient.types = types;
      } else {
        ingredient.types = [];
      }
    }

    Object.assign(ingredient, rest);
    await this.ingredientRepo.save(ingredient);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const ingredient = await this.findOne(id);
    await this.ingredientRepo.remove(ingredient);
  }

  async toggleActive(id: number, isActive: boolean): Promise<Ingredient> {
    await this.update(id, { isActive });
    return this.findOne(id);
  }
}
