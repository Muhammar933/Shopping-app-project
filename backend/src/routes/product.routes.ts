import { Router } from 'express';
import { ProductController } from '../controllers/product.controller.js';
import { authenticate, authorizeRoles } from '../middleware/auth.middleware.js';

export function createProductRoutes(productController: ProductController): Router {
  const router = Router();

  router.get('/categories', productController.getCategories);
  router.get('/', productController.getAll);
  router.get('/:id', productController.getById);

  // Admin protected product mutations
  router.post('/', authenticate, authorizeRoles('ADMIN'), productController.create);
  router.put('/:id', authenticate, authorizeRoles('ADMIN'), productController.update);
  router.delete('/:id', authenticate, authorizeRoles('ADMIN'), productController.delete);

  return router;
}
