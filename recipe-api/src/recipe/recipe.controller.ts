import {
  Body,
  Controller,
  DefaultValuePipe,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { RecipeService } from './recipe.service';
import { CreateRecipeDto } from './dto/create-recipe.dto';
import { UpdateRecipeDto } from './dto/update-recipe.dto';
import { QueryRecipeDto } from './dto/query-recipe.dto';
import { Recipe } from './recipe.entity';
import { Paginated } from '../common/interfaces/paginated.interface';

@ApiTags('recipe')
@Controller('recipe')
export class RecipeController {
  constructor(private recipeService: RecipeService) {}

  @Get()
  @ApiOperation({
    summary:
      'List recipes with search/filter/sort/pagination (q, category, difficulty, tag, featured, trending, sort, page, limit)',
  })
  findAll(@Query() query: QueryRecipeDto): Promise<Paginated<Recipe>> {
    return this.recipeService.findAll(query);
  }

  @Get('featured')
  @ApiOperation({ summary: 'List featured recipes (curated for homepage)' })
  findFeatured(
    @Query('limit', new DefaultValuePipe(8), ParseIntPipe) limit: number,
  ): Promise<Recipe[]> {
    return this.recipeService.findFeatured(limit);
  }

  @Get('trending')
  @ApiOperation({ summary: 'List trending recipes' })
  findTrending(
    @Query('limit', new DefaultValuePipe(8), ParseIntPipe) limit: number,
  ): Promise<Recipe[]> {
    return this.recipeService.findTrending(limit);
  }

  @Get('popular')
  @ApiOperation({ summary: 'List most popular recipes (rating * reviews)' })
  findPopular(
    @Query('limit', new DefaultValuePipe(8), ParseIntPipe) limit: number,
  ): Promise<Recipe[]> {
    return this.recipeService.findPopular(limit);
  }

  @Get('random')
  @ApiOperation({ summary: 'Return random recipes (good for "surprise me")' })
  findRandom(
    @Query('limit', new DefaultValuePipe(1), ParseIntPipe) limit: number,
  ): Promise<Recipe[]> {
    return this.recipeService.findRandom(limit);
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: 'Get a recipe by its SEO slug' })
  findBySlug(@Param('slug') slug: string): Promise<Recipe> {
    return this.recipeService.findBySlug(slug);
  }

  @Get(':id/related')
  @ApiOperation({ summary: 'List recipes related to a given recipe id' })
  findRelated(
    @Param('id', ParseIntPipe) id: number,
    @Query('limit', new DefaultValuePipe(6), ParseIntPipe) limit: number,
  ): Promise<Recipe[]> {
    return this.recipeService.findRelated(id, limit);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a single recipe by id' })
  findOne(@Param('id', ParseIntPipe) id: number): Promise<Recipe> {
    return this.recipeService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create a new recipe (slug auto-generated from title)' })
  create(@Body() body: CreateRecipeDto): Promise<Recipe> {
    return this.recipeService.create(body);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update an existing recipe' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: UpdateRecipeDto,
  ): Promise<Recipe> {
    return this.recipeService.update(id, body);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete a recipe' })
  remove(@Param('id', ParseIntPipe) id: number): Promise<void> {
    return this.recipeService.remove(id);
  }

  @Patch(':id/active')
  @ApiOperation({ summary: 'Toggle the active flag on a recipe' })
  toggleActive(
    @Param('id', ParseIntPipe) id: number,
    @Body() body: { isActive: boolean },
  ): Promise<Recipe> {
    return this.recipeService.toggleActive(id, !!body.isActive);
  }
}
