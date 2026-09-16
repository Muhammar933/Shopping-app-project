import { IVirtualTryOnService, TryOnInput, TryOnOutput } from './try-on.interface.js';

export class MockVirtualTryOnService implements IVirtualTryOnService {
  async generateTryOnLook(input: TryOnInput): Promise<TryOnOutput> {
    const startTime = Date.now();

    // Simulates neural network pose estimation & garment texture warping latency
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Curated high-resolution try-on demonstration render outputs matching Threadly's aesthetic
    const curatedTryOnRenders = [
      'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=1000&q=85',
      'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?w=1000&q=85',
      'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=1000&q=85',
      'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=1000&q=85',
      'https://images.unsplash.com/photo-1618354691373-d851c5c3a990?w=1000&q=85',
    ];

    // Selects a deterministic or curated render based on session id
    const index = Math.abs(input.sessionId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0)) % curatedTryOnRenders.length;
    const resultImageUrl = curatedTryOnRenders[index];

    return {
      success: true,
      resultImageUrl,
      processingTimeMs: Date.now() - startTime,
    };
  }
}
