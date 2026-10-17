# Authentication Testing Scripts

This directory contains scripts to test the authentication system in both automated and manual ways.

## Available Scripts

### 1. Manual Browser Test (Recommended for First-Time Testing)
**File:** `test-auth-manual.mjs`

Opens your browser and provides detailed instructions and test credentials.

```bash
node scripts/test-auth-manual.mjs
```

**Features:**
- ✅ No dependencies required
- ✅ Opens browser automatically
- ✅ Shows all test user credentials
- ✅ Provides step-by-step instructions
- ✅ Includes troubleshooting tips
- ✅ Checks server status before opening

**Best for:** Quick manual testing, learning the system, debugging issues

---

### 2. Automated Browser Test
**File:** `test-auth-browser.mjs`

Fully automated browser testing using Playwright.

```bash
# First, install Playwright
npm install -D playwright
npx playwright install

# Then run the test
node scripts/test-auth-browser.mjs
```

**Features:**
- ✅ Automated registration test
- ✅ Automated login test
- ✅ Tests with existing users
- ✅ Takes screenshots
- ✅ Detailed test reports
- ✅ Visible browser mode (can be made headless)

**Best for:** CI/CD pipelines, regression testing, comprehensive validation

---

## Prerequisites

Before running these tests, ensure:

1. **Backend server is running** on port 3000:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

2. **Frontend server is running** on port 5173:
   ```bash
   npm run dev  # in a separate terminal
   # or
   bun run dev
   ```

3. **MongoDB is connected** (check your `.env` file)

4. **User passwords are set** (run if needed):
   ```bash
   node scripts/fix-user-passwords.mjs
   ```

---

## Test Users

All existing users have the password: **`password123`**

| Email | Role | Description |
|-------|------|-------------|
| admin@cluby.com | admin | Full admin access |
| john.doe@university.edu | club_rep | Club representative |
| jane.smith@university.edu | student | Regular student |

---

## Manual Testing Checklist

### Login Test
- [ ] Navigate to login page
- [ ] Enter test user credentials
- [ ] Submit form
- [ ] Verify redirect to dashboard
- [ ] Check auth token in localStorage (F12 → Application → Local Storage)
- [ ] Verify user info displays correctly

### Registration Test
- [ ] Navigate to register page
- [ ] Fill all required fields
- [ ] Select role (student/club_rep/admin)
- [ ] Fill role-specific fields
- [ ] Submit form
- [ ] Verify success message or redirect
- [ ] Try logging in with new credentials

### Logout Test
- [ ] Click logout button
- [ ] Verify redirect to login page
- [ ] Check auth token is removed from localStorage
- [ ] Try accessing protected route (should redirect to login)

---

## Troubleshooting

### "Cannot find module 'playwright'"
Install Playwright:
```bash
npm install -D playwright
npx playwright install
```

### "Server not responding"
Make sure both servers are running:
```bash
# Terminal 1: Backend
npm run dev

# Terminal 2: Frontend  
npm run dev
```

### "Login fails with 401"
Reset user passwords:
```bash
node scripts/fix-user-passwords.mjs
```

### "Registration fails"
Check browser console (F12) for error messages. Common issues:
- Email already exists (use unique email)
- Missing required fields
- Role-specific fields not filled (students need department/year)

---

## Browser DevTools Tips

### Console Tab
Look for:
- `🔐 Login successful` - Login worked
- `🚀 Attempting to register user` - Registration started  
- `✅ Token saved` - Token stored successfully
- Red error messages - Something went wrong

### Network Tab
Filter by `Fetch/XHR` and watch for:
- `POST /api/auth/login` - Login request
- `POST /api/auth/register` - Registration request
- `GET /api/auth/me` - Get current user
- Status codes: 200/201 (success), 400 (bad request), 401 (unauthorized)

### Application Tab
Check `Local Storage → http://localhost:5173`:
- `auth_token` should appear after login
- Should be removed after logout

---

## CI/CD Integration

For automated testing in CI/CD:

```yaml
# Example GitHub Actions workflow
- name: Install Playwright
  run: |
    npm install -D playwright
    npx playwright install --with-deps

- name: Run Auth Tests
  run: node scripts/test-auth-browser.mjs
```

---

## Additional Resources

- [Auth Refactor Documentation](../AUTH_REFACTOR_COMPLETE.md)
- [Playwright Documentation](https://playwright.dev/)
- [API Documentation](../README.md)
