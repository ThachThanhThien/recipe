import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { ToolbarModule } from 'primeng/toolbar';
import { SideDrawer } from '../../../../shared/components/side-drawer/side-drawer';
import { IngredientTypeDetail } from '../ingredient-type-detail/ingredient-type-detail';
import { IngredientTypeModel } from '../../models/ingredient-type.model';
import { IngredientTypeService } from '../../services/ingredient-type.service';

@Component({
  selector: 'app-ingredient-type-list',
  imports: [CommonModule, TableModule, ButtonModule, ToolbarModule, RouterModule, SideDrawer, IngredientTypeDetail],
  templateUrl: './ingredient-type-list.html',
})
export class IngredientTypeList implements OnInit {
  types: IngredientTypeModel[] = [];
  isShowDetail = false;
  selectedTypeId = null;
  private ingredientTypeService = inject(IngredientTypeService);

  ngOnInit() {
    this.getAllTypes();
  }

  getAllTypes() {
    this.ingredientTypeService.getAll().subscribe(res => {
      this.types = res;
    })
  }

  updateStatus(type: any) {

  }
}

