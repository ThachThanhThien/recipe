import { Component, Input, Output, EventEmitter, OnChanges, OnInit, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { MessageModule } from 'primeng/message';
import { AppComponentBase } from '../../../../core/component/app-component-base';
import { IngredientService } from '../../services/ingredient.service';
import { IngredientTypeService } from '../../../ingredient-types/services/ingredient-type.service';
import { SelectModule } from 'primeng/select';

@Component({
  selector: 'app-ingredient-detail',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    MessageModule,
    SelectModule
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

  constructor() {
    super();

    this.form = this.fb.group({
      name: ['', Validators.required],
      description: [''],
      typeId: [null, Validators.required],
      isActive: [true]
    });
  }

  ngOnInit(): void {
    this.loadTypes();
  }

  ngOnChanges(): void {
    if (this.id) {
      this.loadDetail(this.id);
    } else {
      this.resetForm();
    }
  }

  private loadTypes(): void {
    this.ingredientTypeService.getAll().subscribe(res => {
      this.types = res || [];
    });
  }

  private loadDetail(id: number): void {
    this.ingredientService.getById(id).subscribe({
      next: (data) => {
        this.form.patchValue({
          name: data.name,
          description: data.description,
          typeId: data.typeId,
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
