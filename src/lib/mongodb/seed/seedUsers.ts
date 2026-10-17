const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const { initMongoDB } = require('../init');

const UserSchema = new mongoose.Schema({
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [8, 'Password must be at least 8 characters long']
  },
  role: {
    type: String,
    enum: ['student', 'club_rep', 'admin'],
    required: [true, 'Role is required']
  },
  fullName: {
    type: String,
    required: [true, 'Full name is required']
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  department: String,
  year: Number,
  clubId: String,
  lastLogin: Date
}, {
  timestamps: true
});

// Hash password before saving
UserSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const User = mongoose.model('User', UserSchema);

async function seedUsers() {
  try {
    // Initialize MongoDB connection
    await initMongoDB();
    console.log('Connected to MongoDB');

    // Clear existing users
    await User.deleteMany({});
    console.log('Cleared existing users');

    // Create dummy users
    const users = [
      // Admin User
      {
        email: 'admin@cluby.com',
        password: 'admin123',
        role: 'admin',
        fullName: 'Admin User',
        status: 'active'
      },
      // Club Representatives
      {
        email: 'tech.club@cluby.com',
        password: 'club123',
        role: 'club_rep',
        fullName: 'Tech Club Rep',
        status: 'active',
        clubId: 'tech_club',
        department: 'Computer Science'
      },
      {
        email: 'arts.club@cluby.com',
        password: 'club123',
        role: 'club_rep',
        fullName: 'Arts Club Rep',
        status: 'active',
        clubId: 'arts_club',
        department: 'Fine Arts'
      },
      // Students
      {
        email: 'student1@cluby.com',
        password: 'student123',
        role: 'student',
        fullName: 'John Doe',
        status: 'active',
        department: 'Computer Science',
        year: 2
      },
      {
        email: 'student2@cluby.com',
        password: 'student123',
        role: 'student',
        fullName: 'Jane Smith',
        status: 'active',
        department: 'Fine Arts',
        year: 3
      }
    ];

    // Create users
    const createdUsers = await Promise.all(
      users.map(user => new User(user).save())
    );

    console.log('Successfully created dummy users:');
    createdUsers.forEach(user => {
      console.log(`- ${user.role}: ${user.email}`);
    });

    return createdUsers;
  } catch (error) {
    console.error('Error seeding users:', error instanceof Error ? error.message : 'Unknown error');
    throw error;
  }
}

module.exports = { seedUsers }; 