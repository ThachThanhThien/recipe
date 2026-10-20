import { Injectable, inject, signal } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpEvent, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, of, throwError } from 'rxjs';
import { catchError, map, shareReplay, switchMap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

/** JSON collections stored under `environment.github.dataDir`. */
export type DataFile = 'recipes' | 'ingredients' | 'ingredient-types';

interface LoadedFile {
  items: unknown[];
  sha: string;
}

interface ContentsResponse {
  sha: string;
  content: string;
  encoding: string;
}

interface PutResponse {
  content: { sha: string };
}

const TOKEN_KEY = 'github_token';
const API = 'https://api.github.com';

/**
 * The portal's "database": JSON files in the GitHub repo, read and committed through
 * the GitHub REST API with a fine-grained personal access token kept on this device.
 * Each file is fetched once, then kept in memory and updated after every save.
 */
@Injectable({ providedIn: 'root' })
export class GithubStore {
  private http = inject(HttpClient);
  private router = inject(Router);
  private readonly cfg = environment.github;
  private readonly repoUrl = `${API}/repos/${this.cfg.owner}/${this.cfg.repo}`;
  private files = new Map<DataFile, Observable<LoadedFile>>();

  readonly repoName = `${this.cfg.owner}/${this.cfg.repo}`;
  readonly token = signal<string | null>(localStorage.getItem(TOKEN_KEY));

  /** Checks the token works for this repo, then remembers it on this device. */
  connect(token: string): Observable<void> {
    return this.http
      .get<{ permissions?: { push?: boolean } }>(this.repoUrl, { headers: this.headers(token) })
      .pipe(
        map((repo) => {
          if (repo.permissions && !repo.permissions.push) {
            throw new Error(`This token's account cannot push to ${this.repoName}.`);
          }
          localStorage.setItem(TOKEN_KEY, token);
          this.token.set(token);
          this.files.clear();
        }),
      );
  }

  disconnect(): void {
    localStorage.removeItem(TOKEN_KEY);
    this.token.set(null);
    this.files.clear();
  }

  /** Current contents of a data file. Callers get a copy they may change freely. */
  read<T>(file: DataFile): Observable<T[]> {
    return this.load(file).pipe(map((f) => structuredClone(f.items) as T[]));
  }

  /**
   * Applies `change` to the latest contents and commits the result. If the file was
   * committed elsewhere in the meantime (stale sha), reloads it once and re-applies.
   * `change` may throw to reject the edit (e.g. a validation error).
   */
  write<T>(file: DataFile, change: (items: T[]) => T[], message: string): Observable<T[]> {
    const attempt = (canRetry: boolean): Observable<T[]> =>
      this.load(file).pipe(
        switchMap((current) => {
          const items = change(structuredClone(current.items) as T[]);
          const body = encodeUtf8(JSON.stringify(items, null, 2) + '\n');
          return this.putFile(this.dataPath(file), body, message, current.sha).pipe(
            map((res) => {
              this.files.set(file, of({ items, sha: res.content.sha }));
              return structuredClone(items);
            }),
          );
        }),
        catchError((err) => {
          if (canRetry && err instanceof HttpErrorResponse && (err.status === 409 || err.status === 422)) {
            this.files.delete(file);
            return attempt(false);
          }
          return throwError(() => err);
        }),
      );
    return attempt(true);
  }

  /** Commits a new file under the site's public folder, reporting upload progress. */
  uploadPublicFile(sitePath: string, contentBase64: string, message: string): Observable<HttpEvent<PutResponse>> {
    return this.http
      .put<PutResponse>(
        `${this.repoUrl}/contents/${this.cfg.publicDir}${sitePath}`,
        { message, content: contentBase64, branch: this.cfg.branch },
        { headers: this.headers(), reportProgress: true, observe: 'events' },
      )
      .pipe(catchError((err) => this.handleAuthError(err)));
  }

  /** Previews a file from the site's public folder straight from GitHub, before the site has rebuilt. */
  publicFileUrl(sitePath: string): string {
    const path = sitePath.startsWith('/') ? sitePath : `/${sitePath}`;
    return `https://raw.githubusercontent.com/${this.repoName}/${this.cfg.branch}/${this.cfg.publicDir}${path}`;
  }

  private load(file: DataFile): Observable<LoadedFile> {
    let cached = this.files.get(file);
    if (!cached) {
      cached = this.getFile(this.dataPath(file)).pipe(
        map(({ text, sha }) => ({ items: JSON.parse(text) as unknown[], sha })),
        catchError((err) => {
          this.files.delete(file);
          return throwError(() => err);
        }),
        shareReplay(1),
      );
      this.files.set(file, cached);
    }
    return cached;
  }

  private getFile(path: string): Observable<{ text: string; sha: string }> {
    // GitHub lets browsers cache this response for 60 s; a stale copy right after a
    // save would also carry a stale sha and make the next commit conflict.
    const url = `${this.repoUrl}/contents/${path}?ref=${this.cfg.branch}&t=${Date.now()}`;
    return this.http.get<ContentsResponse>(url, { headers: this.headers() }).pipe(
      switchMap((res) =>
        res.encoding === 'base64' && res.content
          ? of({ text: decodeUtf8(res.content), sha: res.sha })
          : // Files over 1 MB come back without content; their blob is fetched separately.
            this.http
              .get<{ content: string }>(`${this.repoUrl}/git/blobs/${res.sha}`, { headers: this.headers() })
              .pipe(map((blob) => ({ text: decodeUtf8(blob.content), sha: res.sha }))),
      ),
      catchError((err) => this.handleAuthError(err)),
    );
  }

  private putFile(path: string, contentBase64: string, message: string, sha: string): Observable<PutResponse> {
    return this.http
      .put<PutResponse>(
        `${this.repoUrl}/contents/${path}`,
        { message, content: contentBase64, sha, branch: this.cfg.branch },
        { headers: this.headers() },
      )
      .pipe(catchError((err) => this.handleAuthError(err)));
  }

  private dataPath(file: DataFile): string {
    return `${this.cfg.dataDir}/${file}.json`;
  }

  private headers(token = this.token()): HttpHeaders {
    return new HttpHeaders({
      Accept: 'application/vnd.github+json',
      Authorization: `Bearer ${token ?? ''}`,
      'X-GitHub-Api-Version': '2022-11-28',
    });
  }

  /** An expired or revoked token sends the user back to the connect page. */
  private handleAuthError(err: unknown): Observable<never> {
    if (err instanceof HttpErrorResponse && err.status === 401) {
      this.disconnect();
      this.router.navigate(['/connect']);
    }
    return throwError(() => err);
  }
}

/** Next free numeric id, matching the auto-increment ids the data was created with. */
export function nextId(items: { id: number }[]): number {
  return items.reduce((max, item) => Math.max(max, item.id), 0) + 1;
}

/** Picks one language from a `{ en, vi }` value, falling back to English, then any. */
export function localize(value: unknown, lang: string): string {
  if (value == null) return '';
  if (typeof value === 'string') return value;
  const texts = value as Record<string, string>;
  return texts[lang] || texts['en'] || Object.values(texts)[0] || '';
}

export function findById<T extends { id: number }>(items: T[], id: number, kind: string): T {
  const item = items.find((i) => i.id === Number(id));
  if (!item) throw new Error(`${kind} #${id} not found`);
  return item;
}

function encodeUtf8(text: string): string {
  const bytes = new TextEncoder().encode(text);
  let binary = '';
  // Chunked: spreading a few hundred KB into fromCharCode would overflow the stack.
  for (let i = 0; i < bytes.length; i += 0x8000) {
    binary += String.fromCharCode(...bytes.subarray(i, i + 0x8000));
  }
  return btoa(binary);
}

function decodeUtf8(base64: string): string {
  const binary = atob(base64.replace(/\s/g, ''));
  return new TextDecoder().decode(Uint8Array.from(binary, (c) => c.charCodeAt(0)));
}
