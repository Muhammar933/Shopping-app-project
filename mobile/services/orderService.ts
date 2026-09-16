import { apiClient } from './api';
import { Order } from '../types';

export const orderService = {
  async checkout(addressId: string): Promise<Order> {
    const res: any = await apiClient.post('/orders', { addressId });
    return res.data;
  },

  async getOrders(): Promise<Order[]> {
    const res: any = await apiClient.get('/orders');
    return res.data;
  },

  async getOrderById(id: string): Promise<Order> {
    const res: any = await apiClient.get(`/orders/${id}`);
    return res.data;
  },
};
