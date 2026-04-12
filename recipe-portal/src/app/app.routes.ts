import { Routes } from '@angular/router';
import { AppLayout } from './layout/component/app.layout';
import { IngredientList } from './features/ingredients/components/ingredient-list/ingredient-list';
import { IngredientTypeList } from './features/ingredient-types/components/ingredient-type-list/ingredient-type-list';
import { RecipeList } from './features/recipes/components/recipe-list/recipe-list';

export const routes: Routes = [
  {
    path: '',
    component: AppLayout,
    children: [
      { path: 'ingredients', component: IngredientList },
      { path: 'ingredient-types', component: IngredientTypeList },
      { path: 'recipes', component: RecipeList },
    ]
  },
  { path: '**', redirectTo: '/notfound' }
];
