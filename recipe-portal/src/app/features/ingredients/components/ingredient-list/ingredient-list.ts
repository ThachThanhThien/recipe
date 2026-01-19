import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { SideDrawer } from '../../../../shared/components/side-drawer/side-drawer';
import { IngredientDetail } from '../ingredient-detail/ingredient-detail';
import { IngredientModel } from '../../models/ingredient.model';
import { IngredientService } from '../../services/ingredient.service';

@Component({
  selector: 'app-ingredient-list',
  imports: [CommonModule, TableModule, ButtonModule, ToolbarModule, RouterModule, SideDrawer, IngredientDetail],
  templateUrl: './ingredient-list.html',
})
export class IngredientList implements OnInit {
  ingredients: IngredientModel[] = [];
  isShowDetail = false;
  selectedIngredientId: number | null = null;
  private ingredientService = inject(IngredientService);

  ngOnInit() {
    this.getAllIngredients();
  }

  getAllIngredients() {
    this.ingredientService.getAll().subscribe(res => {
      this.ingredients = res;
    });
  }

  updateStatus(ingredient: any) {
    const payload = { ...ingredient, isActive: !ingredient.isActive };
    this.ingredientService.update(ingredient.id, payload).subscribe({
      next: () => this.getAllIngredients(),
      error: () => {}
    });
  }
}
