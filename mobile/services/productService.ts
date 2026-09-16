import { apiClient } from './api';
import { Product, Category } from '../types';

export interface ProductFilters {
  category?: string;
  search?: string;
  isFeatured?: boolean;
  isBestSeller?: boolean;
  isNew?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}

export const productService = {
  async getProducts(params?: ProductFilters): Promise<Product[]> {
    const res: any = await apiClient.get('/products', { params });
    return res.data;
  },

  async getProductById(id: string): Promise<Product> {
    const res: any = await apiClient.get(`/products/${id}`);
    return res.data;
  },

  async getCategories(): Promise<Category[]> {
    const res: any = await apiClient.get('/categories');
    return res.data;
  },
};
