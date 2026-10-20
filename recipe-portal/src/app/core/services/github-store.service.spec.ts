import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting, TestRequest } from '@angular/common/http/testing';
import { provideRouter, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { GithubStore } from './github-store.service';
import { RecipeService } from '../../features/recipes/services/recipe.service';
import { LanguageService } from './language.service';

const RECIPES = 'recipe-site/data/recipes.json';
const INGREDIENTS = 'recipe-site/data/ingredients.json';

function toBase64(text: string): string {
  const bytes = new TextEncoder().encode(text);
  return btoa(String.fromCharCode(...bytes));
}

function fromBase64(base64: string): string {
  return new TextDecoder().decode(Uint8Array.from(atob(base64), (c) => c.charCodeAt(0)));
}

describe('GithubStore', () => {
  let store: GithubStore;
  let http: HttpTestingController;

  const expectGet = (path: string) =>
    http.expectOne((req) => req.method === 'GET' && req.url.includes(`/contents/${path}?ref=main&t=`));
  const expectPut = (path: string) =>
    http.expectOne((req) => req.method === 'PUT' && req.url.endsWith(`/contents/${path}`));
  const serve = (req: TestRequest, items: unknown[], sha: string) =>
    req.flush({ sha, encoding: 'base64', content: toBase64(JSON.stringify(items, null, 2) + '\n') });

  beforeEach(() => {
    localStorage.setItem('github_token', 'test-token');
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    store = TestBed.inject(GithubStore);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    http.verify();
    localStorage.removeItem('github_token');
  });

  it('reads a file once, decoding UTF-8, and serves later reads from memory', async () => {
    const first = firstValueFrom(store.read<any>('recipes'));
    const req = expectGet(RECIPES);
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-token');
    serve(req, [{ id: 1, title: { en: 'Pho', vi: 'Phở Bò' } }], 'sha1');

    expect((await first)[0].title.vi).toBe('Phở Bò');
    const again = await firstValueFrom(store.read<any>('recipes'));
    expect(again.length).toBe(1);
  });

  it('commits the changed file with the current sha and keeps the new version in memory', async () => {
    const saved = firstValueFrom(store.write<any>('recipes', (items) => [...items, { id: 2 }], 'Add recipe: Test'));
    serve(expectGet(RECIPES), [{ id: 1 }], 'sha1');

    const put = expectPut(RECIPES);
    expect(put.request.body.sha).toBe('sha1');
    expect(put.request.body.branch).toBe('main');
    expect(put.request.body.message).toBe('Add recipe: Test');
    expect(fromBase64(put.request.body.content)).toBe(JSON.stringify([{ id: 1 }, { id: 2 }], null, 2) + '\n');
    put.flush({ content: { sha: 'sha2' } });
    expect((await saved).length).toBe(2);

    // The next save uses the new sha without re-reading.
    const next = firstValueFrom(store.write<any>('recipes', (items) => items.slice(1), 'Delete recipe #1'));
    const put2 = expectPut(RECIPES);
    expect(put2.request.body.sha).toBe('sha2');
    put2.flush({ content: { sha: 'sha3' } });
    expect(await next).toEqual([{ id: 2 }]);
  });

  it('reloads and re-applies the change once when the file changed on GitHub meanwhile', async () => {
    const saved = firstValueFrom(store.write<any>('recipes', (items) => [...items, { id: 99 }], 'Add'));
    serve(expectGet(RECIPES), [{ id: 1 }], 'old');
    expectPut(RECIPES).flush({ message: 'conflict' }, { status: 409, statusText: 'Conflict' });

    serve(expectGet(RECIPES), [{ id: 1 }, { id: 5 }], 'newer');
    const retry = expectPut(RECIPES);
    expect(retry.request.body.sha).toBe('newer');
    expect(JSON.parse(fromBase64(retry.request.body.content)).map((r: any) => r.id)).toEqual([1, 5, 99]);
    retry.flush({ content: { sha: 'final' } });
    expect((await saved).length).toBe(3);
  });

  it('forgets a rejected token and sends the user to the connect page', async () => {
    const navigate = spyOn(TestBed.inject(Router), 'navigate').and.resolveTo(true);
    const failed = firstValueFrom(store.read('recipes')).catch((err) => err);
    expectGet(RECIPES).flush({ message: 'Bad credentials' }, { status: 401, statusText: 'Unauthorized' });

    expect((await failed).status).toBe(401);
    expect(store.token()).toBeNull();
    expect(localStorage.getItem('github_token')).toBeNull();
    expect(navigate).toHaveBeenCalledWith(['/connect']);
  });

  describe('RecipeService', () => {
    let recipes: RecipeService;
    const form = {
      title: { en: 'Banh Mi', vi: 'Bánh mì' },
      description: { en: '', vi: '' },
      instructions: { en: '1. Toast', vi: '1. Nướng' },
      image: '',
      prepTime: '10 mins',
      cookTime: '',
      servings: 2,
      calories: 0,
      difficulty: 'Easy',
      category: 'Sandwich',
      tags: ['Quick'],
      rating: 0,
      reviews: 0,
      isFeatured: false,
      isTrending: false,
      isActive: true,
      ingredients: [{ ingredientId: 7, quantity: '1' }],
    };

    beforeEach(() => (recipes = TestBed.inject(RecipeService)));

    it('adds a recipe with the next id in the stored shape', async () => {
      const saved = firstValueFrom(recipes.create(form));
      serve(expectGet(INGREDIENTS), [{ id: 7 }], 'i1');
      serve(expectGet(RECIPES), [{ id: 49, createdAt: '2026-01-01T00:00:00.000Z' }], 'r1');

      const put = expectPut(RECIPES);
      expect(put.request.body.message).toBe('Add recipe: Banh Mi');
      const added = JSON.parse(fromBase64(put.request.body.content))[1];
      expect(Object.keys(added)).toEqual([
        'id', 'title', 'description', 'instructions', 'image', 'prepTime', 'cookTime', 'servings', 'calories',
        'difficulty', 'category', 'tags', 'rating', 'reviews', 'isFeatured', 'isTrending', 'isActive',
        'ingredients', 'createdAt', 'updatedAt',
      ]);
      expect(added.id).toBe(50);
      expect(added.image).toBeNull();
      expect(added.ingredients).toEqual([{ ingredientId: 7, quantity: '1' }]);
      put.flush({ content: { sha: 'r2' } });
      await saved;
    });

    it('refuses ingredients that do not exist, without committing', async () => {
      const failed = firstValueFrom(recipes.create({ ...form, ingredients: [{ ingredientId: 404, quantity: '1' }] })).catch(
        (err) => err,
      );
      serve(expectGet(INGREDIENTS), [{ id: 7 }], 'i1');
      expect((await failed).message).toContain('ingredient IDs are invalid');
    });

    it('lists recipes newest first in the chosen language, and edits get every language', async () => {
      TestBed.inject(LanguageService).setLanguage('vi');
      const list = firstValueFrom(recipes.getAll());
      serve(
        expectGet(RECIPES),
        [
          { id: 1, title: { en: 'Old', vi: 'Cũ' }, description: null, createdAt: '2026-01-01T00:00:00.000Z' },
          { id: 2, title: { en: 'New', vi: 'Mới' }, description: null, createdAt: '2026-02-01T00:00:00.000Z' },
        ],
        'r1',
      );
      expect((await list).map((r) => r.title)).toEqual(['Mới', 'Cũ']);
      expect((await firstValueFrom(recipes.getById(2))).title).toEqual({ en: 'New', vi: 'Mới' });
      localStorage.removeItem('app_language');
    });
  });
});
