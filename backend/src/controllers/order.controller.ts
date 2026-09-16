import { Response, NextFunction } from 'express';
import { OrderService } from '../services/order.service.js';
import { AuthenticatedRequest } from '../types/index.js';

export class OrderController {
  constructor(private orderService: OrderService) {}

  checkout = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { addressId } = req.body;
      const order = await this.orderService.checkoutAndCreateOrder(
        req.user!.userId,
        addressId
      );
      res.status(201).json({
        success: true,
        data: order,
      });
    } catch (err) {
      next(err);
    }
  };

  getUserOrders = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const orders = await this.orderService.getUserOrders(req.user!.userId);
      res.status(200).json({
        success: true,
        data: orders,
      });
    } catch (err) {
      next(err);
    }
  };

  getOrderById = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const order = await this.orderService.getOrderById(
        req.params.id,
        req.user?.role === 'ADMIN' ? undefined : req.user!.userId
      );
      res.status(200).json({
        success: true,
        data: order,
      });
    } catch (err) {
      next(err);
    }
  };

  updateStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { status } = req.body;
      const order = await this.orderService.updateOrderStatus(req.params.id, status);
      res.status(200).json({
        success: true,
        data: order,
      });
    } catch (err) {
      next(err);
    }
  };
}
