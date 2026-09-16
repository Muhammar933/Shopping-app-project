import { apiClient } from './api';
import { TryOnSession } from '../types';

export const tryOnService = {
  async submitTryOn(productId: string, imageUri: string): Promise<TryOnSession> {
    const formData = new FormData();
    formData.append('productId', productId);

    const filename = imageUri.split('/').pop() || 'tryon.jpg';
    const match = /\.(\w+)$/.exec(filename);
    const type = match ? `image/${match[1]}` : 'image/jpeg';

    formData.append('image', {
      uri: imageUri,
      name: filename,
      type,
    } as any);

    const res: any = await apiClient.post('/try-on', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return res.data;
  },

  async getSessionStatus(sessionId: string): Promise<TryOnSession> {
    const res: any = await apiClient.get(`/try-on/${sessionId}`);
    return res.data;
  },
};
