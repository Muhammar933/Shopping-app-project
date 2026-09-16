import { TryOnRepository } from '../repositories/try-on.repository.js';
import { ProductRepository } from '../repositories/product.repository.js';
import { IVirtualTryOnService } from './try-on/try-on.interface.js';
import { IStorageService } from './storage/storage.interface.js';

export class TryOnService {
  constructor(
    private tryOnRepo: TryOnRepository,
    private productRepo: ProductRepository,
    private virtualTryOnService: IVirtualTryOnService,
    private storageService: IStorageService
  ) {}

  async createSession(data: {
    userId: string;
    productId: string;
    imageBuffer: Buffer;
    fileName: string;
    mimeType: string;
  }) {
    // 1. Verify product exists
    const product = await this.productRepo.findById(data.productId);
    if (!product) {
      throw new Error('Product not found for Virtual Try-On');
    }

    // 2. Upload and store user photo via StorageService abstraction
    const inputImageUrl = await this.storageService.uploadFile(
      data.imageBuffer,
      data.fileName,
      data.mimeType
    );

    // 3. Create initial TryOnSession in DB
    const session = await this.tryOnRepo.createSession({
      userId: data.userId,
      productId: data.productId,
      inputImage: inputImageUrl,
    });

    // 4. Trigger asynchronous try-on processing
    this.processTryOnAsync(session.id, {
      userId: data.userId,
      productId: data.productId,
      productName: product.name,
      garmentImageUrl: product.images[0] || '',
      userImageUrl: inputImageUrl,
    });

    return session;
  }

  private async processTryOnAsync(sessionId: string, details: any) {
    try {
      await this.tryOnRepo.updateSessionStatus(sessionId, 'PROCESSING');

      const outcome = await this.virtualTryOnService.generateTryOnLook({
        sessionId,
        userId: details.userId,
        productId: details.productId,
        productName: details.productName,
        garmentImageUrl: details.garmentImageUrl,
        userImageUrl: details.userImageUrl,
      });

      if (outcome.success) {
        await this.tryOnRepo.saveResult(sessionId, outcome.resultImageUrl);
      } else {
        await this.tryOnRepo.updateSessionStatus(sessionId, 'FAILED');
      }
    } catch (err) {
      console.error(`[TryOnService] Processing failed for session ${sessionId}:`, err);
      await this.tryOnRepo.updateSessionStatus(sessionId, 'FAILED');
    }
  }

  async getSession(sessionId: string, userId?: string) {
    const session = await this.tryOnRepo.findById(sessionId, userId);
    if (!session) {
      throw new Error('Try-on session not found');
    }
    return session;
  }
}
