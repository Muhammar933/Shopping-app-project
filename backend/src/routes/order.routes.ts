import { Router } from 'express';
import { OrderController } from '../controllers/order.controller.js';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { checkoutSchema, updateOrderStatusSchema } from '../validators/order.validator.js';

export function createOrderRoutes(orderController: OrderController): Router {
  const router = Router();

  router.use(authenticate);

  router.post('/', validateBody(checkoutSchema), orderController.checkout);
  router.get('/', orderController.getUserOrders);
  router.get('/:id', orderController.getOrderById);

  // Admin order status update
  router.put(
    '/:id/status',
    authorizeRoles('ADMIN'),
    validateBody(updateOrderStatusSchema),
    orderController.updateStatus
  );

  return router;
}
