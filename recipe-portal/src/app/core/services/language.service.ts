import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LanguageService {
  private readonly STORAGE_KEY = 'app_language';
  
  // Use a signal for easier reactivity in Angular 18+
  currentLanguage = signal<string>(localStorage.getItem(this.STORAGE_KEY) || 'en');

  setLanguage(lang: string) {
    localStorage.setItem(this.STORAGE_KEY, lang);
    this.currentLanguage.set(lang);
  }

  getLanguage(): string {
    return this.currentLanguage();
  }
}
