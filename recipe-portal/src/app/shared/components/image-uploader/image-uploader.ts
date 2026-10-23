import { Component, forwardRef, inject, Input, OnDestroy, OnInit, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ProgressBarModule } from 'primeng/progressbar';
import { MessageModule } from 'primeng/message';
import { UploadService } from '../../../core/services/upload.service';
import { GoogleDrive } from '../../../core/services/google-drive.service';

const MAX_BYTES = 25 * 1024 * 1024;
const ALLOWED_MIME = ['image/jpeg', 'image/png', 'image/webp'];

@Component({
  selector: 'app-image-uploader',
  standalone: true,
  imports: [CommonModule, ButtonModule, InputTextModule, ProgressBarModule, MessageModule],
  templateUrl: './image-uploader.html',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImageUploader),
      multi: true,
    },
  ],
})
export class ImageUploader implements ControlValueAccessor, OnInit, OnDestroy {
  @Input() label = 'Image';
  @Input() placeholderText = 'Drag & drop an image, or click to choose';
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  private uploadService = inject(UploadService);
  protected drive = inject(GoogleDrive);
  protected readonly destination = this.uploadService.destination;

  value: string | null = null;
  previewUrl: string | null = null;
  isDragging = false;
  isUploading = false;
  isSigningIn = false;
  progress = 0;
  errorMessage: string | null = null;
  disabled = false;
  /** A photo waiting for Google sign-in before it can be uploaded to Drive. */
  pendingFile: File | null = null;

  private localPreview: string | null = null;
  private onChange: (value: string | null) => void = () => {};
  private onTouched: () => void = () => {};

  ngOnInit(): void {
    if (this.destination === 'drive') this.drive.preload();
  }

  ngOnDestroy(): void {
    this.dropLocalPreview();
  }

  writeValue(value: string | null): void {
    this.value = value ?? null;
    this.pendingFile = null;
    this.dropLocalPreview();
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
    this.pendingFile = null;
    this.dropLocalPreview();
    this.previewUrl = null;
    this.errorMessage = null;
    this.onChange(null);
    this.onTouched();
  }

  /** Runs from the "Sign in with Google" click, so the browser allows Google's popup. */
  signInAndUpload(event: Event): void {
    event.stopPropagation();
    this.isSigningIn = true;
    this.errorMessage = null;
    this.drive
      .connect()
      .then(() => {
        const file = this.pendingFile;
        this.pendingFile = null;
        if (file) this.upload(file);
      })
      .catch((err: Error) => (this.errorMessage = err.message))
      .finally(() => (this.isSigningIn = false));
  }

  /** A photo already online: a Google Drive share link (shared as "Anyone with the link") or any https image. */
  useLink(raw: string): void {
    const url = raw.trim();
    if (!url) return;
    if (!/^https:\/\/\S+$/i.test(url)) {
      this.errorMessage = 'Paste a full link starting with https://';
      return;
    }
    this.value = url;
    this.pendingFile = null;
    this.dropLocalPreview();
    this.previewUrl = this.uploadService.resolveUrl(url);
    this.errorMessage = null;
    this.onChange(url);
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

    this.showLocalPreview(file);
    if (this.destination === 'drive' && !this.drive.isConnected()) {
      // Opening Google's popup now would be blocked: a file pick or drop doesn't count as a click.
      this.pendingFile = file;
      return;
    }
    this.upload(file);
  }

  private upload(file: File): void {
    this.isUploading = true;
    this.progress = 0;

    this.uploadService.uploadImage(file).subscribe({
      next: (event) => {
        this.progress = event.progress;
        if (event.type === 'done' && event.result) {
          this.value = event.result.url;
          this.dropLocalPreview();
          this.previewUrl = this.uploadService.resolveUrl(event.result.url);
          this.isUploading = false;
          this.onChange(this.value);
          this.onTouched();
        }
      },
      error: (err) => {
        this.isUploading = false;
        this.progress = 0;
        this.errorMessage =
          err?.error?.message || (err instanceof HttpErrorResponse ? null : err?.message) || 'Upload failed. Please try again.';
        if (this.destination === 'drive' && !this.drive.isConnected()) {
          // The sign-in expired mid-way: keep the photo so one click can retry.
          this.pendingFile = file;
          return;
        }
        this.dropLocalPreview();
        this.previewUrl = this.uploadService.resolveUrl(this.value);
      },
    });
  }

  private showLocalPreview(file: File): void {
    this.dropLocalPreview();
    this.localPreview = URL.createObjectURL(file);
    this.previewUrl = this.localPreview;
  }

  private dropLocalPreview(): void {
    if (this.localPreview) URL.revokeObjectURL(this.localPreview);
    this.localPreview = null;
  }
}
