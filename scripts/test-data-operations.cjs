import mongoose from 'mongoose';
import { DB_CONFIG } from '../src/lib/env.js';
import bcrypt from 'bcryptjs';

async function testDataOperations() {
  console.log('🔍 Starting Data Operations Test...\n');

  try {
    // 1. Connect to MongoDB
    console.log('1. Connecting to MongoDB...');
    await mongoose.connect(DB_CONFIG.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('   ✓ Connected successfully\n');

    // 2. Test User Operations
    console.log('2. Testing User Operations:');
    const User = mongoose.model('User');
    
    // Create test user
    const testUser = {
      email: 'test@example.com',
      password: await bcrypt.hash('Test@1234', 10),
      role: 'student',
      isActive: true
    };

    // Test Create
    console.log('   Testing Create Operation...');
    const createdUser = await User.create(testUser);
    console.log('   ✓ User created:', createdUser._id);

    // Test Read
    console.log('   Testing Read Operation...');
    const foundUser = await User.findById(createdUser._id);
    console.log('   ✓ User found:', foundUser ? 'Yes' : 'No');

    // Test Update
    console.log('   Testing Update Operation...');
    const updatedUser = await User.findByIdAndUpdate(
      createdUser._id,
      { isActive: false },
      { new: true }
    );
    console.log('   ✓ User updated:', updatedUser.isActive === false);

    // Test Delete
    console.log('   Testing Delete Operation...');
    await User.findByIdAndDelete(createdUser._id);
    const deletedUser = await User.findById(createdUser._id);
    console.log('   ✓ User deleted:', !deletedUser);

    // 3. Test Club Operations
    console.log('\n3. Testing Club Operations:');
    const Club = mongoose.model('Club');
    
    // Create test club
    const testClub = {
      name: 'Test Club',
      description: 'A test club',
      status: 'active'
    };

    // Test Create
    console.log('   Testing Create Operation...');
    const createdClub = await Club.create(testClub);
    console.log('   ✓ Club created:', createdClub._id);

    // Test Read
    console.log('   Testing Read Operation...');
    const foundClub = await Club.findById(createdClub._id);
    console.log('   ✓ Club found:', foundClub ? 'Yes' : 'No');

    // Clean up
    await Club.findByIdAndDelete(createdClub._id);

    // 4. Test Event Operations
    console.log('\n4. Testing Event Operations:');
    const Event = mongoose.model('Event');
    
    // Create test event
    const testEvent = {
      title: 'Test Event',
      description: 'A test event',
      date: new Date(),
      status: 'upcoming'
    };

    // Test Create
    console.log('   Testing Create Operation...');
    const createdEvent = await Event.create(testEvent);
    console.log('   ✓ Event created:', createdEvent._id);

    // Test Read
    console.log('   Testing Read Operation...');
    const foundEvent = await Event.findById(createdEvent._id);
    console.log('   ✓ Event found:', foundEvent ? 'Yes' : 'No');

    // Clean up
    await Event.findByIdAndDelete(createdEvent._id);

    // 5. Test Complex Queries
    console.log('\n5. Testing Complex Queries:');
    
    // Test pagination
    console.log('   Testing Pagination...');
    const paginatedUsers = await User.find()
      .skip(0)
      .limit(10)
      .sort({ createdAt: -1 });
    console.log('   ✓ Pagination works:', paginatedUsers.length <= 10);

    // Test population
    console.log('   Testing Population...');
    if (Club && User) {
      const clubWithUsers = await Club.findOne().populate('members');
      console.log('   ✓ Population works:', !!clubWithUsers);
    }

    // 6. Test Error Handling
    console.log('\n6. Testing Error Handling:');
    try {
      await User.create({}); // Invalid data
    } catch (error) {
      console.log('   ✓ Error handling works:', error.message.includes('validation failed'));
    }

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.log('\nPossible issues:');
    console.log('1. Model validation errors');
    console.log('2. Database permissions');
    console.log('3. Schema mismatches');
    console.log('4. Data type issues');
    process.exit(1);
  } finally {
    await mongoose.connection.close();
    console.log('\n🔌 Connection closed');
    process.exit(0);
  }
}

// Run the tests
testDataOperations(); 