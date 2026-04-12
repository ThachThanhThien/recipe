import { Component, Input, forwardRef, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { 
  ControlValueAccessor, 
  NG_VALUE_ACCESSOR, 
  NG_VALIDATORS,
  FormsModule, 
  ReactiveFormsModule,
  FormBuilder,
  FormGroup,
  Validators,
  Validator,
  AbstractControl,
  ValidationErrors
} from '@angular/forms';
import { TabsModule } from 'primeng/tabs';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { EditorModule } from 'primeng/editor';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'app-multilingual-input',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    TabsModule,
    InputTextModule,
    TextareaModule,
    EditorModule,
    MessageModule
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => MultilingualInput),
      multi: true
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => MultilingualInput),
      multi: true
    }
  ],
  templateUrl: './multilingual-input.html'
})
export class MultilingualInput implements ControlValueAccessor, Validator, OnInit {
  @Input() label: string = '';
  @Input() type: 'text' | 'textarea' | 'editor' = 'text';
  @Input() locales: string[] = ['en', 'vi']; // Default to what we have
  @Input() required: boolean = false;
  @Input() rows: number = 3;
  @Input() placeholder: string = '';

  form: FormGroup;
  private fb = inject(FormBuilder);

  onChange: any = () => {};
  onTouched: any = () => {};

  constructor() {
    this.form = this.fb.group({});
  }

  ngOnInit(): void {
    const group: any = {};
    for (const locale of this.locales) {
      group[locale] = [
        '', 
        this.required ? Validators.required : []
      ];
    }
    this.form = this.fb.group(group);

    this.form.valueChanges.subscribe(value => {
      // Only emit the locales we support
      const filteredValue: any = {};
      this.locales.forEach(l => {
        filteredValue[l] = value[l] || '';
      });
      this.onChange(filteredValue);
    });
  }

  validate(control: AbstractControl): ValidationErrors | null {
    return this.form.invalid ? { multilingualInvalid: true } : null;
  }

  writeValue(value: any): void {
    if (value && typeof value === 'object') {
      const patchValue: any = {};
      this.locales.forEach(l => {
        patchValue[l] = value[l] || '';
      });
      this.form.patchValue(patchValue, { emitEvent: false });
    } else {
      this.form.reset({}, { emitEvent: false });
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    if (isDisabled) {
      this.form.disable();
    } else {
      this.form.enable();
    }
  }

  getLocaleLabel(code: string): string {
    const labels: any = {
      en: 'English',
      vi: 'Tiếng Việt',
      fr: 'Français'
    };
    return labels[code] || code.toUpperCase();
  }

  isLocaleInvalid(locale: string): boolean {
    const control = this.form.get(locale);
    return !!(control && control.invalid && (control.touched || control.dirty));
  }
}
