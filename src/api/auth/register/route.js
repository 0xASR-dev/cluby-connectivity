import { NextResponse } from 'next/server';
import { connectToDatabase } from '../../../lib/mongodb/services/mongodb';
import User from '../../../lib/mongodb/models/User';
import jwt from 'jsonwebtoken';

export async function POST(request) {
  try {
    const body = await request.json();
    const { email, password, fullName, role, department, year, club_id } = body;

    // Validate required fields
    if (!email || !password || !fullName || !role) {
      return NextResponse.json(
        { success: false, message: 'Missing required fields' },
        { status: 400 }
      );
    }

    await connectToDatabase();

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: 'Email already registered' },
        { status: 400 }
      );
    }

    // Validate role-specific fields
    if (role === 'student' && (!department || !year)) {
      return NextResponse.json(
        { success: false, message: 'Department and year are required for students' },
        { status: 400 }
      );
    }

    if (role === 'club_rep' && !club_id) {
      return NextResponse.json(
        { success: false, message: 'Club ID is required for club representatives' },
        { status: 400 }
      );
    }

    // Create new user
    const user = new User({
      email,
      password,
      fullName,
      role,
      department,
      year,
      club_id,
      status: 'active'
    });

    await user.save();

    // Generate JWT token
    const token = jwt.sign(
      {
        userId: user._id,
        email: user.email,
        role: user.role,
        club_id: user.club_id
      },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    // Return user data without password
    const userData = {
      _id: user._id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      department: user.department,
      year: user.year,
      club_id: user.club_id,
      status: user.status
    };

    return NextResponse.json({
      success: true,
      data: {
        user: userData,
        token
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { success: false, message: 'An error occurred during registration' },
      { status: 500 }
    );
  }
} 