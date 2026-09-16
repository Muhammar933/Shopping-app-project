import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

export const config = {
  port: parseInt(process.env.PORT || '3000', 10),
  nodeEnv: process.env.NODE_ENV || 'development',
  databaseUrl: process.env.DATABASE_URL || 'postgresql://threadly_user:threadly_pass@localhost:5432/threadly_db',
  jwtSecret: process.env.JWT_SECRET || 'threadly_super_secure_jwt_secret_change_in_prod_2026',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
  corsOrigin: process.env.CORS_ORIGIN || '*',
  uploadDir: path.resolve(process.cwd(), 'uploads'),
  isProduction: process.env.NODE_ENV === 'production',
};
