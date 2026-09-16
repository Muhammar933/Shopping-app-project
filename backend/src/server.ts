import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { PrismaClient } from '@prisma/client';
import { config } from './config/env.js';
import { configureApiRoutes } from './routes/index.js';
import { errorHandler } from './middleware/error.middleware.js';

const app = express();
const prisma = new PrismaClient();

// Security and utility middleware
app.use(helmet({
  crossOriginResourcePolicy: { policy: 'cross-origin' },
}));
app.use(cors({ origin: config.corsOrigin, credentials: true }));
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));

// Static file hosting for uploaded images
app.use('/uploads', express.static(config.uploadDir));

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    brand: 'THREADLY',
    tagline: 'WEAR YOUR STYLE.',
    timestamp: new Date().toISOString(),
  });
});

// Register all modular API routes
app.use('/api', configureApiRoutes(prisma));

// Centralized error handler
app.use(errorHandler);

// Listen
if (process.env.NODE_ENV !== 'test') {
  app.listen(config.port, '0.0.0.0', () => {
    console.log(`=========================================`);
    console.log(`🧵 THREADLY Modular Monolith Backend API`);
    console.log(`🚀 Running at http://localhost:${config.port}`);
    console.log(`🏷️  Tagline: "WEAR YOUR STYLE."`);
    console.log(`=========================================`);
  });
}

export { app, prisma };
