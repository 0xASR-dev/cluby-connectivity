import express, { Router, Request, Response, NextFunction } from 'express';
import { registerRoute } from '../auth/register/route.js';
import { loginRoute } from '../auth/login/route.js';
import { protect, restrictTo } from '../../middleware/auth.middleware.js';
import { User } from '../../lib/mongodb/models/User.js';

const router: Router = express.Router();

// Public routes
router.post('/register', registerRoute as any);
router.post('/login', loginRoute as any);

// Logout route
router.post('/logout', (req: Request, res: Response) => {
  res.clearCookie('auth_token');
  res.json({
    success: true,
    message: 'Logged out successfully'
  });
});

// Protected routes - Get current user
router.get('/me', protect as express.RequestHandler, (async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    console.log('🔍 Fetching current user:', req.user?.email);
    
    // User is already attached to req by protect middleware
    const user = await User.findById(req.user._id).select('-password');
    
    if (!user) {
      res.status(404).json({
        success: false,
        message: 'User not found'
      });
      return;
    }
    
    res.json({
      success: true,
      data: {
        user: {
          _id: user._id,
          email: user.email,
          fullName: user.fullName,
          role: user.role,
          department: user.department,
          year: user.year,
          clubId: user.clubId,
          status: user.status,
          lastLogin: user.lastLogin,
          createdAt: user.createdAt
        }
      }
    });
  } catch (error: any) {
    console.error('❌ Error fetching current user:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching user data'
    });
  }
}) as express.RequestHandler);

// Admin only routes - Get all users
router.get('/users', 
  protect as express.RequestHandler,
  restrictTo('admin') as express.RequestHandler,
  (async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const users = await User.find().select('-password');
      res.json({
        success: true,
        data: {
          users,
          count: users.length
        }
      });
    } catch (error: any) {
      console.error('❌ Error fetching users:', error);
      res.status(500).json({
        success: false,
        message: 'Error fetching users'
      });
    }
  }) as express.RequestHandler
);

export default router; 