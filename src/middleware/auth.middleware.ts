import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../lib/mongodb/models/User.js';

interface JwtPayload {
  userId: string;
  email: string;
  role: string;
  clubId?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: any;
    }
  }
}

export const protect = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // 1. Get token from header or cookies
    let token: string | undefined;
    
    if (req.headers.authorization?.startsWith('Bearer')) {
      token = req.headers.authorization.split(' ')[1];
    } else if (req.cookies?.auth_token) {
      token = req.cookies.auth_token;
    }

    if (!token) {
      console.log('❌ No token provided');
      return res.status(401).json({
        success: false,
        message: 'You are not logged in. Please log in to get access.'
      });
    }

    // 2. Verify token
    const jwtSecret = process.env.JWT_SECRET || process.env.VITE_JWT_SECRET;
    
    if (!jwtSecret) {
      console.error('❌ JWT_SECRET is not configured');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error'
      });
    }

    let decoded: JwtPayload;
    try {
      decoded = jwt.verify(token, jwtSecret) as JwtPayload;
    } catch (err: any) {
      console.log('❌ Token verification failed:', err.message);
      return res.status(401).json({
        success: false,
        message: 'Invalid or expired token. Please log in again.'
      });
    }

    // 3. Check if user still exists
    const user = await User.findById(decoded.userId).select('+password');
    
    if (!user) {
      console.log('❌ User no longer exists');
      return res.status(401).json({
        success: false,
        message: 'The user belonging to this token no longer exists.'
      });
    }

    // 4. Check if user is active
    if (user.status !== 'active') {
      console.log('❌ User account not active');
      return res.status(403).json({
        success: false,
        message: 'Your account is not active. Please contact support.'
      });
    }

    // 5. Grant access to protected route
    req.user = user;
    console.log('✅ User authenticated:', user.email);
    next();

  } catch (error: any) {
    console.error('❌ Auth middleware error:', error);
    return res.status(401).json({
      success: false,
      message: 'Authentication failed. Please log in again.'
    });
  }
};

export const restrictTo = (...roles: string[]) => {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      return res.status(401).json({
        success: false,
        message: 'You are not logged in.'
      });
    }

    if (!roles.includes(req.user.role)) {
      console.log(`❌ Access denied for role: ${req.user.role}`);
      return res.status(403).json({
        success: false,
        message: 'You do not have permission to perform this action'
      });
    }

    console.log(`✅ Access granted for role: ${req.user.role}`);
    next();
  };
}; 