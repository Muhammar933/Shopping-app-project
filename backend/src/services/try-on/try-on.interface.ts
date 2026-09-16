export interface TryOnInput {
  sessionId: string;
  userId: string;
  productId: string;
  productName: string;
  garmentImageUrl: string;
  userImageUrl: string;
}

export interface TryOnOutput {
  success: boolean;
  resultImageUrl: string;
  processingTimeMs: number;
}

export interface IVirtualTryOnService {
  generateTryOnLook(input: TryOnInput): Promise<TryOnOutput>;
}
