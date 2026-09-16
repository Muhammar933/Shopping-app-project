import { OrderRepository } from '../repositories/order.repository.js';
import { CartService } from './cart.service.js';
import { IPaymentService } from './payment/payment.interface.js';
import { CartRepository } from '../repositories/cart.repository.js';
import { OrderStatus } from '@prisma/client';

export class OrderService {
  constructor(
    private orderRepo: OrderRepository,
    private cartService: CartService,
    private cartRepo: CartRepository,
    private paymentService: IPaymentService
  ) {}

  async checkoutAndCreateOrder(userId: string, addressId: string) {
    // 1. Fetch current cart
    const cart = await this.cartService.getCart(userId);

    if (cart.items.length === 0) {
      throw new Error('Your cart is empty');
    }

    // 2. Verify all items are in stock
    for (const item of cart.items) {
      if (!item.inStock) {
        throw new Error(`Item ${item.productName} (${item.size}, ${item.colorName}) is out of stock`);
      }
    }

    // 3. Process payment via IPaymentService abstraction
    const paymentResult = await this.paymentService.processPayment({
      amount: cart.total,
      currency: 'USD',
      orderId: `TMP-${Date.now()}`,
      userId,
    });

    if (!paymentResult.success) {
      throw new Error('Payment authorization failed');
    }

    // 4. Create persistent order records
    const order = await this.orderRepo.createOrder({
      userId,
      addressId,
      subtotal: cart.subtotal,
      shippingFee: cart.shippingFee,
      total: cart.total,
      items: cart.items.map((i) => ({
        productId: i.productId,
        variantId: i.variantId,
        unitPrice: i.unitPrice,
        quantity: i.quantity,
      })),
      payment: {
        provider: paymentResult.provider,
        transactionId: paymentResult.transactionId,
        amount: paymentResult.amount,
        status: paymentResult.status,
      },
    });

    // 5. Clear user cart
    await this.cartRepo.clearCart(cart.cartId);

    return order;
  }

  async getUserOrders(userId: string) {
    return this.orderRepo.findByUserId(userId);
  }

  async getOrderById(orderId: string, userId?: string) {
    const order = await this.orderRepo.findById(orderId, userId);
    if (!order) {
      throw new Error('Order not found');
    }
    return order;
  }

  async updateOrderStatus(orderId: string, status: OrderStatus) {
    return this.orderRepo.updateStatus(orderId, status);
  }
}
