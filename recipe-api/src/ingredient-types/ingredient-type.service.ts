import { InjectRepository } from '@nestjs/typeorm';
import { IngredientType } from './ingredient-type.entity';
import { Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';

@Injectable()
export class IngredientTypeService {
  constructor(
    @InjectRepository(IngredientType)
    private ingredientTypeRepo: Repository<IngredientType>,
  ) {}

  findAll() {
    return this.ingredientTypeRepo.find();
  }

  findOne(id: number) {
    return this.ingredientTypeRepo.findOne({ where: { id } });
  }

  create(data: Partial<IngredientType>) {
    const type = this.ingredientTypeRepo.create({...data, isActive: true});
    return this.ingredientTypeRepo.save(type);
  }

  update(id: number, data: Partial<IngredientType>) {
    return this.ingredientTypeRepo.update(id, data);
  }

  delete(id: number) {
    return this.ingredientTypeRepo.delete(id);
  }
}
