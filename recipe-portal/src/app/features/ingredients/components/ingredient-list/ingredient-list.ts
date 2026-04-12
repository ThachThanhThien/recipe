import { Component, inject, OnInit, effect } from '@angular/core';
import { LanguageService } from '../../../../core/services/language.service';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { Tag } from 'primeng/tag';
import { FormsModule } from '@angular/forms';
import { SideDrawer } from '../../../../shared/components/side-drawer/side-drawer';
import { IngredientDetail } from '../ingredient-detail/ingredient-detail';
import { IngredientModel } from '../../models/ingredient.model';
import { IngredientService } from '../../services/ingredient.service';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-ingredient-list',
  imports: [CommonModule, TableModule, ButtonModule, TooltipModule, ToolbarModule, RouterModule, SideDrawer, IngredientDetail, Tag, FormsModule],
  templateUrl: './ingredient-list.html',
})
export class IngredientList implements OnInit {
  ingredients: IngredientModel[] = [];
  isShowDetail = false;
  selectedIngredientId: number | null = null;
  private languageService = inject(LanguageService);
  private ingredientService = inject(IngredientService);
  
  constructor() {
    effect(() => {
      this.languageService.currentLanguage();
      this.getAllIngredients();
    });
  }

  ngOnInit() {
  }

  getAllIngredients() {
    this.ingredientService.getAll().subscribe(res => {
      this.ingredients = res;
    });
  }

  updateStatus(ingredient: IngredientModel) {
    this.ingredientService.toggleActive(ingredient.id, !ingredient.isActive).subscribe({
      next: () => this.getAllIngredients(),
      error: () => { }
    });
  }

  getTypeNames(ingredient: IngredientModel): string {
    return ingredient.types?.map((t: any) => t.name).join(', ') || '-';
  }
}
