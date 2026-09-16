import { Response, NextFunction } from 'express';
import { CartService } from '../services/cart.service.js';
import { AuthenticatedRequest } from '../types/index.js';

export class CartController {
  constructor(private cartService: CartService) {}

  getCart = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const cart = await this.cartService.getCart(req.user!.userId);
      res.status(200).json({
        success: true,
        data: cart,
      });
    } catch (err) {
      next(err);
    }
  };

  addItem = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { productId, variantId, quantity } = req.body;
      const cart = await this.cartService.addItem(
        req.user!.userId,
        productId,
        variantId,
        quantity || 1
      );
      res.status(200).json({
        success: true,
        data: cart,
      });
    } catch (err) {
      next(err);
    }
  };

  updateItem = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const { quantity } = req.body;
      const cart = await this.cartService.updateItemQuantity(req.user!.userId, id, quantity);
      res.status(200).json({
        success: true,
        data: cart,
      });
    } catch (err) {
      next(err);
    }
  };

  removeItem = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { id } = req.params;
      const cart = await this.cartService.removeItem(req.user!.userId, id);
      res.status(200).json({
        success: true,
        data: cart,
      });
    } catch (err) {
      next(err);
    }
  };
}
