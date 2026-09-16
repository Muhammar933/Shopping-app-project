import { IPaymentService, ChargeParams, ChargeResult } from './payment.interface.js';

export class MockPaymentService implements IPaymentService {
  async processPayment(params: ChargeParams): Promise<ChargeResult> {
    // Simulates payment gateway round-trip latency
    await new Promise((resolve) => setTimeout(resolve, 600));

    // Generates realistic mock transaction ID
    const transactionId = `TXN_MOCK_${Date.now()}_${Math.floor(Math.random() * 100000)}`;

    return {
      success: true,
      transactionId,
      provider: 'MOCK_PAYMENT_GATEWAY',
      amount: params.amount,
      status: 'COMPLETED',
      rawResponse: {
        timestamp: new Date().toISOString(),
        orderId: params.orderId,
        authorized: true,
      },
    };
  }

  async refundPayment(transactionId: string, amount?: number): Promise<boolean> {
    console.log(`[MockPaymentService] Refunded transaction ${transactionId} for $${amount || 'full'}`);
    return true;
  }
}
