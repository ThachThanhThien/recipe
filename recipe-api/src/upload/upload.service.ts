import { Injectable } from '@nestjs/common';
import { extname, join } from 'path';
import { promises as fs } from 'fs';
import { randomUUID } from 'crypto';

@Injectable()
export class UploadService {
  private readonly uploadsRoot = join(process.cwd(), 'uploads');
  private readonly recipesDir = join(this.uploadsRoot, 'recipes');

  async ensureDirs(): Promise<void> {
    await fs.mkdir(this.recipesDir, { recursive: true });
  }

  generateFilename(originalName: string): string {
    const ext = extname(originalName).toLowerCase() || '.bin';
    return `${randomUUID()}${ext}`;
  }

  async saveRecipeImage(file: Express.Multer.File): Promise<{ url: string; filename: string }> {
    await this.ensureDirs();
    const filename = this.generateFilename(file.originalname);
    const dest = join(this.recipesDir, filename);
    await fs.writeFile(dest, file.buffer);
    return { url: `/uploads/recipes/${filename}`, filename };
  }

  async deleteByUrl(url: string): Promise<boolean> {
    if (!url || !url.startsWith('/uploads/')) return false;
    const relative = url.replace(/^\/uploads\//, '');
    const safePath = join(this.uploadsRoot, relative);
    if (!safePath.startsWith(this.uploadsRoot)) return false;
    try {
      await fs.unlink(safePath);
      return true;
    } catch {
      return false;
    }
  }
}
