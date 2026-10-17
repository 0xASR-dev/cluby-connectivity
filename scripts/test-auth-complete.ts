import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const API_URL = 'http://localhost:3000/api/auth';
let testToken: string | null = null;

// Test utilities
function logSuccess(message: string) {
  console.log(`✅ ${message}`);
}

function logError(message: string, error?: any) {
  console.error(`❌ ${message}`);
  if (error) {
    console.error('   Error:', error.message || error);
  }
}

function logInfo(message: string) {
  console.log(`ℹ️  ${message}`);
}

// Test 1: Register a new user
async function testRegister() {
  console.log('\n📝 Test 1: User Registration');
  console.log('================================');
  
  try {
    const testEmail = `test_${Date.now()}@example.com`;
    const response = await axios.post(`${API_URL}/register`, {
      email: testEmail,
      password: 'Test@1234',
      fullName: 'Test User',
      role: 'student',
      department: 'Computer Science',
      year: '2024'
    });

    if (response.data.success && response.data.data?.token) {
      testToken = response.data.data.token;
      logSuccess('User registered successfully');
      logInfo(`Email: ${testEmail}`);
      logInfo(`Token: ${testToken.substring(0, 20)}...`);
      return true;
    } else {
      logError('Registration failed: Invalid response structure');
      return false;
    }
  } catch (error: any) {
    logError('Registration failed', error.response?.data || error);
    return false;
  }
}

// Test 2: Login with existing user
async function testLogin() {
  console.log('\n🔐 Test 2: User Login');
  console.log('================================');
  
  try {
    const response = await axios.post(`${API_URL}/login`, {
      email: 'admin@cluby.com',
      password: 'password123'
    });

    if (response.data.success && response.data.data?.token) {
      testToken = response.data.data.token;
      logSuccess('Login successful');
      logInfo(`User: ${response.data.data.user.fullName}`);
      logInfo(`Role: ${response.data.data.user.role}`);
      logInfo(`Token: ${testToken.substring(0, 20)}...`);
      return true;
    } else {
      logError('Login failed: Invalid response structure');
      return false;
    }
  } catch (error: any) {
    logError('Login failed', error.response?.data || error);
    return false;
  }
}

// Test 3: Login with wrong password
async function testLoginWrongPassword() {
  console.log('\n🔐 Test 3: Login with Wrong Password');
  console.log('================================');
  
  try {
    await axios.post(`${API_URL}/login`, {
      email: 'admin@cluby.com',
      password: 'wrongpassword'
    });

    logError('Should have failed but succeeded');
    return false;
  } catch (error: any) {
    if (error.response?.status === 401) {
      logSuccess('Correctly rejected invalid credentials');
      return true;
    } else {
      logError('Unexpected error', error.response?.data || error);
      return false;
    }
  }
}

// Test 4: Verify token
async function testVerifyToken() {
  console.log('\n🔍 Test 4: Token Verification');
  console.log('================================');
  
  if (!testToken) {
    logError('No token available for testing');
    return false;
  }

  try {
    const response = await axios.get(`${API_URL}/me`, {
      headers: {
        'Authorization': `Bearer ${testToken}`
      }
    });

    if (response.data.success && response.data.data?.user) {
      logSuccess('Token verified successfully');
      logInfo(`User: ${response.data.data.user.fullName}`);
      logInfo(`Email: ${response.data.data.user.email}`);
      return true;
    } else {
      logError('Token verification failed: Invalid response structure');
      return false;
    }
  } catch (error: any) {
    logError('Token verification failed', error.response?.data || error);
    return false;
  }
}

// Test 5: Access protected route without token
async function testProtectedRouteWithoutToken() {
  console.log('\n🔒 Test 5: Protected Route without Token');
  console.log('================================');
  
  try {
    await axios.get(`${API_URL}/me`);
    logError('Should have been rejected but succeeded');
    return false;
  } catch (error: any) {
    if (error.response?.status === 401) {
      logSuccess('Correctly rejected request without token');
      return true;
    } else {
      logError('Unexpected error', error.response?.data || error);
      return false;
    }
  }
}

// Test 6: Register with missing fields
async function testRegisterMissingFields() {
  console.log('\n📝 Test 6: Register with Missing Fields');
  console.log('================================');
  
  try {
    await axios.post(`${API_URL}/register`, {
      email: 'incomplete@example.com',
      password: 'Test@1234'
      // Missing fullName and other required fields
    });

    logError('Should have been rejected but succeeded');
    return false;
  } catch (error: any) {
    if (error.response?.status === 400) {
      logSuccess('Correctly rejected incomplete registration');
      return true;
    } else {
      logError('Unexpected error', error.response?.data || error);
      return false;
    }
  }
}

// Test 7: Register with duplicate email
async function testRegisterDuplicate() {
  console.log('\n📝 Test 7: Register with Duplicate Email');
  console.log('================================');
  
  try {
    await axios.post(`${API_URL}/register`, {
      email: 'admin@cluby.com', // Already exists
      password: 'Test@1234',
      fullName: 'Duplicate User',
      role: 'student',
      department: 'Computer Science',
      year: '2024'
    });

    logError('Should have been rejected but succeeded');
    return false;
  } catch (error: any) {
    if (error.response?.status === 409 || error.response?.status === 400) {
      logSuccess('Correctly rejected duplicate email');
      return true;
    } else {
      logError('Unexpected error', error.response?.data || error);
      return false;
    }
  }
}

// Run all tests
async function runAllTests() {
  console.log('\n🧪 AUTHENTICATION SYSTEM TEST SUITE');
  console.log('====================================\n');
  console.log(`API URL: ${API_URL}\n`);

  const results = {
    passed: 0,
    failed: 0,
    total: 7
  };

  // Run tests sequentially
  if (await testRegister()) results.passed++; else results.failed++;
  if (await testLogin()) results.passed++; else results.failed++;
  if (await testLoginWrongPassword()) results.passed++; else results.failed++;
  if (await testVerifyToken()) results.passed++; else results.failed++;
  if (await testProtectedRouteWithoutToken()) results.passed++; else results.failed++;
  if (await testRegisterMissingFields()) results.passed++; else results.failed++;
  if (await testRegisterDuplicate()) results.passed++; else results.failed++;

  // Print summary
  console.log('\n📊 TEST SUMMARY');
  console.log('================================');
  console.log(`Total Tests: ${results.total}`);
  console.log(`✅ Passed: ${results.passed}`);
  console.log(`❌ Failed: ${results.failed}`);
  console.log(`Success Rate: ${((results.passed / results.total) * 100).toFixed(1)}%`);
  
  if (results.failed === 0) {
    console.log('\n🎉 All tests passed!');
  } else {
    console.log('\n⚠️  Some tests failed. Please review the errors above.');
  }

  process.exit(results.failed > 0 ? 1 : 0);
}

// Check if server is running
async function checkServer() {
  try {
    await axios.get('http://localhost:3000/api/health');
    logSuccess('Server is running');
    return true;
  } catch (error) {
    logError('Server is not running. Please start the server first with: npx tsx src/server.ts');
    process.exit(1);
  }
}

// Main
(async () => {
  await checkServer();
  await runAllTests();
})();
