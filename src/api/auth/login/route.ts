import { Request, Response } from 'express';
import { User } from '../../../lib/mongodb/models/User.js';
import jwt from 'jsonwebtoken';

export async function loginRoute(req: Request, res: Response) {
  console.log('🔐 Login attempt:', {
    method: req.method,
    path: req.path,
    email: req.body.email
  });

  try {
    const { email, password } = req.body;

    // 1. Validate input
    if (!email || !password) {
      console.log('❌ Login validation failed: missing credentials');
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password'
      });
    }

    // 2. Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Login validation failed: invalid email format');
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // 3. Find user and explicitly select password field
    const user = await User.findOne({ 
      email: email.toLowerCase().trim() 
    }).select('+password');
    
    if (!user) {
      console.log('❌ Login failed: user not found');
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // 4. Compare passwords
    const isPasswordValid = await user.comparePassword(password);
    
    if (!isPasswordValid) {
      console.log('❌ Login failed: invalid password');
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    // 5. Check if user is active
    if (user.status !== 'active') {
      console.log('❌ Login failed: user not active');
      return res.status(403).json({
        success: false,
        message: 'Your account is not active. Please contact support.'
      });
    }

    // 6. Generate JWT token
    const jwtSecret = process.env.JWT_SECRET || process.env.VITE_JWT_SECRET;
    
    if (!jwtSecret) {
      console.error('❌ JWT_SECRET is not configured');
      return res.status(500).json({
        success: false,
        message: 'Server configuration error'
      });
    }

    const token = jwt.sign(
      {
        userId: user._id.toString(),
        email: user.email,
        role: user.role,
        clubId: user.clubId?.toString()
      },
      jwtSecret,
      { 
        expiresIn: '7d',
        algorithm: 'HS256'
      }
    );

    // 7. Update last login time
    user.lastLogin = new Date();
    await user.save();

    console.log('✅ Login successful:', user.email);

    // 8. Prepare user response (password already excluded by schema transform)
    const userResponse = {
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
    };

    // 9. Set token in HTTP-only cookie for additional security
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // 10. Send success response
    return res.status(200).json({
      success: true,
      data: {
        user: userResponse,
        token
      },
      message: 'Login successful'
    });

  } catch (error: any) {
    console.error('❌ Login error:', error);
    
    return res.status(500).json({
      success: false,
      message: 'An error occurred during login. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
} 