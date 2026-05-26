import { Injectable } from '@angular/core';
import { HttpEvent, HttpEventType } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { ApiBaseService } from './api-base.service';

export interface UploadResult {
  url: string;
  filename: string;
}

export interface UploadProgress {
  type: 'progress' | 'done';
  progress: number;
  result?: UploadResult;
}

@Injectable({ providedIn: 'root' })
export class UploadService extends ApiBaseService {
  uploadImage(file: File): Observable<UploadProgress> {
    const form = new FormData();
    form.append('file', file);

    return this.http
      .post<UploadResult>(this.buildUrl('upload/image'), form, {
        reportProgress: true,
        observe: 'events',
      })
      .pipe(
        map((event: HttpEvent<UploadResult>) => {
          if (event.type === HttpEventType.UploadProgress) {
            const total = event.total ?? 0;
            const progress = total > 0 ? Math.round((100 * event.loaded) / total) : 0;
            return { type: 'progress' as const, progress };
          }
          if (event.type === HttpEventType.Response && event.body) {
            return { type: 'done' as const, progress: 100, result: event.body };
          }
          return { type: 'progress' as const, progress: 0 };
        }),
      );
  }

  resolveUrl(url: string | null | undefined): string | null {
    if (!url) return null;
    if (/^https?:\/\//i.test(url)) return url;
    return `${this.apiUrl}${url.startsWith('/') ? '' : '/'}${url}`;
  }
}
