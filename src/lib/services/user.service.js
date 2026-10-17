import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { DB_CONFIG } from '../env.js';

const UserSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, required: true, enum: ['admin', 'student', 'club_rep'] },
  club_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Club' },
  isActive: { type: Boolean, default: true },
  lastLogin: { type: Date },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

export class UserService {
  static async createUser(email, password, role) {
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = new User({
        email,
        password: hashedPassword,
        role,
        isActive: true
      });
      await user.save();
      return user;
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  static async signIn(email, password) {
    try {
      const user = await User.findOne({ email });
      if (!user) {
        throw new Error('User not found');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new Error('Invalid password');
      }

      user.lastLogin = new Date();
      await user.save();

      return user;
    } catch (error) {
      throw new Error(`Sign in failed: ${error.message}`);
    }
  }

  static async getUsersByRole(role, page = 1, limit = 10) {
    try {
      const skip = (page - 1) * limit;
      const users = await User.find({ role })
        .skip(skip)
        .limit(limit)
        .select('-password');
      return users;
    } catch (error) {
      throw new Error(`Failed to get users: ${error.message}`);
    }
  }
} 