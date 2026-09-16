import { Request } from 'express';

export type UserRole = 'USER' | 'ADMIN';

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}

export interface AuthenticatedRequest extends Request {
  user?: TokenPayload;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
  };
}

export type OrderStatusType = 'PENDING' | 'CONFIRMED' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
export type TryOnStatusType = 'PENDING' | 'PROCESSING' | 'COMPLETED' | 'FAILED';
