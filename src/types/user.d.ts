import { ObjectId } from 'mongodb';

export interface Profile {
  full_name: string;
  avatar_url?: string;
  department?: string;
  year?: string;
  bio?: string;
}

export interface User {
  _id: ObjectId;
  id: string;
  email: string;
  password?: string;
  role: 'student' | 'admin' | 'clubRepresentative';
  profile: Profile;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AuthResponse {
  success: boolean;
  message?: string;
  token?: string;
  user?: User | null;
}

export interface UserDocument extends Document, User {
  comparePassword(candidatePassword: string): Promise<boolean>;
  generateToken(): Promise<string>;
} 