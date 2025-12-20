import { Ingredient } from './ingredient.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IngredientType } from '../ingredient-types/ingredient-type.entity';

@Injectable()
export class IngredientService {
  constructor(
    @InjectRepository(Ingredient)
    private ingredientRepository: Repository<Ingredient>,
    @InjectRepository(IngredientType)
    private typeRepo: Repository<IngredientType>,
  ) {}

  findAll() {
    return this.ingredientRepository.find({ relations: ['type'] });
  }

  findOne(id: number) {
    return this.ingredientRepository.findOne({
      where: { id },
      relations: ['type'],
    });
  }

  async create(data: any) {
    const ingredient = this.ingredientRepository.create({...data, isActive: true});
    if (data.typeId) {
      ingredient[0].type =
        (await this.typeRepo.findOne({ where: { id: data.typeId } })) ||
        new IngredientType();
    }
    return this.ingredientRepository.save(ingredient);
  }

  update(id: number, data: Partial<Ingredient>) {
    return this.ingredientRepository.update(id, data);
  }

  delete(id: number) {
    return this.ingredientRepository.delete(id);
  }
}
