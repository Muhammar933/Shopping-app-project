import { Response, NextFunction } from 'express';
import { TryOnService } from '../services/try-on.service.js';
import { AuthenticatedRequest } from '../types/index.js';

export class TryOnController {
  constructor(private tryOnService: TryOnService) {}

  createSession = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const { productId } = req.body;
      const file = req.file;

      if (!productId) {
        res.status(400).json({
          success: false,
          error: { code: 'MISSING_PRODUCT', message: 'productId is required' },
        });
        return;
      }

      if (!file) {
        res.status(400).json({
          success: false,
          error: { code: 'MISSING_IMAGE', message: 'A torso/upper-body image file is required' },
        });
        return;
      }

      const session = await this.tryOnService.createSession({
        userId: req.user!.userId,
        productId,
        imageBuffer: file.buffer,
        fileName: file.originalname,
        mimeType: file.mimetype,
      });

      res.status(201).json({
        success: true,
        data: session,
      });
    } catch (err) {
      next(err);
    }
  };

  getSession = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      const session = await this.tryOnService.getSession(
        req.params.id,
        req.user?.role === 'ADMIN' ? undefined : req.user!.userId
      );
      res.status(200).json({
        success: true,
        data: session,
      });
    } catch (err) {
      next(err);
    }
  };
}
