import { UserService } from '@/lib/services/user.service';
import { initMongoDB } from '@/lib/mongodb/init';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

async function createAdminUser() {
  try {
    // Initialize MongoDB connection
    await initMongoDB();
    console.log('Connected to MongoDB');

    // Admin credentials from environment variables
    const adminEmail = process.env.ADMIN_EMAIL || 'admin@cluby.com';
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminPassword) {
      throw new Error('ADMIN_PASSWORD environment variable is required');
    }

    // Check if admin already exists
    const existingAdmin = await UserService.getUsersByRole('admin', 1, 1);
    
    if (existingAdmin.users.length > 0) {
      console.log('Admin user already exists:', existingAdmin.users[0].email);
      process.exit(0);
    }

    // Create admin user
    const admin = await UserService.createUser(
      adminEmail,
      adminPassword,
      'admin'
    );

    console.log('Admin user created successfully:');
    console.log('Email:', admin.email);
    console.log('Role:', admin.role);
    console.log('ID:', admin._id);

  } catch (error) {
    console.error('Error creating admin user:', error instanceof Error ? error.message : 'Unknown error');
    process.exit(1);
  } finally {
    // Close MongoDB connection
    process.exit(0);
  }
}

// Run the script
createAdminUser(); 