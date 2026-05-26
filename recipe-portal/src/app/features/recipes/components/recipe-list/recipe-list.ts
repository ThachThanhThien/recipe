import { Component, inject, OnInit, effect } from '@angular/core';
import { LanguageService } from '../../../../core/services/language.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { Tag } from 'primeng/tag';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { SideDrawer } from '../../../../shared/components/side-drawer/side-drawer';
import { RecipeDetail } from '../recipe-detail/recipe-detail';
import { RecipeModel } from '../../models/recipe.model';
import { RecipeService } from '../../services/recipe.service';

@Component({
  selector: 'app-recipe-list',
  imports: [CommonModule, TableModule, ButtonModule, TooltipModule, ToolbarModule, RouterModule, SideDrawer, RecipeDetail, Tag, FormsModule],
  templateUrl: './recipe-list.html',
})
export class RecipeList implements OnInit {
  recipes: RecipeModel[] = [];
  isShowDetail = false;
  selectedRecipeId: number | null = null;
  private languageService = inject(LanguageService);
  private recipeService = inject(RecipeService);

  constructor() {
    effect(() => {
      this.languageService.currentLanguage();
      this.getAllRecipes();
    });
  }

  ngOnInit() {
  }

  getAllRecipes() {
    this.recipeService.getAll().subscribe(res => {
      this.recipes = res;
    });
  }

  updateStatus(recipe: RecipeModel) {
    this.recipeService.toggleActive(recipe.id, !recipe.isActive).subscribe({
      next: () => this.getAllRecipes(),
      error: () => { }
    });
  }

  getIngredientCount(recipe: RecipeModel): number {
    return recipe.recipeIngredients?.length || 0;
  }
}
