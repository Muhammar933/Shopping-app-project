import { CartRepository } from '../repositories/cart.repository.js';
import { PrismaClient } from '@prisma/client';

export class CartService {
  constructor(
    private cartRepo: CartRepository,
    private prisma: PrismaClient
  ) {}

  async getCart(userId: string) {
    const cart = await this.cartRepo.getOrCreateCart(userId);

    // Calculate totals securely on backend
    let subtotal = 0;
    const items = cart.items.map((item) => {
      // Use discount price if available, otherwise regular price
      const unitPrice = item.product.discountPrice
        ? Number(item.product.discountPrice)
        : Number(item.product.price);
      const lineTotal = unitPrice * item.quantity;
      subtotal += lineTotal;

      return {
        id: item.id,
        productId: item.productId,
        productName: item.product.name,
        productImage: item.product.images[0] || '',
        variantId: item.variantId,
        size: item.variant.size,
        colorName: item.variant.colorName,
        colorHex: item.variant.colorHex,
        quantity: item.quantity,
        unitPrice,
        lineTotal,
        inStock: item.variant.stock >= item.quantity,
      };
    });

    const shippingFee = subtotal > 100 || subtotal === 0 ? 0 : 10.00;
    const total = subtotal + shippingFee;

    return {
      cartId: cart.id,
      items,
      itemCount: items.reduce((acc, curr) => acc + curr.quantity, 0),
      subtotal,
      shippingFee,
      total,
    };
  }

  async addItem(userId: string, productId: string, variantId: string, quantity: number) {
    // 1. Verify variant exists and has sufficient inventory
    const variant = await this.prisma.productVariant.findUnique({
      where: { id: variantId },
    });

    if (!variant || variant.productId !== productId) {
      throw new Error('Invalid product or variant selection');
    }

    if (variant.stock < quantity) {
      throw new Error(`Insufficient stock. Only ${variant.stock} available.`);
    }

    const cart = await this.cartRepo.getOrCreateCart(userId);
    await this.cartRepo.addItem(cart.id, productId, variantId, quantity);

    return this.getCart(userId);
  }

  async updateItemQuantity(userId: string, itemId: string, quantity: number) {
    if (quantity <= 0) {
      await this.cartRepo.removeItem(itemId);
    } else {
      await this.cartRepo.updateItemQuantity(itemId, quantity);
    }
    return this.getCart(userId);
  }

  async removeItem(userId: string, itemId: string) {
    await this.cartRepo.removeItem(itemId);
    return this.getCart(userId);
  }
}
