import { Router } from 'express';
import { AuthController } from '../controllers/auth.controller.js';
import { validateBody } from '../middleware/validate.middleware.js';
import { registerSchema, loginSchema } from '../validators/auth.validator.js';
import { authenticate } from '../middleware/auth.middleware.js';

export function createAuthRoutes(authController: AuthController): Router {
  const router = Router();

  router.post('/register', validateBody(registerSchema), authController.register);
  router.post('/login', validateBody(loginSchema), authController.login);
  router.get('/me', authenticate, authController.me);
  router.post('/logout', authenticate, authController.logout);

  return router;
}
