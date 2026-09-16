import { z } from 'zod';

export const checkoutSchema = z.object({
  addressId: z.string().uuid('Valid address ID is required'),
});

export const updateOrderStatusSchema = z.object({
  status: z.enum(['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED']),
});
