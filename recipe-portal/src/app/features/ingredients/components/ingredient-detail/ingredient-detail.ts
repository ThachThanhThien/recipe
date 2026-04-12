import { Component, Input, Output, EventEmitter, OnChanges, OnInit, inject, effect } from '@angular/core';
import { LanguageService } from '../../../../core/services/language.service';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { MessageModule } from 'primeng/message';
import { AppComponentBase } from '../../../../core/component/app-component-base';
import { IngredientService } from '../../services/ingredient.service';
import { IngredientTypeService } from '../../../ingredient-types/services/ingredient-type.service';
import { MultiSelectModule } from 'primeng/multiselect';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { MultilingualInput } from '../../../../shared/components/multilingual-input/multilingual-input';

@Component({
  selector: 'app-ingredient-detail',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    MessageModule,
    MultiSelectModule,
    ToggleSwitchModule,
    MultilingualInput
  ],
  templateUrl: './ingredient-detail.html'
})
export class IngredientDetail extends AppComponentBase implements OnChanges, OnInit {
  @Input() id: number | null = 0;
  @Output() onSaved = new EventEmitter<void>();
  form!: FormGroup;
  types: any[] = [];
  private fb = inject(FormBuilder);
  private ingredientService = inject(IngredientService);
  private ingredientTypeService = inject(IngredientTypeService);
  private languageService = inject(LanguageService);

  constructor() {
    super();

    this.initForm();

    effect(() => {
      this.languageService.currentLanguage();
      this.loadTypes();
    });
  }

  private initForm(): void {
    this.form = this.fb.group({
      name: [null, Validators.required],
      description: [null],
      unit: [''],
      typeIds: [[], Validators.required],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    this.loadTypes();
  }

  ngOnChanges(): void {
    this.initForm();
    if (this.id) {
      this.loadDetail(this.id);
    } else {
      this.resetForm();
    }
  }

  private loadTypes(): void {
    this.ingredientTypeService.getAll().subscribe(res => {
      this.types = (res || []).map(t => ({
        ...t,
        displayName: typeof t.name === 'string' ? t.name : (t.name?.en || t.name?.vi || 'Unnamed')
      }));
    });
  }

  private loadDetail(id: number): void {
    this.ingredientService.getById(id).subscribe({
      next: (data) => {
        this.form.patchValue({
          name: data.name,
          description: data.description,
          unit: data.unit || '',
          typeIds: data.types?.map((t: any) => t.id) || [],
          isActive: data.isActive
        });
      },
      error: () => {
        this.showError('Error', 'Cannot load ingredient');
      }
    });
  }

  save(): void {
    this.markFormSubmitted();

    if (this.form.invalid) {
      return;
    }

    const payload = this.form.value;

    const request$ = this.id
      ? this.ingredientService.update(this.id, payload)
      : this.ingredientService.create(payload);

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
    this.form.patchValue({ isActive: true });
    this.resetFormSubmitted();
  }
} 
