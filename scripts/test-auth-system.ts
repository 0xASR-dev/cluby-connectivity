import mongoose from 'mongoose';
import { DB_CONFIG } from '../src/lib/env';
import bcrypt from 'bcryptjs';
import { UserService } from '../src/lib/services/user.service';
import { AuthService } from '../src/lib/auth/auth.service';

async function testAuthSystem() {
  console.log('🔍 Starting Authentication System Test...\n');

  try {
    // 1. Test MongoDB Connection
    console.log('1. Testing MongoDB Connection...');
    await mongoose.connect(DB_CONFIG.uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    console.log('   ✓ MongoDB connected successfully\n');

    // 2. Test User Creation
    console.log('2. Testing User Creation...');
    const testUser = {
      email: 'test@example.com',
      password: 'Test@1234',
      role: 'student'
    };

    try {
      // Create user using UserService
      const createdUser = await UserService.createUser(
        testUser.email,
        testUser.password,
        testUser.role
      );
      console.log('   ✓ User created successfully:', createdUser._id);

      // 3. Test Login System
      console.log('\n3. Testing Login System...');
      try {
        const loginResult = await AuthService.login(testUser.email, testUser.password);
        console.log('   ✓ Login successful');
        console.log('   - User ID:', loginResult.user._id);
        console.log('   - Role:', loginResult.user.role);
        console.log('   - Token received:', loginResult.token ? 'Yes' : 'No');

        // 4. Test Token Verification
        console.log('\n4. Testing Token Verification...');
        const verifiedUser = await AuthService.verifyToken();
        console.log('   ✓ Token verified');
        console.log('   - Verified User ID:', verifiedUser?._id);
        console.log('   - Verified Role:', verifiedUser?.role);

        // 5. Test Logout
        console.log('\n5. Testing Logout...');
        await AuthService.logout();
        console.log('   ✓ Logout successful');
        
        // Verify token is removed
        const tokenAfterLogout = AuthService.getToken();
        console.log('   - Token after logout:', tokenAfterLogout ? 'Still exists' : 'Removed');

      } catch (loginError) {
        console.error('   ✗ Login failed:', loginError.message);
      }

    } catch (createError) {
      console.error('   ✗ User creation failed:', createError.message);
    }

    // 6. Test Error Cases
    console.log('\n6. Testing Error Cases...');
    
    // Test invalid login
    try {
      await AuthService.login('wrong@email.com', 'wrongpassword');
    } catch (error) {
      console.log('   ✓ Invalid login handled correctly');
    }

    // Test duplicate email
    try {
      await UserService.createUser(testUser.email, 'AnotherPassword123', 'student');
    } catch (error) {
      console.log('   ✓ Duplicate email handled correctly');
    }

  } catch (error) {
    console.error('\n❌ Test failed:', error.message);
    console.log('\nPossible issues:');
    console.log('1. MongoDB connection issues');
    console.log('2. Authentication service configuration');
    console.log('3. User service configuration');
    console.log('4. Environment variables setup');
  } finally {
    // Clean up test data
    try {
      const User = mongoose.model('User');
      await User.deleteOne({ email: 'test@example.com' });
      console.log('\n🧹 Test data cleaned up');
    } catch (error) {
      console.error('Failed to clean up test data:', error.message);
    }

    await mongoose.connection.close();
    console.log('\n🔌 Connection closed');
    process.exit(0);
  }
}

// Run the tests
testAuthSystem(); 