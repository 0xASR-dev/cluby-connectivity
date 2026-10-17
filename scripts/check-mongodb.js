const mongoose = require('mongoose');
const { DB_CONFIG } = require('../src/lib/env');

async function checkMongoDB() {
  console.log('🔍 Starting MongoDB Connection Check...\n');

  // 1. Check Connection String
  console.log('1. Checking Connection String:');
  console.log('   Username:', DB_CONFIG.username);
  console.log('   Cluster:', DB_CONFIG.cluster);
  console.log('   Database:', DB_CONFIG.dbName);
  console.log('   Full URI:', DB_CONFIG.uri.replace(DB_CONFIG.password, '*****'));
  console.log('');

  // 2. Test Connection
  console.log('2. Testing Connection:');
  try {
    // Set connection options
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
    };

    // Attempt connection
    console.log('   Attempting to connect...');
    await mongoose.connect(DB_CONFIG.uri, options);
    console.log('   ✓ Connected successfully!\n');

    // 3. Check Database
    console.log('3. Checking Database:');
    const db = mongoose.connection.db;
    console.log('   Database name:', db.databaseName);
    
    // List collections
    const collections = await db.listCollections().toArray();
    console.log('   Collections:', collections.map(c => c.name).join(', '));
    console.log('');

    // 4. Check Models
    console.log('4. Checking Models:');
    const models = mongoose.modelNames();
    console.log('   Registered models:', models.join(', '));
    console.log('');

    // 5. Test Basic Operations
    console.log('5. Testing Basic Operations:');
    try {
      // Test User model
      const User = mongoose.model('User');
      const userCount = await User.countDocuments();
      console.log('   ✓ User count:', userCount);

      // Test Club model
      const Club = mongoose.model('Club');
      const clubCount = await Club.countDocuments();
      console.log('   ✓ Club count:', clubCount);

      // Test Event model
      const Event = mongoose.model('Event');
      const eventCount = await Event.countDocuments();
      console.log('   ✓ Event count:', eventCount);
    } catch (error) {
      console.log('   ⚠️ Some models might not be initialized:', error.message);
    }
    console.log('');

    // 6. Check Connection State
    console.log('6. Connection State:');
    const states = {
      0: 'disconnected',
      1: 'connected',
      2: 'connecting',
      3: 'disconnecting'
    };
    console.log('   Current state:', states[mongoose.connection.readyState]);
    console.log('   Host:', mongoose.connection.host);
    console.log('   Port:', mongoose.connection.port);
    console.log('   Database:', mongoose.connection.name);

  } catch (error) {
    console.error('\n❌ Connection failed:', error.message);
    console.log('\nPossible issues:');
    console.log('1. MongoDB server is not running');
    console.log('2. Incorrect credentials');
    console.log('3. Network issues or firewall blocking');
    console.log('4. MongoDB Atlas IP whitelist restrictions');
    console.log('5. Invalid connection string format');
    process.exit(1);
  } finally {
    // Close connection
    await mongoose.connection.close();
    console.log('\n🔌 Connection closed');
    process.exit(0);
  }
}

// Run the check
checkMongoDB(); 