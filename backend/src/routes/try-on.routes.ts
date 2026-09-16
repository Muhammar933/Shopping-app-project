import { Router } from 'express';
import multer from 'multer';
import { TryOnController } from '../controllers/try-on.controller.js';
import { authenticate } from '../middleware/auth.middleware.js';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files (JPEG, PNG, WEBP) are allowed for Virtual Try-On'));
    }
  },
});

export function createTryOnRoutes(tryOnController: TryOnController): Router {
  const router = Router();

  router.use(authenticate);

  router.post('/', upload.single('image'), tryOnController.createSession);
  router.get('/:id', tryOnController.getSession);

  return router;
}
