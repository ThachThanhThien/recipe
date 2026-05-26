import { Component, Input, Output, EventEmitter, OnChanges, OnInit, inject, effect } from '@angular/core';
import { LanguageService } from '../../../../core/services/language.service';
import { FormBuilder, FormGroup, FormArray, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { MessageModule } from 'primeng/message';
import { SelectModule } from 'primeng/select';
import { EditorModule } from 'primeng/editor';
import { InputNumberModule } from 'primeng/inputnumber';
import { CheckboxModule } from 'primeng/checkbox';

import { AppComponentBase } from '../../../../core/component/app-component-base';
import { RecipeService } from '../../services/recipe.service';
import { IngredientService } from '../../../ingredients/services/ingredient.service';
import { MultilingualInput } from '../../../../shared/components/multilingual-input/multilingual-input';
import { ImageUploader } from '../../../../shared/components/image-uploader/image-uploader';

@Component({
  selector: 'app-recipe-detail',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    MessageModule,
    SelectModule,
    EditorModule,
    InputNumberModule,
    CheckboxModule,
    MultilingualInput,
    ImageUploader
  ],
  templateUrl: './recipe-detail.html'
})
export class RecipeDetail extends AppComponentBase implements OnChanges, OnInit {
  @Input() id: number | null = 0;
  @Output() onSaved = new EventEmitter<void>();
  form!: FormGroup;
  availableIngredients: any[] = [];
  difficultyOptions = [
    { label: 'Easy', value: 'Easy' },
    { label: 'Medium', value: 'Medium' },
    { label: 'Hard', value: 'Hard' }
  ];
  categoryOptions = [
    { label: 'Breakfast', value: 'Breakfast' },
    { label: 'Lunch', value: 'Lunch' },
    { label: 'Dinner', value: 'Dinner' },
    { label: 'Snack', value: 'Snack' },
    { label: 'Dessert', value: 'Dessert' }
  ];
  private fb = inject(FormBuilder);
  private recipeService = inject(RecipeService);
  private ingredientService = inject(IngredientService);
  private languageService = inject(LanguageService);

  constructor() {
    super();

    this.initForm();
    
    effect(() => {
      this.languageService.currentLanguage();
      this.loadIngredients();
    });
  }

  private initForm(): void {
    this.form = this.fb.group({
      title: [null, Validators.required],
      description: [null],
      instructions: [null],
      image: [''],
      prepTime: [''],
      cookTime: [''],
      servings: [1],
      calories: [0],
      difficulty: ['Easy'],
      category: [''],
      tags: [''],
      rating: [0],
      reviews: [0],
      isFeatured: [false],
      isTrending: [false],
      isActive: [true],
      ingredients: this.fb.array([])
    });
  }

  get ingredientsArray(): FormArray {
    return this.form.get('ingredients') as FormArray;
  }

  ngOnInit(): void {
    this.loadIngredients();
  }

  ngOnChanges(): void {
    this.initForm();
    if (this.id) {
      this.loadDetail(this.id);
    } else {
      this.resetForm();
    }
  }

  private loadIngredients(): void {
    this.ingredientService.getAll().subscribe(res => {
      this.availableIngredients = (res || []).map(i => ({
        ...i,
        displayName: typeof i.name === 'string' ? i.name : (i.name?.en || i.name?.vi || 'Unnamed')
      }));
    });
  }

  private loadDetail(id: number): void {
    this.recipeService.getById(id).subscribe({
      next: (data) => {
        this.form.patchValue({
          title: data.title,
          description: data.description,
          instructions: data.instructions,
          image: data.image || '',
          prepTime: data.prepTime || '',
          cookTime: data.cookTime || '',
          servings: data.servings || 1,
          calories: data.calories || 0,
          difficulty: data.difficulty || 'Easy',
          category: data.category || '',
          tags: Array.isArray(data.tags) ? data.tags.join(', ') : '',
          rating: data.rating || 0,
          reviews: data.reviews || 0,
          isFeatured: data.isFeatured || false,
          isTrending: data.isTrending || false,
          isActive: data.isActive
        });

        this.ingredientsArray.clear();
        if (data.recipeIngredients && data.recipeIngredients.length > 0) {
          for (const ri of data.recipeIngredients) {
            this.ingredientsArray.push(this.fb.group({
              ingredientId: [ri.ingredient?.id || 0, Validators.required],
              quantity: [ri.quantity || '', Validators.required]
            }));
          }
        }
      },
      error: () => {
        this.showError('Error', 'Cannot load recipe');
      }
    });
  }

  addIngredient(): void {
    this.ingredientsArray.push(this.fb.group({
      ingredientId: [null, Validators.required],
      quantity: ['', Validators.required]
    }));
  }

  removeIngredient(index: number): void {
    this.ingredientsArray.removeAt(index);
  }

  save(): void {
    this.markFormSubmitted();

    if (this.form.invalid) {
      return;
    }

    const payload = {
      title: this.form.value.title,
      description: this.form.value.description,
      instructions: this.form.value.instructions,
      image: this.form.value.image,
      prepTime: this.form.value.prepTime,
      cookTime: this.form.value.cookTime,
      servings: this.form.value.servings,
      calories: this.form.value.calories,
      difficulty: this.form.value.difficulty,
      category: this.form.value.category,
      tags: Array.isArray(this.form.value.tags) 
        ? this.form.value.tags 
        : this.form.value.tags 
          ? this.form.value.tags.split(',').map((t: string) => t.trim()).filter((t: string) => t)
          : [],
      rating: this.form.value.rating,
      reviews: this.form.value.reviews,
      isFeatured: this.form.value.isFeatured,
      isTrending: this.form.value.isTrending,
      isActive: this.form.value.isActive,
      ingredients: this.form.value.ingredients
    };

    const request$ = this.id
      ? this.recipeService.update(this.id, payload)
      : this.recipeService.create(payload);

    request$.subscribe({
      next: () => {
        this.showSuccess('Success', 'Saved successfully');
        this.onSaved.emit();
        this.resetForm();
      },
      error: () => {
        this.showError('Error', 'Save failed');
      }
    });
  }

  private resetForm(): void {
    this.form.reset();
    this.form.patchValue({ 
      isActive: true,
      servings: 1,
      calories: 0,
      difficulty: 'Easy',
      tags: '',
      rating: 0,
      reviews: 0,
      isFeatured: false,
      isTrending: false
    });
    this.ingredientsArray.clear();
    this.resetFormSubmitted();
  }
}
