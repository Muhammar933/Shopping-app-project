export interface ChargeParams {
  amount: number;
  currency: string;
  orderId: string;
  userId: string;
  paymentMethodToken?: string;
}

export interface ChargeResult {
  success: boolean;
  transactionId: string;
  provider: string;
  amount: number;
  status: 'COMPLETED' | 'FAILED' | 'PENDING';
  rawResponse?: any;
}

export interface IPaymentService {
  processPayment(params: ChargeParams): Promise<ChargeResult>;
  refundPayment(transactionId: string, amount?: number): Promise<boolean>;
}
