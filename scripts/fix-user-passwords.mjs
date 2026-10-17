import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI || process.env.VITE_MONGODB_URI;

console.log('🔧 Fixing user passwords in database...\n');

async function fixPasswords() {
  try {
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB\n');

    const usersCollection = mongoose.connection.db.collection('users');
    
    // Get all users
    const users = await usersCollection.find({}).toArray();
    console.log(`Found ${users.length} users\n`);

    // Default password for all test users
    const defaultPassword = 'password123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 10);

    console.log('Updating passwords...\n');

    for (const user of users) {
      console.log(`- ${user.email}`);
      
      // Update the password to a properly hashed version
      await usersCollection.updateOne(
        { _id: user._id },
        { 
          $set: { 
            password: hashedPassword,
            status: 'active' // Ensure all users are active
          } 
        }
      );
    }

    console.log('\n✅ All passwords updated successfully!');
    console.log('\nYou can now login with these credentials:');
    console.log('Password for all users: password123\n');
    
    users.forEach(user => {
      console.log(`- Email: ${user.email}`);
      console.log(`  Role: ${user.role || 'N/A'}`);
      console.log(`  Status: active`);
      console.log('');
    });

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Connection closed');
  }
}

fixPasswords();
