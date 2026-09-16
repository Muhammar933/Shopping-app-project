import { z } from 'zod';

export const addToCartSchema = z.object({
  productId: z.string().uuid('Invalid product ID'),
  variantId: z.string().uuid('Invalid variant ID'),
  quantity: z.number().int().min(1, 'Quantity must be at least 1').max(10, 'Max 10 per item'),
});

export const updateCartItemSchema = z.object({
  quantity: z.number().int().min(0, 'Quantity cannot be negative').max(10, 'Max 10 per item'),
});
