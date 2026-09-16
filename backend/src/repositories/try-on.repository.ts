import { PrismaClient, TryOnStatus } from '@prisma/client';

export class TryOnRepository {
  constructor(private prisma: PrismaClient) {}

  async createSession(data: {
    userId: string;
    productId: string;
    inputImage: string;
  }) {
    return this.prisma.tryOnSession.create({
      data: {
        userId: data.userId,
        productId: data.productId,
        inputImage: data.inputImage,
        status: 'PENDING',
      },
      include: {
        product: true,
      },
    });
  }

  async updateSessionStatus(sessionId: string, status: TryOnStatus) {
    return this.prisma.tryOnSession.update({
      where: { id: sessionId },
      data: { status },
    });
  }

  async saveResult(sessionId: string, resultImage: string) {
    return this.prisma.$transaction([
      this.prisma.tryOnResult.create({
        data: {
          sessionId,
          resultImage,
        },
      }),
      this.prisma.tryOnSession.update({
        where: { id: sessionId },
        data: { status: 'COMPLETED' },
      }),
    ]);
  }

  async findById(sessionId: string, userId?: string) {
    const where: any = { id: sessionId };
    if (userId) where.userId = userId;

    return this.prisma.tryOnSession.findFirst({
      where,
      include: {
        product: true,
        result: true,
      },
    });
  }
}
