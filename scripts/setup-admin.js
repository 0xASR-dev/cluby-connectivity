import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { DB_CONFIG } from '../src/lib/env.js';

async function setupAdmin() {
  try {
    console.log('🔄 Attempting to connect to MongoDB...');
    
    // Connect to MongoDB
    await mongoose.connect(DB_CONFIG.uri, {
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ MongoDB connected successfully!');
    
    // Check if admin user exists
    const User = mongoose.model('User', new mongoose.Schema({
      email: String,
      password: String,
      role: String,
      isActive: Boolean
    }));
    
    const adminEmail = 'admin@example.com';
    const adminPassword = 'Admin@1234';
    
    const existingAdmin = await User.findOne({ email: adminEmail });
    
    if (existingAdmin) {
      console.log('ℹ️ Admin user already exists');
    } else {
      // Create admin user
      const hashedPassword = await bcrypt.hash(adminPassword, 10);
      await User.create({
        email: adminEmail,
        password: hashedPassword,
        role: 'admin',
        isActive: true
      });
      console.log('✅ Admin user created successfully');
      console.log('📧 Email:', adminEmail);
      console.log('🔑 Password:', adminPassword);
    }
    
    // Close connection
    await mongoose.connection.close();
    console.log('🔌 MongoDB connection closed');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.code === 'ETIMEDOUT') {
      console.error('\nPossible causes:');
      console.error('- Network connectivity issues');
      console.error('- MongoDB Atlas is down');
      console.error('- IP address not whitelisted in MongoDB Atlas');
    }
    process.exit(1);
  }
}

setupAdmin(); 