import { Router, Response, NextFunction } from 'express';
import { PrismaClient } from '@prisma/client';
import { authenticate } from '../middleware/auth.middleware.js';
import { AuthenticatedRequest } from '../types/index.js';

export function createFavoriteRoutes(prisma: PrismaClient): Router {
  const router = Router();

  router.use(authenticate);

  router.get('/', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const favorites = await prisma.favorite.findMany({
        where: { userId: req.user!.userId },
        include: {
          product: {
            include: {
              category: true,
              variants: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      res.status(200).json({
        success: true,
        data: favorites.map((f) => f.product),
      });
    } catch (err) {
      next(err);
    }
  });

  router.post('/:productId', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { productId } = req.params;
      const fav = await prisma.favorite.upsert({
        where: {
          userId_productId: {
            userId: req.user!.userId,
            productId,
          },
        },
        create: {
          userId: req.user!.userId,
          productId,
        },
        update: {},
      });

      res.status(201).json({
        success: true,
        data: fav,
      });
    } catch (err) {
      next(err);
    }
  });

  router.delete('/:productId', async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { productId } = req.params;
      await prisma.favorite.deleteMany({
        where: {
          userId: req.user!.userId,
          productId,
        },
      });

      res.status(200).json({
        success: true,
        data: { message: 'Removed from favorites' },
      });
    } catch (err) {
      next(err);
    }
  });

  return router;
}
