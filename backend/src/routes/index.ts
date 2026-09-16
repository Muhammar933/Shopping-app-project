import { Router } from 'express';
import { PrismaClient } from '@prisma/client';

// Repositories
import { UserRepository } from '../repositories/user.repository.js';
import { ProductRepository } from '../repositories/product.repository.js';
import { CartRepository } from '../repositories/cart.repository.js';
import { OrderRepository } from '../repositories/order.repository.js';
import { TryOnRepository } from '../repositories/try-on.repository.js';

// Services
import { AuthService } from '../services/auth.service.js';
import { ProductService } from '../services/product.service.js';
import { CartService } from '../services/cart.service.js';
import { OrderService } from '../services/order.service.js';
import { TryOnService } from '../services/try-on.service.js';
import { MockPaymentService } from '../services/payment/mock-payment.service.js';
import { LocalStorageService } from '../services/storage/local-storage.service.js';
import { MockVirtualTryOnService } from '../services/try-on/mock-try-on.service.js';

// Controllers
import { AuthController } from '../controllers/auth.controller.js';
import { ProductController } from '../controllers/product.controller.js';
import { CartController } from '../controllers/cart.controller.js';
import { OrderController } from '../controllers/order.controller.js';
import { TryOnController } from '../controllers/try-on.controller.js';

// Route Handlers
import { createAuthRoutes } from './auth.routes.js';
import { createProductRoutes } from './product.routes.js';
import { createCartRoutes } from './cart.routes.js';
import { createOrderRoutes } from './order.routes.js';
import { createTryOnRoutes } from './try-on.routes.js';
import { createFavoriteRoutes } from './favorite.routes.js';

export function configureApiRoutes(prisma: PrismaClient): Router {
  const router = Router();

  // 1. Instantiate Storage, Payment & Virtual Try-On Providers
  const storageService = new LocalStorageService();
  const paymentService = new MockPaymentService();
  const virtualTryOnService = new MockVirtualTryOnService();

  // 2. Instantiate Repositories
  const userRepo = new UserRepository(prisma);
  const productRepo = new ProductRepository(prisma);
  const cartRepo = new CartRepository(prisma);
  const orderRepo = new OrderRepository(prisma);
  const tryOnRepo = new TryOnRepository(prisma);

  // 3. Instantiate Domain Services
  const authService = new AuthService(userRepo);
  const productService = new ProductService(productRepo);
  const cartService = new CartService(cartRepo, prisma);
  const orderService = new OrderService(orderRepo, cartService, cartRepo, paymentService);
  const tryOnService = new TryOnService(tryOnRepo, productRepo, virtualTryOnService, storageService);

  // 4. Instantiate Controllers
  const authController = new AuthController(authService, userRepo);
  const productController = new ProductController(productService);
  const cartController = new CartController(cartService);
  const orderController = new OrderController(orderService);
  const tryOnController = new TryOnController(tryOnService);

  // 5. Register Routes Under /api
  router.use('/auth', createAuthRoutes(authController));
  router.use('/products', createProductRoutes(productController));
  router.use('/categories', productController.getCategories);
  router.use('/cart', createCartRoutes(cartController));
  router.use('/orders', createOrderRoutes(orderController));
  router.use('/try-on', createTryOnRoutes(tryOnController));
  router.use('/favorites', createFavoriteRoutes(prisma));

  return router;
}
