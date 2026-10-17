import { User, IUser } from '../mongodb/models/User.js';
import { Types } from 'mongoose';
import { AuthService } from '../auth/auth.service';
import { DB_CONFIG } from '../env';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const MONGODB_URI = DB_CONFIG.uri;

export interface AuthResponse {
  user: IUser | null;
  session: {
    access_token: string;
    refresh_token?: string;
    expires_at?: number;
  } | null;
  error?: Error;
}

export class UserService {
  static async getAllUsers(page = 1, limit = 10, role?: string) {
    const query = role ? { role } : {};
    const skip = (page - 1) * limit;

    const [users, total] = await Promise.all([
      User.find(query)
        .skip(skip)
        .limit(limit)
        .select('-password')
        .sort({ createdAt: -1 }),
      User.countDocuments(query)
    ]);

    return {
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  static async getUserById(id: string) {
    const user = await User.findById(id).select('-password');
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  static async updateUserProfile(userId: string, updates: Partial<IUser>) {
    const allowedUpdates = ['email', 'role', 'club_id', 'isActive'];
    const updatesToApply = Object.keys(updates)
      .filter(key => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {} as any);

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: updatesToApply },
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  static async changePassword(userId: string, currentPassword: string, newPassword: string) {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error('User not found');
    }

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) {
      throw new Error('Current password is incorrect');
    }

    user.password = newPassword;
    await user.save();

    return { message: 'Password updated successfully' };
  }

  static async deactivateUser(userId: string) {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { isActive: false } },
      { new: true }
    ).select('-password');

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  static async activateUser(userId: string) {
    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { isActive: true } },
      { new: true }
    ).select('-password');

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  static async searchUsers(query: string, page = 1, limit = 10) {
    const searchQuery = {
      $or: [
        { email: { $regex: query, $options: 'i' } },
        { role: { $regex: query, $options: 'i' } }
      ]
    };

    const [users, total] = await Promise.all([
      User.find(searchQuery)
        .skip((page - 1) * limit)
        .limit(limit)
        .select('-password')
        .sort({ createdAt: -1 }),
      User.countDocuments(searchQuery)
    ]);

    return {
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  static async getUsersByRole(role: string, page = 1, limit = 10) {
    const [users, total] = await Promise.all([
      User.find({ role })
        .skip((page - 1) * limit)
        .limit(limit)
        .select('-password')
        .sort({ createdAt: -1 }),
      User.countDocuments({ role })
    ]);

    return {
      users,
      total,
      page,
      totalPages: Math.ceil(total / limit)
    };
  }

  static async createUser(
    email: string,
    password: string,
    role: string,
    additionalData: {
      fullName: string;
      status?: string;
      department?: string;
      year?: number;
      clubId?: string;
    }
  ): Promise<IUser> {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const user = new User({
      email,
      password,
      role,
      ...additionalData,
      status: additionalData.status || 'active'
    });

    await user.save();
    return user;
  }
} 