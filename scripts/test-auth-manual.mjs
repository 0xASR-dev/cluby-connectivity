/**
 * Manual Browser Authentication Test Helper
 * Opens browser to test authentication and provides test credentials
 * 
 * Usage: node scripts/test-auth-manual.mjs
 */

import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

const FRONTEND_URL = 'http://localhost:5173';
const BACKEND_URL = 'http://localhost:3000';

// Test users from database
const TEST_USERS = [
  {
    email: 'admin@cluby.com',
    password: 'password123',
    role: 'admin',
    description: 'Admin user with full access'
  },
  {
    email: 'john.doe@university.edu',
    password: 'password123',
    role: 'club_rep',
    description: 'Club representative'
  },
  {
    email: 'jane.smith@university.edu',
    password: 'password123',
    role: 'student',
    description: 'Regular student user'
  }
];

function printBanner() {
  console.log('╔' + '═'.repeat(70) + '╗');
  console.log('║' + ' '.repeat(15) + '🔐 AUTHENTICATION TEST HELPER' + ' '.repeat(26) + '║');
  console.log('╚' + '═'.repeat(70) + '╝');
  console.log();
}

function printServerStatus() {
  console.log('📡 SERVER ENDPOINTS');
  console.log('━'.repeat(70));
  console.log(`   Frontend:  ${FRONTEND_URL}`);
  console.log(`   Backend:   ${BACKEND_URL}`);
  console.log(`   Auth API:  ${BACKEND_URL}/api/auth`);
  console.log();
}

function printTestUsers() {
  console.log('👥 TEST USERS (All passwords: password123)');
  console.log('━'.repeat(70));
  
  TEST_USERS.forEach((user, index) => {
    console.log(`\n   ${index + 1}. ${user.role.toUpperCase()}`);
    console.log(`      Email:    ${user.email}`);
    console.log(`      Password: ${user.password}`);
    console.log(`      Info:     ${user.description}`);
  });
  console.log();
}

function printNewUserTemplate() {
  console.log('➕ CREATE NEW USER');
  console.log('━'.repeat(70));
  console.log('   To test registration, use the following template:');
  console.log();
  console.log('   For STUDENT:');
  console.log('   ├─ Email:      your.email@example.com');
  console.log('   ├─ Password:   YourPassword123!');
  console.log('   ├─ Full Name:  Your Full Name');
  console.log('   ├─ Role:       student');
  console.log('   ├─ Department: Computer Science (or any)');
  console.log('   └─ Year:       1-4');
  console.log();
  console.log('   For CLUB_REP:');
  console.log('   ├─ Email:      rep.email@example.com');
  console.log('   ├─ Password:   YourPassword123!');
  console.log('   ├─ Full Name:  Rep Full Name');
  console.log('   ├─ Role:       club_rep');
  console.log('   └─ Club ID:    (optional)');
  console.log();
}

function printTestSteps() {
  console.log('✅ TEST STEPS');
  console.log('━'.repeat(70));
  console.log();
  console.log('   LOGIN TEST:');
  console.log('   1. Browser will open to the login page');
  console.log('   2. Enter one of the test user credentials above');
  console.log('   3. Click "Login" or "Sign In"');
  console.log('   4. You should be redirected to the dashboard');
  console.log('   5. Check that your name appears in the header/profile');
  console.log();
  console.log('   REGISTRATION TEST:');
  console.log('   1. Switch to the "Register" or "Sign Up" tab');
  console.log('   2. Fill in the form with new user details');
  console.log('   3. Select appropriate role (student/club_rep)');
  console.log('   4. Fill role-specific fields (department/year for students)');
  console.log('   5. Click "Register" or "Sign Up"');
  console.log('   6. You should be redirected to dashboard or see success message');
  console.log();
  console.log('   LOGOUT TEST:');
  console.log('   1. Find the logout button (usually in header/profile menu)');
  console.log('   2. Click logout');
  console.log('   3. You should be redirected back to login page');
  console.log('   4. Verify you cannot access dashboard without logging in');
  console.log();
}

function printDevTools() {
  console.log('🔧 BROWSER DEVTOOLS CHECKS');
  console.log('━'.repeat(70));
  console.log('   Press F12 to open Developer Tools, then check:');
  console.log();
  console.log('   CONSOLE TAB:');
  console.log('   ├─ Look for authentication-related logs');
  console.log('   ├─ Check for any error messages (red text)');
  console.log('   └─ Verify API calls to /api/auth/login and /api/auth/register');
  console.log();
  console.log('   NETWORK TAB:');
  console.log('   ├─ Filter by "Fetch/XHR"');
  console.log('   ├─ Watch for requests to /api/auth/* endpoints');
  console.log('   ├─ Check status codes (200 = success, 400/401 = error)');
  console.log('   └─ Inspect request payload and response data');
  console.log();
  console.log('   APPLICATION TAB:');
  console.log('   ├─ Go to "Local Storage" → ' + FRONTEND_URL);
  console.log('   ├─ Look for "auth_token" entry');
  console.log('   └─ This should appear after successful login');
  console.log();
}

function printTroubleshooting() {
  console.log('⚠️  TROUBLESHOOTING');
  console.log('━'.repeat(70));
  console.log();
  console.log('   If servers are not running:');
  console.log('   ├─ Backend:  npm run dev (or bun run dev)');
  console.log('   └─ Frontend: npm run dev (in separate terminal)');
  console.log();
  console.log('   If login fails:');
  console.log('   ├─ Check console for error messages');
  console.log('   ├─ Verify backend is running on port 3000');
  console.log('   ├─ Check Network tab for failed requests');
  console.log('   └─ Try with admin@cluby.com / password123');
  console.log();
  console.log('   If registration fails:');
  console.log('   ├─ Ensure all required fields are filled');
  console.log('   ├─ Use a unique email address');
  console.log('   ├─ Password should be strong (8+ chars)');
  console.log('   └─ Check role-specific fields are filled correctly');
  console.log();
}

async function openBrowser() {
  const url = `${FRONTEND_URL}/auth`;
  
  console.log('🌐 OPENING BROWSER');
  console.log('━'.repeat(70));
  console.log(`   URL: ${url}`);
  console.log();
  
  try {
    // Try to open browser based on OS
    let command;
    if (process.platform === 'win32') {
      command = `start ${url}`;
    } else if (process.platform === 'darwin') {
      command = `open ${url}`;
    } else {
      command = `xdg-open ${url}`;
    }
    
    await execAsync(command);
    console.log('✅ Browser opened successfully!');
    console.log();
  } catch (error) {
    console.log('⚠️  Could not auto-open browser');
    console.log(`   Please manually navigate to: ${url}`);
    console.log();
  }
}

async function checkServers() {
  console.log('🔍 CHECKING SERVER STATUS');
  console.log('━'.repeat(70));
  
  let frontendRunning = false;
  let backendRunning = false;
  
  // Check frontend
  try {
    const response = await fetch(FRONTEND_URL, { method: 'HEAD' });
    frontendRunning = response.ok;
    console.log(`   Frontend (${FRONTEND_URL}): ✅ Running`);
  } catch (error) {
    console.log(`   Frontend (${FRONTEND_URL}): ❌ Not responding`);
  }
  
  // Check backend
  try {
    const response = await fetch(`${BACKEND_URL}/api/auth/me`, { method: 'GET' });
    backendRunning = true; // Even 401 means server is running
    console.log(`   Backend  (${BACKEND_URL}):  ✅ Running`);
  } catch (error) {
    console.log(`   Backend  (${BACKEND_URL}):  ❌ Not responding`);
  }
  
  console.log();
  
  if (!frontendRunning || !backendRunning) {
    console.log('⚠️  WARNING: Some servers are not running!');
    console.log('   Start them before testing:');
    if (!backendRunning) {
      console.log('   └─ Backend:  npm run dev');
    }
    if (!frontendRunning) {
      console.log('   └─ Frontend: npm run dev (separate terminal)');
    }
    console.log();
    return false;
  }
  
  return true;
}

async function main() {
  printBanner();
  printServerStatus();
  
  const serversReady = await checkServers();
  
  console.log();
  printTestUsers();
  printNewUserTemplate();
  printTestSteps();
  printDevTools();
  printTroubleshooting();
  
  if (serversReady) {
    console.log('━'.repeat(70));
    console.log();
    console.log('🚀 Ready to test! Opening browser in 3 seconds...');
    console.log();
    console.log('   Keep this terminal open to see the reference information above.');
    console.log();
    
    await new Promise(resolve => setTimeout(resolve, 3000));
    await openBrowser();
    
    console.log('💡 TIP: Press Ctrl+C to close this helper when done testing.');
    console.log();
  } else {
    console.log('━'.repeat(70));
    console.log();
    console.log('❌ Please start the servers first, then run this script again.');
    console.log();
    process.exit(1);
  }
}

main().catch(console.error);
