import { Component, Input, Output, EventEmitter, OnChanges, inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { MessageModule } from 'primeng/message';
import { ToggleSwitchModule } from 'primeng/toggleswitch';
import { AppComponentBase } from '../../../../core/component/app-component-base';
import { IngredientTypeService } from '../../services/ingredient-type.service';
import { MultilingualInput } from '../../../../shared/components/multilingual-input/multilingual-input';

@Component({
  selector: 'app-ingredient-type-detail',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TextareaModule,
    MessageModule,
    ToggleSwitchModule,
    MultilingualInput
  ],
  templateUrl: './ingredient-type-detail.html'
})
export class IngredientTypeDetail extends AppComponentBase implements OnChanges {
  @Input() id: number | null = 0;
  @Output() onSaved = new EventEmitter<void>();
  form!: FormGroup;
  private fb = inject(FormBuilder);
  private ingredientTypeService = inject(IngredientTypeService);

  constructor() {
    super();

    this.initForm();
  }

  private initForm(): void {
    this.form = this.fb.group({
      name: [null, Validators.required],
      description: [null],
      isActive: [true]
    });
  }

  ngOnChanges(): void {
    this.initForm();
    if (this.id) {
      this.loadDetail(this.id);
    } else {
      this.resetForm();
    }
  }

  private loadDetail(id: number): void {
    this.ingredientTypeService.getById(id).subscribe({
      next: (data) => {
        this.form.patchValue({
          name: data.name,
          description: data.description,
          isActive: data.isActive
        });
      },
      error: () => {
        this.showError('Error', 'Cannot load ingredient type');
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
      ? this.ingredientTypeService.update(this.id, payload)
      : this.ingredientTypeService.create(payload);

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
