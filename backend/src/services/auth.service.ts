import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { UserRepository } from '../repositories/user.repository.js';
import { config } from '../config/env.js';
import { TokenPayload } from '../types/index.js';

export class AuthService {
  constructor(private userRepo: UserRepository) {}

  async register(data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
  }) {
    const existing = await this.userRepo.findByEmail(data.email);
    if (existing) {
      throw new Error('User with this email already exists');
    }

    const saltRounds = 10;
    const passwordHash = await bcrypt.hash(data.password, saltRounds);

    const user = await this.userRepo.create({
      email: data.email,
      passwordHash,
      firstName: data.firstName,
      lastName: data.lastName,
    });

    const token = this.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      token,
    };
  }

  async login(email: string, password: string) {
    const user = await this.userRepo.findByEmail(email);
    if (!user) {
      throw new Error('Invalid email or password');
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      throw new Error('Invalid email or password');
    }

    const token = this.generateToken({
      userId: user.id,
      email: user.email,
      role: user.role,
    });

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      token,
    };
  }

  private generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, config.jwtSecret, {
      expiresIn: config.jwtExpiresIn,
    });
  }
}
