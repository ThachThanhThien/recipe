import { Injectable, inject } from '@angular/core';
import { HttpEventType, HttpProgressEvent } from '@angular/common/http';
import { EMPTY, Observable, concatMap, from, map, of, switchMap } from 'rxjs';
import { GithubStore } from './github-store.service';
import { GoogleDrive, driveImageUrl, driveViewUrl } from './google-drive.service';

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
  private drive = inject(GoogleDrive);

  /** Where uploads go: Google Drive once it is set up (environment.googleDrive), else the repo. */
  readonly destination: 'drive' | 'github' = this.drive.isConfigured ? 'drive' : 'github';

  /**
   * Resizes the photo in the browser, then uploads it. With Google Drive, the photo is
   * shared as "Anyone with the link" and its Drive link is returned; otherwise it is
   * committed to the site's public/uploads/ folder and served as `/uploads/<file>`.
   */
  uploadImage(file: File): Observable<UploadProgress> {
    return from(shrinkImage(file)).pipe(
      switchMap((blob) => {
        const filename = `${Date.now().toString(36)}.${blob.type === 'image/webp' ? 'webp' : 'jpg'}`;
        return this.destination === 'drive' ? this.toDrive(blob, filename) : this.toGithub(blob, filename);
      }),
    );
  }

  /** A URL the browser can display: Drive links become direct image links, repo paths raw GitHub ones. */
  resolveUrl(url: string | null | undefined): string | null {
    if (!url) return null;
    const drive = driveImageUrl(url);
    if (drive) return drive;
    if (/^(https?:|data:|blob:)/i.test(url)) return url;
    return this.store.publicFileUrl(url);
  }

  private toDrive(blob: Blob, filename: string): Observable<UploadProgress> {
    return this.drive.upload(blob, filename).pipe(
      concatMap((event) => {
        if (event.type === HttpEventType.UploadProgress) return of(progressOf(event));
        if (event.type !== HttpEventType.Response || !event.body) return EMPTY;
        const { id } = event.body;
        return this.drive
          .shareWithAnyone(id)
          .pipe(map((): UploadProgress => ({ type: 'done', progress: 100, result: { url: driveViewUrl(id), filename } })));
      }),
    );
  }

  private toGithub(blob: Blob, filename: string): Observable<UploadProgress> {
    const url = `/uploads/${filename}`;
    return from(blobToBase64(blob)).pipe(
      switchMap((base64) => this.store.uploadPublicFile(url, base64, `Add photo ${filename}`)),
      map((event): UploadProgress => {
        if (event.type === HttpEventType.UploadProgress) return progressOf(event);
        if (event.type === HttpEventType.Response) {
          return { type: 'done', progress: 100, result: { url, filename } };
        }
        return { type: 'progress', progress: 0 };
      }),
    );
  }
}

function progressOf(event: HttpProgressEvent): UploadProgress {
  const total = event.total ?? 0;
  return { type: 'progress', progress: total > 0 ? Math.round((100 * event.loaded) / total) : 0 };
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
