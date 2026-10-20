import { Injectable, inject } from '@angular/core';
import { HttpEventType } from '@angular/common/http';
import { Observable, from, map, switchMap } from 'rxjs';
import { GithubStore } from './github-store.service';

export interface UploadResult {
  url: string;
  filename: string;
}

export interface UploadProgress {
  type: 'progress' | 'done';
  progress: number;
  result?: UploadResult;
}

/** Longest side of a stored photo; phone photos are shrunk to this before upload. */
const MAX_SIDE = 1600;

@Injectable({ providedIn: 'root' })
export class UploadService {
  private store = inject(GithubStore);

  /**
   * Resizes the photo in the browser and commits it to the site's public/uploads/
   * folder. The returned url (`/uploads/<file>`) is served by recipe-site.
   */
  uploadImage(file: File): Observable<UploadProgress> {
    return from(shrinkImage(file)).pipe(
      switchMap(async (blob) => ({ blob, base64: await blobToBase64(blob) })),
      switchMap(({ blob, base64 }) => {
        const filename = `${Date.now().toString(36)}.${blob.type === 'image/webp' ? 'webp' : 'jpg'}`;
        const url = `/uploads/${filename}`;
        return this.store.uploadPublicFile(url, base64, `Add photo ${filename}`).pipe(
          map((event): UploadProgress => {
            if (event.type === HttpEventType.UploadProgress) {
              const total = event.total ?? 0;
              return { type: 'progress', progress: total > 0 ? Math.round((100 * event.loaded) / total) : 0 };
            }
            if (event.type === HttpEventType.Response) {
              return { type: 'done', progress: 100, result: { url, filename } };
            }
            return { type: 'progress', progress: 0 };
          }),
        );
      }),
    );
  }

  resolveUrl(url: string | null | undefined): string | null {
    if (!url) return null;
    if (/^(https?:|data:|blob:)/i.test(url)) return url;
    return this.store.publicFileUrl(url);
  }
}

async function shrinkImage(file: File): Promise<Blob> {
  const bitmap = await createImageBitmap(file);
  const scale = Math.min(1, MAX_SIDE / Math.max(bitmap.width, bitmap.height));
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(bitmap.width * scale);
  canvas.height = Math.round(bitmap.height * scale);
  canvas.getContext('2d')!.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
  bitmap.close();

  const webp = await encode(canvas, 'image/webp');
  // Browsers that can't encode WebP silently return PNG; JPEG is much smaller than that.
  return webp.type === 'image/webp' ? webp : encode(canvas, 'image/jpeg');
}

function encode(canvas: HTMLCanvasElement, type: string): Promise<Blob> {
  return new Promise((resolve, reject) =>
    canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Could not encode image'))), type, 0.82),
  );
}

function blobToBase64(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result).split(',')[1] ?? '');
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}
