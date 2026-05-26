import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Recipe } from './recipe.entity';
import { RecipeIngredient } from '../recipe-ingredient/recipe-ingredient.entity';
import { Ingredient } from '../ingredient/ingredient.entity';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { QueryRecipeDto } from './dto/query-recipe.dto';
import { Paginated } from '../common/interfaces/paginated.interface';
import { slugify } from '../common/utils/slug.util';

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

  async findAll(query: QueryRecipeDto = {}): Promise<Paginated<Recipe>> {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.min(100, Math.max(1, query.limit ?? 20));
    const includeInactive = query.includeInactive === 'true';

    const qb = this.recipeRepo
      .createQueryBuilder('recipe')
      .leftJoinAndSelect('recipe.recipeIngredients', 'ri')
      .leftJoinAndSelect('ri.ingredient', 'ingredient');

    if (!includeInactive) {
      qb.andWhere('recipe.isActive = :isActive', { isActive: true });
    }

    if (query.q) {
      qb.andWhere('(recipe.title LIKE :q OR recipe.description LIKE :q)', {
        q: `%${query.q}%`,
      });
    }

    if (query.category) {
      qb.andWhere('recipe.category = :category', { category: query.category });
    }

    if (query.difficulty) {
      qb.andWhere('recipe.difficulty = :difficulty', { difficulty: query.difficulty });
    }

    if (query.tag) {
      qb.andWhere('recipe.tags LIKE :tag', { tag: `%${query.tag}%` });
    }

    if (query.featured === 'true') {
      qb.andWhere('recipe.isFeatured = 1');
    }

    if (query.trending === 'true') {
      qb.andWhere('recipe.isTrending = 1');
    }

    switch (query.sort) {
      case 'oldest':
        qb.orderBy('recipe.createdAt', 'ASC');
        break;
      case 'rating':
        qb.orderBy('recipe.rating', 'DESC').addOrderBy('recipe.reviews', 'DESC');
        break;
      case 'popular':
        qb.orderBy('recipe.reviews', 'DESC').addOrderBy('recipe.rating', 'DESC');
        break;
      case 'fastest':
        qb.orderBy('recipe.cookTime', 'ASC');
        break;
      case 'title':
        qb.orderBy('recipe.title', 'ASC');
        break;
      case 'newest':
      default:
        qb.orderBy('recipe.createdAt', 'DESC');
    }

    qb.skip((page - 1) * limit).take(limit);

    const [items, total] = await qb.getManyAndCount();

    return {
      items,
      total,
      page,
      limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    };
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

  async findBySlug(slug: string): Promise<Recipe> {
    const recipe = await this.recipeRepo.findOne({
      where: { slug },
      relations: ['recipeIngredients', 'recipeIngredients.ingredient'],
    });
    if (!recipe) {
      throw new NotFoundException(`Recipe with slug "${slug}" not found`);
    }
    return recipe;
  }

  async findFeatured(limit = 8): Promise<Recipe[]> {
    return this.recipeRepo.find({
      where: { isFeatured: true, isActive: true },
      relations: ['recipeIngredients', 'recipeIngredients.ingredient'],
      order: { rating: 'DESC', reviews: 'DESC' },
      take: limit,
    });
  }

  async findTrending(limit = 8): Promise<Recipe[]> {
    return this.recipeRepo.find({
      where: { isTrending: true, isActive: true },
      relations: ['recipeIngredients', 'recipeIngredients.ingredient'],
      order: { reviews: 'DESC', rating: 'DESC' },
      take: limit,
    });
  }

  async findPopular(limit = 8): Promise<Recipe[]> {
    return this.recipeRepo
      .createQueryBuilder('recipe')
      .leftJoinAndSelect('recipe.recipeIngredients', 'ri')
      .leftJoinAndSelect('ri.ingredient', 'ingredient')
      .where('recipe.isActive = 1')
      .orderBy('recipe.rating * recipe.reviews', 'DESC')
      .addOrderBy('recipe.rating', 'DESC')
      .take(limit)
      .getMany();
  }

  async findRandom(limit = 1): Promise<Recipe[]> {
    return this.recipeRepo
      .createQueryBuilder('recipe')
      .leftJoinAndSelect('recipe.recipeIngredients', 'ri')
      .leftJoinAndSelect('ri.ingredient', 'ingredient')
      .where('recipe.isActive = 1')
      .orderBy('RANDOM()')
      .take(limit)
      .getMany();
  }

  async findRelated(id: number, limit = 6): Promise<Recipe[]> {
    const base = await this.findOne(id);
    return this.recipeRepo
      .createQueryBuilder('recipe')
      .leftJoinAndSelect('recipe.recipeIngredients', 'ri')
      .leftJoinAndSelect('ri.ingredient', 'ingredient')
      .where('recipe.id != :id', { id })
      .andWhere('recipe.isActive = 1')
      .andWhere('(recipe.category = :category OR recipe.difficulty = :difficulty)', {
        category: base.category ?? '',
        difficulty: base.difficulty ?? '',
      })
      .orderBy('recipe.rating', 'DESC')
      .take(limit)
      .getMany();
  }

  async create(data: CreateRecipeDto): Promise<Recipe> {
    const { ingredients, ...rest } = data;

    if (ingredients && ingredients.length > 0) {
      const ingredientIds = ingredients.map((i) => i.ingredientId);
      const found = await this.ingredientRepo.findBy({ id: In(ingredientIds) });
      if (found.length !== ingredientIds.length) {
        throw new BadRequestException('One or more ingredient IDs are invalid');
      }
    }

    const recipe = this.recipeRepo.create(rest);
    recipe.slug = await this.generateUniqueSlug(rest.title);
    const saved = await this.recipeRepo.save(recipe);

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

    const titleChanged = rest.title && rest.title.en !== recipe.title?.en;
    Object.assign(recipe, rest);
    if (titleChanged) {
      recipe.slug = await this.generateUniqueSlug(rest.title!, id);
    }
    await this.recipeRepo.save(recipe);

    if (ingredients !== undefined) {
      if (ingredients.length > 0) {
        const ingredientIds = ingredients.map((i) => i.ingredientId);
        const found = await this.ingredientRepo.findBy({ id: In(ingredientIds) });
        if (found.length !== ingredientIds.length) {
          throw new BadRequestException('One or more ingredient IDs are invalid');
        }
      }

      await this.recipeIngredientRepo.delete({ recipe: { id } });

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

  private async generateUniqueSlug(
    title: { [k: string]: string } | undefined,
    excludeId?: number,
  ): Promise<string> {
    const base = slugify(title?.en || title?.vi || 'recipe') || 'recipe';
    let candidate = base;
    let suffix = 1;
    while (true) {
      const existing = await this.recipeRepo.findOne({ where: { slug: candidate } });
      if (!existing || existing.id === excludeId) return candidate;
      suffix += 1;
      candidate = `${base}-${suffix}`;
    }
  }
}
