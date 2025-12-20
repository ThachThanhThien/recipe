import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export abstract class ApiBaseService {
  protected http = inject(HttpClient);
  protected readonly apiUrl = environment.apiBaseUrl;

  protected buildUrl(path: string): string {
    return `${this.apiUrl}/${path}`;
  }
}
