import { apiClient } from './api';
import { Cart } from '../types';

export const cartService = {
  async getCart(): Promise<Cart> {
    const res: any = await apiClient.get('/cart');
    return res.data;
  },

  async addItem(productId: string, variantId: string, quantity: number = 1): Promise<Cart> {
    const res: any = await apiClient.post('/cart/items', { productId, variantId, quantity });
    return res.data;
  },

  async updateQuantity(itemId: string, quantity: number): Promise<Cart> {
    const res: any = await apiClient.put(`/cart/items/${itemId}`, { quantity });
    return res.data;
  },

  async removeItem(itemId: string): Promise<Cart> {
    const res: any = await apiClient.delete(`/cart/items/${itemId}`);
    return res.data;
  },
};
