import fs from 'fs';
import path from 'path';
import { IStorageService } from './storage.interface.js';
import { config } from '../../config/env.js';

export class LocalStorageService implements IStorageService {
  private baseDir: string;

  constructor() {
    this.baseDir = config.uploadDir;
    if (!fs.existsSync(this.baseDir)) {
      fs.mkdirSync(this.baseDir, { recursive: true });
    }
  }

  async uploadFile(fileBuffer: Buffer, originalName: string, mimeType: string): Promise<string> {
    const ext = path.extname(originalName) || (mimeType === 'image/png' ? '.png' : '.jpg');
    const safeName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}${ext}`;
    const destination = path.join(this.baseDir, safeName);

    await fs.promises.writeFile(destination, fileBuffer);
    // Returns relative static path served by Express
    return `/uploads/${safeName}`;
  }

  async deleteFile(fileUrl: string): Promise<boolean> {
    try {
      const fileName = path.basename(fileUrl);
      const filePath = path.join(this.baseDir, fileName);
      if (fs.existsSync(filePath)) {
        await fs.promises.unlink(filePath);
        return true;
      }
      return false;
    } catch {
      return false;
    }
  }
}
