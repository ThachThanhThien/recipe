import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Recipe } from '../recipe/recipe.entity';
import { RecipeIngredient } from '../recipe-ingredient/recipe-ingredient.entity';
import { Ingredient } from '../ingredient/ingredient.entity';
import { IngredientType } from '../ingredient-types/ingredient-type.entity';
import { slugify } from '../common/utils/slug.util';
import { recipeSeedData, RecipeSeed } from './data/recipes.seed';

@Injectable()
export class SeedService {
  private readonly logger = new Logger('Seed');

  constructor(
    @InjectRepository(Recipe) private recipeRepo: Repository<Recipe>,
    @InjectRepository(RecipeIngredient)
    private recipeIngredientRepo: Repository<RecipeIngredient>,
    @InjectRepository(Ingredient) private ingredientRepo: Repository<Ingredient>,
    @InjectRepository(IngredientType) private typeRepo: Repository<IngredientType>,
  ) {}

  async clearRecipes(): Promise<void> {
    this.logger.log('Clearing recipe_ingredient and recipe tables...');
    await this.recipeIngredientRepo.createQueryBuilder().delete().execute();
    await this.recipeRepo.createQueryBuilder().delete().execute();
    this.logger.log('Cleared.');
  }

  async seedAll(): Promise<{ recipes: number; ingredientsCreated: number }> {
    let ingredientsCreated = 0;
    const allIngredients = await this.ingredientRepo.find({ relations: ['types'] });
    const ingredientByEn = new Map<string, Ingredient>(
      allIngredients.map((i) => [(i.name?.en ?? '').toLowerCase(), i]),
    );

    const allTypes = await this.typeRepo.find();
    const typeByEn = new Map<string, IngredientType>(
      allTypes.map((t) => [(t.name?.en ?? '').toLowerCase(), t]),
    );

    let recipesCreated = 0;

    for (const seed of recipeSeedData) {
      const resolvedIngredients: { ingredient: Ingredient; quantity: string }[] = [];

      for (const ing of seed.ingredients) {
        const key = ing.en.toLowerCase();
        let found = ingredientByEn.get(key);
        if (!found) {
          const typeKey = (ing.type ?? 'Vegetables').toLowerCase();
          const type = typeByEn.get(typeKey);
          const created = this.ingredientRepo.create({
            name: { en: ing.en, vi: ing.vi },
            unit: ing.unit,
            types: type ? [type] : [],
            isActive: true,
          });
          found = await this.ingredientRepo.save(created);
          ingredientByEn.set(key, found);
          ingredientsCreated += 1;
          this.logger.log(`  + new ingredient: ${ing.en} / ${ing.vi}`);
        }
        resolvedIngredients.push({ ingredient: found, quantity: ing.quantity });
      }

      const recipe = this.recipeRepo.create({
        slug: await this.uniqueSlug(seed.title.en),
        title: seed.title,
        description: seed.description,
        instructions: seed.instructions,
        image: seed.image,
        prepTime: seed.prepTime,
        cookTime: seed.cookTime,
        servings: seed.servings,
        calories: seed.calories,
        difficulty: seed.difficulty,
        category: seed.category,
        tags: seed.tags,
        rating: seed.rating ?? 0,
        reviews: seed.reviews ?? 0,
        isFeatured: seed.isFeatured ?? false,
        isTrending: seed.isTrending ?? false,
        isActive: true,
      });
      const savedRecipe = await this.recipeRepo.save(recipe);

      const recipeIngredients = resolvedIngredients.map((r) =>
        this.recipeIngredientRepo.create({
          recipe: { id: savedRecipe.id } as Recipe,
          ingredient: { id: r.ingredient.id } as Ingredient,
          quantity: r.quantity,
        }),
      );
      await this.recipeIngredientRepo.save(recipeIngredients);
      recipesCreated += 1;
      this.logger.log(`  + recipe ${recipesCreated}/${recipeSeedData.length}: ${seed.title.en}`);
    }

    return { recipes: recipesCreated, ingredientsCreated };
  }

  private async uniqueSlug(titleEn: string): Promise<string> {
    const base = slugify(titleEn) || 'recipe';
    let candidate = base;
    let n = 1;
    while (await this.recipeRepo.findOne({ where: { slug: candidate } })) {
      n += 1;
      candidate = `${base}-${n}`;
    }
    return candidate;
  }
}

export type { RecipeSeed };
