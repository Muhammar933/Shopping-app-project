import { Router } from 'express';
import { CartController } from '../controllers/cart.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { addToCartSchema, updateCartItemSchema } from '../validators/cart.validator.js';

export function createCartRoutes(cartController: CartController): Router {
  const router = Router();

  router.use(authenticate);

  router.get('/', cartController.getCart);
  router.post('/items', validateBody(addToCartSchema), cartController.addItem);
  router.put('/items/:id', validateBody(updateCartItemSchema), cartController.updateItem);
  router.delete('/items/:id', cartController.removeItem);

  return router;
}
