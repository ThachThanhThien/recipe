import { Component, forwardRef, inject, Input, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { ProgressBarModule } from 'primeng/progressbar';
import { MessageModule } from 'primeng/message';
import { UploadService } from '../../../core/services/upload.service';

const MAX_BYTES = 5 * 1024 * 1024;
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp'];

@Component({
  selector: 'app-image-uploader',
  standalone: true,
  imports: [CommonModule, ButtonModule, ProgressBarModule, MessageModule],
  templateUrl: './image-uploader.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImageUploader),
      multi: true,
    },
  ],
})
export class ImageUploader implements ControlValueAccessor {
  @Input() label = 'Image';
  @Input() placeholderText = 'Drag & drop an image, or click to choose';
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  private uploadService = inject(UploadService);

  value: string | null = null;
  previewUrl: string | null = null;
  isDragging = false;
  isUploading = false;
  progress = 0;
  errorMessage: string | null = null;
  disabled = false;

  private onChange: (value: string | null) => void = () => {};
  private onTouched: () => void = () => {};

  writeValue(value: string | null): void {
    this.value = value ?? null;
    this.previewUrl = this.uploadService.resolveUrl(value);
    this.errorMessage = null;
  }

  registerOnChange(fn: (value: string | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.disabled = isDisabled;
  }

  openPicker(): void {
    if (this.disabled || this.isUploading) return;
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (file) this.handleFile(file);
    input.value = '';
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    if (this.disabled || this.isUploading) return;
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
  }

  onDrop(event: DragEvent): void {
    event.preventDefault();
    this.isDragging = false;
    if (this.disabled || this.isUploading) return;
    const file = event.dataTransfer?.files?.[0];
    if (file) this.handleFile(file);
  }

  clear(event?: Event): void {
    event?.stopPropagation();
    this.value = null;
    this.previewUrl = null;
    this.errorMessage = null;
    this.onChange(null);
    this.onTouched();
  }

  private handleFile(file: File): void {
    this.errorMessage = null;

    if (!ALLOWED_MIME.includes(file.type)) {
      this.errorMessage = 'Unsupported file type. Use JPEG, PNG, or WebP.';
      return;
    }
    if (file.size > MAX_BYTES) {
      this.errorMessage = `File too large. Max ${Math.round(MAX_BYTES / 1024 / 1024)} MB.`;
      return;
    }

    const localPreview = URL.createObjectURL(file);
    this.previewUrl = localPreview;
    this.isUploading = true;
    this.progress = 0;

    this.uploadService.uploadImage(file).subscribe({
      next: (event) => {
        this.progress = event.progress;
        if (event.type === 'done' && event.result) {
          this.value = event.result.url;
          this.previewUrl = this.uploadService.resolveUrl(event.result.url);
          this.isUploading = false;
          this.onChange(this.value);
          this.onTouched();
          URL.revokeObjectURL(localPreview);
        }
      },
      error: (err) => {
        this.isUploading = false;
        this.progress = 0;
        this.errorMessage = err?.error?.message || 'Upload failed. Please try again.';
        this.previewUrl = this.uploadService.resolveUrl(this.value);
        URL.revokeObjectURL(localPreview);
      },
    });
  }
}
