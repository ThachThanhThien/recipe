import {
  Injectable,
  NestInterceptor,
  ExecutionContext,
  CallHandler,
} from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Injectable()
export class LanguageInterceptor implements NestInterceptor {
  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    const request = context.switchToHttp().getRequest();
    const lang = request.headers['x-lang'] || 'en';

    return next.handle().pipe(
      map((data) => {
        // Only transform if it's an array (list view)
        if (Array.isArray(data)) {
          return this.transform(data, lang);
        }
        return data;
      }),
    );
  }

  private transform(data: any, lang: string): any {
    if (Array.isArray(data)) {
      return data.map((item) => this.transform(item, lang));
    }

    if (data !== null && typeof data === 'object') {
      // If it looks like a Multilingual object: { [key: string]: string }
      // AND it's not a known non-multilingual object (like a Date or Entity)
      // Actually, we can check if it has properties that are all strings AND the keys look like language codes
      // But a more robust way is to check the structure.
      
      // Let's assume an object is Multilingual if it has 2-letter keys and string values
      // and it's being used where a title/name would be.
      // But wait, some entities might have many fields.
      
      const newData = { ...data };
      for (const key in newData) {
        const value = newData[key];
        
        if (this.isMultilingual(value)) {
          newData[key] = value[lang] || value['en'] || Object.values(value)[0] || '';
        } else if (typeof value === 'object' && value !== null) {
          newData[key] = this.transform(value, lang);
        }
      }
      return newData;
    }

    return data;
  }

  private isMultilingual(obj: any): boolean {
    if (obj === null || typeof obj !== 'object' || Array.isArray(obj)) {
      return false;
    }
    
    const keys = Object.keys(obj);
    if (keys.length === 0) return false;
    
    // Check if keys are likely language codes (2-3 chars) and values are strings
    return keys.every(k => typeof k === 'string' && k.length >= 2 && k.length <= 5) &&
           keys.every(k => typeof obj[k] === 'string');
  }
}
