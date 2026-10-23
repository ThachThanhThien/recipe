import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, shareReplay, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

/** Only files this app creates — the portal can't see anything else in the Drive. */
const SCOPE = 'https://www.googleapis.com/auth/drive.file';
const API = 'https://www.googleapis.com/drive/v3';
const UPLOAD_API = 'https://www.googleapis.com/upload/drive/v3';
const GIS_SRC = 'https://accounts.google.com/gsi/client';
const FOLDER_MIME = 'application/vnd.google-apps.folder';
const TOKEN_KEY = 'google_drive_token';
/** Treat a token as expired a minute early, so an upload never starts with a dying one. */
const EXPIRY_MARGIN_MS = 60_000;

interface DriveToken {
  accessToken: string;
  expiresAt: number;
}

export interface DriveFile {
  id: string;
}

// The parts of Google Identity Services (accounts.google.com/gsi/client) used here.
interface TokenResponse {
  access_token: string;
  expires_in: number | string;
  scope: string;
  error?: string;
  error_description?: string;
}

interface Oauth2 {
  initTokenClient(config: {
    client_id: string;
    scope: string;
    callback: (response: TokenResponse) => void;
    error_callback?: (error: { type: string }) => void;
  }): { requestAccessToken(): void };
  hasGrantedAllScopes(response: TokenResponse, ...scopes: string[]): boolean;
  revoke(accessToken: string, done?: () => void): void;
}

/**
 * Recipe photos live in a folder of the editor's Google Drive, each shared as
 * "Anyone with the link" so the public site can show it. Signing in uses Google's
 * token popup; the hour-long access token is kept on this device.
 */
@Injectable({ providedIn: 'root' })
export class GoogleDrive {
  private http = inject(HttpClient);
  private readonly cfg = environment.googleDrive;
  private folder$: Observable<string> | null = null;

  readonly isConfigured = !!this.cfg.clientId;
  readonly folderName = this.cfg.folderName;
  readonly token = signal<DriveToken | null>(readToken());

  isConnected(): boolean {
    const token = this.token();
    return !!token && token.expiresAt - EXPIRY_MARGIN_MS > Date.now();
  }

  /** Loads Google's sign-in script ahead of time, so `connect()` can open its popup straight away. */
  preload(): void {
    if (this.isConfigured) loadGis().catch(() => undefined);
  }

  /**
   * Opens Google's sign-in popup. Call it from a click handler — browsers block
   * popups that don't follow a user action.
   */
  connect(): Promise<void> {
    if (!this.isConfigured) return Promise.reject(new Error('Google Drive is not set up for this portal.'));
    return loadGis().then(
      () =>
        new Promise<void>((resolve, reject) => {
          const client = oauth2().initTokenClient({
            client_id: this.cfg.clientId,
            scope: SCOPE,
            callback: (response) => {
              if (response.error) {
                reject(new Error(response.error_description || `Google sign-in failed (${response.error}).`));
              } else if (!oauth2().hasGrantedAllScopes(response, SCOPE)) {
                reject(new Error('Google Drive access was not allowed. Sign in again and tick the Drive permission.'));
              } else {
                this.saveToken({
                  accessToken: response.access_token,
                  expiresAt: Date.now() + Number(response.expires_in) * 1000,
                });
                resolve();
              }
            },
            error_callback: (error) =>
              reject(
                new Error(
                  error.type === 'popup_closed'
                    ? 'The Google sign-in window was closed before finishing.'
                    : 'Could not open the Google sign-in window. Allow pop-ups for this site and try again.',
                ),
              ),
          });
          client.requestAccessToken();
        }),
    );
  }

  disconnect(): void {
    const token = this.token();
    if (token && window.google?.accounts) oauth2().revoke(token.accessToken);
    this.saveToken(null);
  }

  /** Uploads a photo into the photos folder, reporting upload progress. */
  upload(blob: Blob, name: string): Observable<HttpEvent<DriveFile>> {
    return this.folderId().pipe(
      switchMap((folderId) => {
        // Any string that can't appear in the photo bytes' framing will do. (crypto.randomUUID
        // only exists on https/localhost pages.)
        const boundary = `recipe-${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`;
        const metadata = { name, mimeType: blob.type, parents: [folderId] };
        const body = new Blob([
          `--${boundary}\r\nContent-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n`,
          `--${boundary}\r\nContent-Type: ${blob.type}\r\n\r\n`,
          blob,
          `\r\n--${boundary}--`,
        ]);
        return this.http.post<DriveFile>(`${UPLOAD_API}/files?uploadType=multipart&fields=id`, body, {
          headers: this.headers().set('Content-Type', `multipart/related; boundary=${boundary}`),
          reportProgress: true,
          observe: 'events',
        });
      }),
      catchError((err) => this.fail(err)),
    );
  }

  /** Lets anyone with the link view the file — the public site has no Google sign-in. */
  shareWithAnyone(fileId: string): Observable<void> {
    return this.http
      .post(`${API}/files/${fileId}/permissions`, { type: 'anyone', role: 'reader' }, { headers: this.headers() })
      .pipe(
        map(() => undefined),
        catchError((err) => this.fail(err)),
      );
  }

  /** The app's photos folder, created on first use. Only folders this app made are visible to it. */
  private folderId(): Observable<string> {
    if (!this.folder$) {
      const q = `name = '${this.folderName.replace(/['\\]/g, '\\$&')}' and mimeType = '${FOLDER_MIME}' and trashed = false`;
      this.folder$ = this.http
        .get<{ files: DriveFile[] }>(`${API}/files`, {
          headers: this.headers(),
          params: { q, fields: 'files(id)', pageSize: 1, spaces: 'drive' },
        })
        .pipe(
          switchMap((res) =>
            res.files.length
              ? of(res.files[0].id)
              : this.http
                  .post<DriveFile>(`${API}/files?fields=id`, { name: this.folderName, mimeType: FOLDER_MIME }, {
                    headers: this.headers(),
                  })
                  .pipe(map((folder) => folder.id)),
          ),
          catchError((err) => {
            this.folder$ = null;
            return throwError(() => err);
          }),
          shareReplay(1),
        );
    }
    return this.folder$;
  }

  private saveToken(token: DriveToken | null): void {
    if (token) localStorage.setItem(TOKEN_KEY, JSON.stringify(token));
    else localStorage.removeItem(TOKEN_KEY);
    this.token.set(token);
    // A different sign-in may be a different Drive, with its own folder.
    this.folder$ = null;
  }

  private headers(): HttpHeaders {
    return new HttpHeaders({ Authorization: `Bearer ${this.token()?.accessToken ?? ''}` });
  }

  /** Turns Drive API errors into messages an editor can act on. */
  private fail(err: unknown): Observable<never> {
    if (!(err instanceof HttpErrorResponse)) return throwError(() => err);
    if (err.status === 401) {
      this.saveToken(null);
      return throwError(() => new Error('Your Google sign-in has expired. Sign in again to upload.'));
    }
    const detail: string | undefined = err.error?.error?.message;
    return throwError(() => new Error(detail ? `Google Drive: ${detail}` : `Google Drive request failed (${err.status}).`));
  }
}

/** Drive's viewer link for a file — what recipes store. The site turns it into an image URL. */
export function driveViewUrl(fileId: string): string {
  return `https://drive.google.com/file/d/${fileId}/view`;
}

// Same rule as recipe-site/src/lib/image.ts, which serves these links on the public site.
const DRIVE_LINK =
  /^https?:\/\/(?:drive|docs)\.google\.com\/(?:file\/d\/([\w-]{10,})|(?:open|uc|thumbnail)\?(?:[^#]*&)?id=([\w-]{10,}))/i;

/** A direct image URL for a Google Drive share link, or null for any other URL. */
export function driveImageUrl(url: string): string | null {
  const match = url.match(DRIVE_LINK);
  const id = match ? (match[1] ?? match[2]) : null;
  return id ? `https://lh3.googleusercontent.com/d/${id}=w1600` : null;
}

function readToken(): DriveToken | null {
  try {
    const token = JSON.parse(localStorage.getItem(TOKEN_KEY) ?? 'null') as DriveToken | null;
    return token?.accessToken && token.expiresAt > Date.now() ? token : null;
  } catch {
    return null;
  }
}

declare global {
  interface Window {
    google?: { accounts?: { oauth2: Oauth2 } };
  }
}

function oauth2(): Oauth2 {
  return window.google!.accounts!.oauth2;
}

let gisLoading: Promise<void> | null = null;

function loadGis(): Promise<void> {
  if (window.google?.accounts) return Promise.resolve();
  gisLoading ??= new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    script.src = GIS_SRC;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = () => {
      gisLoading = null;
      script.remove();
      reject(new Error('Could not load Google sign-in. Check your connection and try again.'));
    };
    document.head.appendChild(script);
  });
  return gisLoading;
}
