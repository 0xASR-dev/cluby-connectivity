import express from 'express';
import type { Request, Response } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import cookieParser from 'cookie-parser';
import { connectToDatabase } from './lib/mongodb/services/mongodb.js';
import userRoutes from './api/routes/user.routes.js';
import authRoutes from './api/routes/auth.routes.js';
import { errorHandler } from './middleware/error.middleware.js';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

if (!process.env.MONGODB_URI) {
  console.error('MONGODB_URI is not defined in environment variables');
  process.exit(1);
}

if (!process.env.JWT_SECRET) {
  console.error('JWT_SECRET is not defined in environment variables');
  process.exit(1);
}

const app = express();

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'http://localhost:5173',
    'http://localhost:3001',
    process.env.VITE_APP_URL || 'http://localhost:5173'
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Configure Helmet with necessary adjustments
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  contentSecurityPolicy: false
}));

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan('dev'));

// Basic test endpoint
app.get('/', (req: Request, res: Response) => {
  res.json({ message: 'Server is running' });
});

// Test endpoint with detailed response
app.get('/api/test', (req: Request, res: Response) => {
  res.json({
    message: 'Server is running and responding to requests',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV
  });
});

// Health check endpoint with detailed status
app.get('/api/health', (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    server: {
      environment: process.env.NODE_ENV,
      cors: {
        enabled: true,
        origins: [
          'http://localhost:3000',
          'http://localhost:5173',
          process.env.VITE_APP_URL || 'http://localhost:5173'
        ]
      }
    }
  });
});

// Initialize MongoDB connection
const initializeServer = async () => {
  // Mount API routes
  app.use('/api/auth', authRoutes);
  app.use('/api/users', userRoutes);

  // Error handling middleware
  app.use(errorHandler);

  // 404 handler
  app.use((req: Request, res: Response) => {
    res.status(404).json({
      success: false,
      message: `Route ${req.method} ${req.url} not found`
    });
  });

  // Start server first so frontend can connect
  const PORT = process.env.PORT || 3000;
  app.listen(PORT, () => {
    console.log(`\n🚀 Server is running on http://localhost:${PORT}`);
    console.log(`📡 API endpoints: http://localhost:${PORT}/api`);
    console.log('Available endpoints:');
    console.log('  POST /api/auth/login');
    console.log('  POST /api/auth/register');
    console.log('  GET  /api/auth/me');
    console.log('  POST /api/auth/logout');
    console.log('  GET  /api/health\n');
  });

  // Then connect to database (with retries)
  try {
    await connectToDatabase();
    console.log('✅ Database connection established');
  } catch (error) {
    console.error('⚠️  Database connection failed. Auth routes will return 500 until DB is available.');
    console.error('   Check your network connection and MongoDB Atlas status.');
  }
};

// Handle uncaught exceptions and rejections
process.on('uncaughtException', (error) => {
  console.error('Uncaught Exception:', error);
  process.exit(1);
});

process.on('unhandledRejection', (error) => {
  console.error('Unhandled Rejection:', error);
  process.exit(1);
});

initializeServer(); 