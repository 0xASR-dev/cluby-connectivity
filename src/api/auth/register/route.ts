import { Request, Response } from 'express';
import { User } from '../../../lib/mongodb/models/User.js';
import jwt from 'jsonwebtoken';

export async function registerRoute(req: Request, res: Response) {
  console.log('📝 Registration attempt:', {
    method: req.method,
    path: req.path,
    email: req.body.email,
    role: req.body.role
  });

  try {
    const { email, password, fullName, role, department, year, clubId } = req.body;

    // 1. Validate required fields
    if (!email || !password || !fullName) {
      console.log('❌ Registration validation failed: missing required fields');
      return res.status(400).json({
        success: false,
        message: 'Please provide email, password, and full name'
      });
    }

    // 2. Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      console.log('❌ Registration validation failed: invalid email format');
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid email address'
      });
    }

    // 3. Validate password length
    if (password.length < 6) {
      console.log('❌ Registration validation failed: password too short');
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // 4. Validate role-specific fields
    const userRole = role || 'student';
    
    if (userRole === 'student') {
      if (!department || !year) {
        console.log('❌ Registration validation failed: missing student fields');
        return res.status(400).json({
          success: false,
          message: 'Students must provide department and year'
        });
      }
    }

    if (userRole === 'club_rep') {
      if (!clubId) {
        console.log('❌ Registration validation failed: missing club_rep fields');
        return res.status(400).json({
          success: false,
          message: 'Club representatives must provide a club ID'
        });
      }
    }

    // 5. Check if user already exists
    const existingUser = await User.findOne({ 
      email: email.toLowerCase().trim() 
    });
    
    if (existingUser) {
      console.log('❌ Registration failed: user already exists');
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists'
      });
    }

    // 6. Create new user
    const userData: any = {
      email: email.toLowerCase().trim(),
      password,
      fullName: fullName.trim(),
      role: userRole,
      status: 'active'
    };

    // Add role-specific fields
    if (userRole === 'student') {
      userData.department = department.trim();
      userData.year = year.trim();
    }

    if (userRole === 'club_rep' && clubId) {
      userData.clubId = clubId;
    }

    const user = await User.create(userData);

    console.log('✅ User created successfully:', user.email);

    // 7. Generate JWT token
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
      createdAt: user.createdAt
    };

    // 9. Set token in HTTP-only cookie
    res.cookie('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
    });

    // 10. Send success response
    return res.status(201).json({
      success: true,
      data: {
        user: userResponse,
        token
      },
      message: 'Registration successful'
    });

  } catch (error: any) {
    console.error('❌ Registration error:', error);

    // Handle mongoose validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err: any) => err.message);
      return res.status(400).json({
        success: false,
        message: messages.join('. ')
      });
    }

    // Handle duplicate key error
    if (error.code === 11000) {
      return res.status(409).json({
        success: false,
        message: 'An account with this email already exists'
      });
    }

    return res.status(500).json({
      success: false,
      message: 'An error occurred during registration. Please try again later.',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
} 