import { initMongoDB } from '@/lib/mongodb/init';
import { DB_CONFIG } from '@/lib/env';
import mongoose from 'mongoose';

async function testDatabaseConnection() {
  try {
    console.log('Starting database connection test...');
    console.log('Connection details:', {
      username: DB_CONFIG.username,
      cluster: DB_CONFIG.cluster,
      dbName: DB_CONFIG.dbName
    });

    // Test MongoDB connection
    console.log('\n1. Testing MongoDB connection...');
    await initMongoDB();
    console.log('✓ MongoDB connection successful');

    // Test database operations
    console.log('\n2. Testing database operations...');
    
    // List all collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log('Collections in database:', collections.map(c => c.name));

    // Test User collection
    const User = mongoose.model('User');
    const userCount = await User.countDocuments();
    console.log(`Total users in database: ${userCount}`);

    // Test creating a test user
    console.log('\n3. Testing user creation...');
    const testUser = {
      email: 'test@example.com',
      password: 'Test@1234',
      role: 'student',
      isActive: true
    };

    try {
      const user = new User(testUser);
      await user.save();
      console.log('✓ Test user created successfully');
      
      // Clean up test user
      await User.deleteOne({ email: 'test@example.com' });
      console.log('✓ Test user cleaned up');
    } catch (error) {
      console.error('Error creating test user:', error);
    }

    // Test connection status
    console.log('\n4. Testing connection status...');
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    console.log('Current connection state:', states[mongoose.connection.readyState]);

  } catch (error) {
    console.error('Database test failed:', error);
    if (error.message.includes('ECONNREFUSED')) {
      console.error('\nPossible causes:');
      console.error('1. MongoDB server is not running');
      console.error('2. Incorrect connection string');
      console.error('3. Network issues or firewall blocking');
      console.error('4. MongoDB Atlas IP whitelist restrictions');
    }
  } finally {
    // Close the connection
    await mongoose.connection.close();
    console.log('\nDatabase connection closed');
    process.exit(0);
  }
}

// Run the test
testDatabaseConnection(); 