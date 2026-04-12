import { Component, inject, OnInit, effect } from '@angular/core';
import { LanguageService } from '../../../../core/services/language.service';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { Tag } from 'primeng/tag';
import { FormsModule } from '@angular/forms';
import { SideDrawer } from '../../../../shared/components/side-drawer/side-drawer';
import { IngredientTypeDetail } from '../ingredient-type-detail/ingredient-type-detail';
import { IngredientTypeModel } from '../../models/ingredient-type.model';
import { IngredientTypeService } from '../../services/ingredient-type.service';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-ingredient-type-list',
  imports: [CommonModule, TableModule, ButtonModule, TooltipModule, ToolbarModule, RouterModule, SideDrawer, IngredientTypeDetail, Tag, FormsModule],
  templateUrl: './ingredient-type-list.html',
})
export class IngredientTypeList implements OnInit {
  types: IngredientTypeModel[] = [];
  isShowDetail = false;
  selectedTypeId = null;
  private languageService = inject(LanguageService);
  private ingredientTypeService = inject(IngredientTypeService);
  
  constructor() {
    effect(() => {
      this.languageService.currentLanguage();
      this.getAllTypes();
    });
  }

  ngOnInit() {
  }

  getAllTypes() {
    this.ingredientTypeService.getAll().subscribe(res => {
      this.types = res;
    })
  }

  updateStatus(type: IngredientTypeModel) {
    this.ingredientTypeService.toggleActive(type.id, !type.isActive).subscribe({
      next: () => this.getAllTypes(),
      error: () => { }
    });
  }
}
