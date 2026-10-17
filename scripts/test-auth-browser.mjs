/**
 * Browser-based Authentication Test Script
 * Tests user registration and login via browser automation
 * 
 * Requirements: npm install playwright
 * Usage: node scripts/test-auth-browser.mjs
 */

import { chromium } from 'playwright';

const FRONTEND_URL = 'http://localhost:5173';
const TEST_USER = {
  email: `test.user.${Date.now()}@example.com`,
  password: 'TestPassword123!',
  fullName: 'Test User',
  role: 'student',
  department: 'Computer Science',
  year: 3
};

async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function testRegistration(page) {
  console.log('\n🧪 Testing User Registration...');
  console.log('━'.repeat(50));
  
  try {
    // Navigate to registration page
    await page.goto(`${FRONTEND_URL}/auth?tab=register`);
    await delay(1000);
    
    console.log('✓ Navigated to registration page');
    
    // Fill registration form
    await page.fill('input[name="fullName"], input[placeholder*="name" i]', TEST_USER.fullName);
    await page.fill('input[type="email"], input[name="email"]', TEST_USER.email);
    await page.fill('input[type="password"], input[name="password"]', TEST_USER.password);
    
    // Select role if available
    const roleSelector = await page.locator('select[name="role"], [role="combobox"]').first();
    if (await roleSelector.count() > 0) {
      await roleSelector.selectOption(TEST_USER.role);
      console.log('✓ Selected role:', TEST_USER.role);
    }
    
    // Fill student-specific fields if visible
    try {
      const departmentInput = await page.locator('input[name="department"]').first();
      if (await departmentInput.isVisible({ timeout: 1000 })) {
        await departmentInput.fill(TEST_USER.department);
        await page.fill('input[name="year"]', TEST_USER.year.toString());
        console.log('✓ Filled student-specific fields');
      }
    } catch (e) {
      // Fields might not be visible, that's okay
    }
    
    console.log('✓ Filled registration form with:');
    console.log(`  - Email: ${TEST_USER.email}`);
    console.log(`  - Name: ${TEST_USER.fullName}`);
    console.log(`  - Role: ${TEST_USER.role}`);
    
    // Submit form
    await page.click('button[type="submit"], button:has-text("Register"), button:has-text("Sign up")');
    console.log('✓ Submitted registration form');
    
    // Wait for response
    await delay(2000);
    
    // Check for success indicators
    const url = page.url();
    const bodyText = await page.textContent('body');
    
    if (url.includes('/dashboard') || bodyText.toLowerCase().includes('success') || bodyText.toLowerCase().includes('welcome')) {
      console.log('✅ Registration successful!');
      console.log(`  - Redirected to: ${url}`);
      return true;
    } else if (bodyText.toLowerCase().includes('error') || bodyText.toLowerCase().includes('failed')) {
      console.log('❌ Registration failed');
      console.log('  - Error message found on page');
      
      // Try to capture error message
      const errorElements = await page.locator('[role="alert"], .error, .text-red-500, .text-destructive').all();
      for (const el of errorElements) {
        const text = await el.textContent();
        if (text) console.log(`  - ${text.trim()}`);
      }
      return false;
    } else {
      console.log('⚠️  Registration status unclear');
      console.log(`  - Current URL: ${url}`);
      return false;
    }
  } catch (error) {
    console.error('❌ Registration test failed:', error.message);
    return false;
  }
}

async function testLogin(page, email = TEST_USER.email, password = TEST_USER.password) {
  console.log('\n🧪 Testing User Login...');
  console.log('━'.repeat(50));
  
  try {
    // Navigate to login page
    await page.goto(`${FRONTEND_URL}/auth?tab=login`);
    await delay(1000);
    
    console.log('✓ Navigated to login page');
    
    // Fill login form
    await page.fill('input[type="email"], input[name="email"]', email);
    await page.fill('input[type="password"], input[name="password"]', password);
    
    console.log('✓ Filled login form with:');
    console.log(`  - Email: ${email}`);
    console.log(`  - Password: ${'*'.repeat(password.length)}`);
    
    // Submit form
    await page.click('button[type="submit"], button:has-text("Login"), button:has-text("Sign in")');
    console.log('✓ Submitted login form');
    
    // Wait for response
    await delay(2000);
    
    // Check for success indicators
    const url = page.url();
    const bodyText = await page.textContent('body');
    
    if (url.includes('/dashboard') || bodyText.toLowerCase().includes('dashboard') || bodyText.toLowerCase().includes('welcome back')) {
      console.log('✅ Login successful!');
      console.log(`  - Redirected to: ${url}`);
      
      // Check if token is stored
      const token = await page.evaluate(() => localStorage.getItem('auth_token'));
      if (token) {
        console.log('✓ Auth token stored in localStorage');
        console.log(`  - Token length: ${token.length} characters`);
      }
      
      return true;
    } else if (bodyText.toLowerCase().includes('invalid') || bodyText.toLowerCase().includes('incorrect')) {
      console.log('❌ Login failed - Invalid credentials');
      return false;
    } else {
      console.log('⚠️  Login status unclear');
      console.log(`  - Current URL: ${url}`);
      return false;
    }
  } catch (error) {
    console.error('❌ Login test failed:', error.message);
    return false;
  }
}

async function testExistingUser(page) {
  console.log('\n🧪 Testing Login with Existing User...');
  console.log('━'.repeat(50));
  console.log('Using credentials: admin@cluby.com / password123');
  
  return await testLogin(page, 'admin@cluby.com', 'password123');
}

async function takeScreenshot(page, name) {
  try {
    const filename = `screenshot-${name}-${Date.now()}.png`;
    await page.screenshot({ path: filename, fullPage: true });
    console.log(`📸 Screenshot saved: ${filename}`);
  } catch (error) {
    console.log('⚠️  Could not save screenshot:', error.message);
  }
}

async function runTests() {
  console.log('🚀 Starting Browser Authentication Tests');
  console.log('=' .repeat(50));
  console.log(`Frontend URL: ${FRONTEND_URL}`);
  console.log(`Timestamp: ${new Date().toISOString()}`);
  console.log('=' .repeat(50));
  
  let browser;
  let registrationSuccess = false;
  let loginSuccess = false;
  let existingUserLoginSuccess = false;
  
  try {
    // Launch browser
    console.log('\n🌐 Launching browser...');
    browser = await chromium.launch({ 
      headless: false, // Set to true for headless mode
      slowMo: 500 // Slow down actions for visibility
    });
    
    const context = await browser.newContext({
      viewport: { width: 1280, height: 720 }
    });
    
    const page = await context.newPage();
    console.log('✓ Browser launched successfully');
    
    // Test 1: Registration
    registrationSuccess = await testRegistration(page);
    if (registrationSuccess) {
      await takeScreenshot(page, 'registration-success');
    } else {
      await takeScreenshot(page, 'registration-failed');
    }
    
    // Clear storage for fresh login test
    await page.evaluate(() => localStorage.clear());
    await delay(1000);
    
    // Test 2: Login with newly created user
    if (registrationSuccess) {
      loginSuccess = await testLogin(page);
      if (loginSuccess) {
        await takeScreenshot(page, 'login-success');
      } else {
        await takeScreenshot(page, 'login-failed');
      }
    }
    
    // Clear storage again
    await page.evaluate(() => localStorage.clear());
    await delay(1000);
    
    // Test 3: Login with existing user
    existingUserLoginSuccess = await testExistingUser(page);
    if (existingUserLoginSuccess) {
      await takeScreenshot(page, 'existing-user-login-success');
    } else {
      await takeScreenshot(page, 'existing-user-login-failed');
    }
    
    // Keep browser open for inspection
    console.log('\n⏸️  Browser will stay open for 5 seconds for inspection...');
    await delay(5000);
    
  } catch (error) {
    console.error('\n❌ Test execution failed:', error);
  } finally {
    if (browser) {
      await browser.close();
      console.log('\n🔒 Browser closed');
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('📊 TEST SUMMARY');
  console.log('='.repeat(50));
  console.log(`Registration Test:        ${registrationSuccess ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Login Test (New User):    ${loginSuccess ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Login Test (Existing):    ${existingUserLoginSuccess ? '✅ PASSED' : '❌ FAILED'}`);
  console.log('='.repeat(50));
  
  const allPassed = registrationSuccess && (loginSuccess || existingUserLoginSuccess);
  console.log(`\n${allPassed ? '✅ All critical tests passed!' : '⚠️  Some tests failed - check logs above'}`);
  
  process.exit(allPassed ? 0 : 1);
}

// Check if Playwright is installed
try {
  await import('playwright');
  runTests();
} catch (error) {
  console.error('❌ Playwright is not installed!');
  console.log('\n📦 To install Playwright, run:');
  console.log('   npm install -D playwright');
  console.log('   npx playwright install');
  console.log('\nOr with bun:');
  console.log('   bun add -d playwright');
  console.log('   bunx playwright install');
  process.exit(1);
}
