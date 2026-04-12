import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Recipe } from './recipe.entity';
import { RecipeIngredient } from '../recipe-ingredient/recipe-ingredient.entity';
import { Ingredient } from '../ingredient/ingredient.entity';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';

@Injectable()
export class RecipeService {
  constructor(
    @InjectRepository(Recipe)
    private recipeRepo: Repository<Recipe>,
    @InjectRepository(RecipeIngredient)
    private recipeIngredientRepo: Repository<RecipeIngredient>,
    @InjectRepository(Ingredient)
    private ingredientRepo: Repository<Ingredient>,
  ) {}

  findAll(): Promise<Recipe[]> {
    return this.recipeRepo.find({
      relations: ['recipeIngredients', 'recipeIngredients.ingredient'],
      order: { id: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Recipe> {
    const recipe = await this.recipeRepo.findOne({
      where: { id },
      relations: ['recipeIngredients', 'recipeIngredients.ingredient'],
    });
    if (!recipe) {
      throw new NotFoundException(`Recipe with id ${id} not found`);
    }
    return recipe;
  }

  async create(data: CreateRecipeDto): Promise<Recipe> {
    const { ingredients, ...rest } = data;

    // Validate all ingredient IDs exist
    if (ingredients && ingredients.length > 0) {
      const ingredientIds = ingredients.map((i) => i.ingredientId);
      const found = await this.ingredientRepo.findBy({ id: In(ingredientIds) });
      if (found.length !== ingredientIds.length) {
        throw new BadRequestException('One or more ingredient IDs are invalid');
      }
    }

    const recipe = this.recipeRepo.create(rest);
    const saved = await this.recipeRepo.save(recipe);

    // Create recipe ingredients
    if (ingredients && ingredients.length > 0) {
      const recipeIngredients = ingredients.map((item) =>
        this.recipeIngredientRepo.create({
          recipe: { id: saved.id } as Recipe,
          ingredient: { id: item.ingredientId } as Ingredient,
          quantity: item.quantity,
        }),
      );
      await this.recipeIngredientRepo.save(recipeIngredients);
    }

    return this.findOne(saved.id);
  }

  async update(id: number, data: UpdateRecipeDto): Promise<Recipe> {
    const { ingredients, ...rest } = data;
    const recipe = await this.findOne(id);

    // Update scalar fields
    Object.assign(recipe, rest);
    await this.recipeRepo.save(recipe);

    // Replace recipe ingredients if provided
    if (ingredients !== undefined) {
      // Validate all ingredient IDs exist
      if (ingredients.length > 0) {
        const ingredientIds = ingredients.map((i) => i.ingredientId);
        const found = await this.ingredientRepo.findBy({ id: In(ingredientIds) });
        if (found.length !== ingredientIds.length) {
          throw new BadRequestException('One or more ingredient IDs are invalid');
        }
      }

      // Remove existing recipe ingredients
      await this.recipeIngredientRepo.delete({ recipe: { id } });

      // Create new recipe ingredients
      if (ingredients.length > 0) {
        const recipeIngredients = ingredients.map((item) =>
          this.recipeIngredientRepo.create({
            recipe: { id } as Recipe,
            ingredient: { id: item.ingredientId } as Ingredient,
            quantity: item.quantity,
          }),
        );
        await this.recipeIngredientRepo.save(recipeIngredients);
      }
    }

    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const recipe = await this.findOne(id);
    await this.recipeRepo.remove(recipe);
  }

  async toggleActive(id: number, isActive: boolean): Promise<Recipe> {
    const recipe = await this.findOne(id);
    recipe.isActive = isActive;
    await this.recipeRepo.save(recipe);
    return this.findOne(id);
  }
}
