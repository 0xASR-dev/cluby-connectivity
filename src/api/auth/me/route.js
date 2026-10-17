import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb/services/mongodb';
import User from '../../../lib/mongodb/models/User';
import jwt from 'jsonwebtoken';

export async function GET(request) {
  try {
    const authHeader = request.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'No token provided' },
        { status: 401 }
      );
    }

    const token = authHeader.split(' ')[1];
    
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      
      await connectToDatabase();
      
      const user = await User.findById(decoded.userId).select('-password');
      if (!user) {
        return NextResponse.json(
          { success: false, message: 'User not found' },
          { status: 404 }
        );
      }

      if (user.status !== 'active') {
        return NextResponse.json(
          { success: false, message: 'Account is not active' },
          { status: 403 }
        );
      }

      return NextResponse.json({
        success: true,
        data: {
          user: {
            _id: user._id,
            email: user.email,
            fullName: user.fullName,
            role: user.role,
            department: user.department,
            year: user.year,
            club_id: user.club_id,
            status: user.status
          }
        }
      });

    } catch (error) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }
  } catch (error) {
    console.error('Auth verification error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred during authentication' },
      { status: 500 }
    );
  }
} 