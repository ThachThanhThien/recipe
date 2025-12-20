import { Directive, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MessageService } from 'primeng/api';

@Directive()
export abstract class AppComponentBase {
  protected messageService = inject(MessageService);

  protected formSubmitted = false;

  protected isInvalid(form: FormGroup, controlName: string): boolean {
    const control = form.get(controlName);
    return !!(
      control &&
      control.invalid &&
      (control.touched || this.formSubmitted)
    );
  }

  protected markFormSubmitted(): void {
    this.formSubmitted = true;
  }

  protected resetFormSubmitted(): void {
    this.formSubmitted = false;
  }

  protected showSuccess(summary: string, detail?: string): void {
    this.messageService.add({
      severity: 'success',
      summary,
      detail,
    });
  }

  protected showError(summary: string, detail?: string): void {
    this.messageService.add({
      severity: 'error',
      summary,
      detail,
      key: 'br',
    });
  }

  protected showWarn(summary: string, detail?: string): void {
    this.messageService.add({
      severity: 'warn',
      summary,
      detail,
      key: 'br',
    });
  }

  protected showInfo(summary: string, detail?: string): void {
    this.messageService.add({
      severity: 'info',
      summary,
      detail,
      key: 'br',
    });
  }
}
