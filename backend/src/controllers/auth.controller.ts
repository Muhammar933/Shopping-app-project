import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import { AuthenticatedRequest } from '../types/index.js';
import { UserRepository } from '../repositories/user.repository.js';

export class AuthController {
  constructor(
    private authService: AuthService,
    private userRepo: UserRepository
  ) {}

  register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await this.authService.register(req.body);
      res.status(201).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };

  login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const result = await this.authService.login(email, password);
      res.status(200).json({
        success: true,
        data: result,
      });
    } catch (err) {
      next(err);
    }
  };

  me = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        res.status(401).json({ success: false, error: { code: 'UNAUTHORIZED', message: 'Not logged in' } });
        return;
      }
      const user = await this.userRepo.findById(req.user.userId);
      if (!user) {
        res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'User not found' } });
        return;
      }
      res.status(200).json({
        success: true,
        data: {
          id: user.id,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          role: user.role,
          addresses: (user as any).addresses || [],
        },
      });
    } catch (err) {
      next(err);
    }
  };

  logout = async (req: Request, res: Response) => {
    res.status(200).json({
      success: true,
      data: { message: 'Logged out successfully' },
    });
  };
}
