import { Routes } from '@angular/router';
import { AppLayout } from './layout/component/app.layout';
import { IngredientList } from './features/ingredients/components/ingredient-list/ingredient-list';
import { IngredientTypeList } from './features/ingredient-types/components/ingredient-type-list/ingredient-type-list';
import { RecipeList } from './features/recipes/components/recipe-list/recipe-list';
import { Connect } from './features/connect/connect';
import { githubGuard } from './core/guards/github.guard';

export const routes: Routes = [
  {
    path: '',
    component: AppLayout,
    children: [
      { path: 'connect', component: Connect },
      { path: 'ingredients', component: IngredientList, canActivate: [githubGuard] },
      { path: 'ingredient-types', component: IngredientTypeList, canActivate: [githubGuard] },
      { path: 'recipes', component: RecipeList, canActivate: [githubGuard] },
    ]
  },
  { path: '**', redirectTo: '/notfound' }
];
