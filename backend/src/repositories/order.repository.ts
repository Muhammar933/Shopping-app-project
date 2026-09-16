import { PrismaClient, OrderStatus } from '@prisma/client';

export class OrderRepository {
  constructor(private prisma: PrismaClient) {}

  async createOrder(data: {
    userId: string;
    addressId: string;
    subtotal: number;
    shippingFee: number;
    total: number;
    items: Array<{
      productId: string;
      variantId: string;
      unitPrice: number;
      quantity: number;
    }>;
    payment: {
      provider: string;
      transactionId: string;
      amount: number;
      status: string;
    };
  }) {
    const orderNumber = `THRD-${Math.floor(100000 + Math.random() * 900000)}`;

    return this.prisma.order.create({
      data: {
        orderNumber,
        userId: data.userId,
        addressId: data.addressId,
        status: 'CONFIRMED',
        subtotal: data.subtotal,
        shippingFee: data.shippingFee,
        total: data.total,
        items: {
          create: data.items.map((i) => ({
            productId: i.productId,
            variantId: i.variantId,
            unitPrice: i.unitPrice,
            quantity: i.quantity,
          })),
        },
        payment: {
          create: data.payment,
        },
      },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        address: true,
        payment: true,
      },
    });
  }

  async findByUserId(userId: string) {
    return this.prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        address: true,
        payment: true,
      },
    });
  }

  async findById(orderId: string, userId?: string) {
    const where: any = { id: orderId };
    if (userId) where.userId = userId;

    return this.prisma.order.findFirst({
      where,
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
        address: true,
        payment: true,
      },
    });
  }

  async updateStatus(orderId: string, status: OrderStatus) {
    return this.prisma.order.update({
      where: { id: orderId },
      data: { status },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });
  }
}
