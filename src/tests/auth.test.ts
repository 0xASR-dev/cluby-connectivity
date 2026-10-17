import { describe, it, expect, vi, beforeEach } from 'vitest';
import { authService } from '@/lib/services/auth.service';
import axios from 'axios';

// Mock axios
vi.mock('axios');

describe('Authentication Service', () => {
  beforeEach(() => {
    // Clear any mocks and reset the service before each test
    vi.clearAllMocks();
    authService.logout();
  });

  describe('login', () => {
    // Admin Login Test
    it('should handle successful admin login', async () => {
      const mockAdminUser = {
        _id: '680974e0aeaf3d8e1784044a',
        email: 'admin@cluby.com',
        fullName: 'Admin User',
        role: 'admin',
        status: 'active'
      };

      const mockResponse = {
        data: {
          success: true,
          data: {
            user: mockAdminUser,
            token: 'mock-admin-token'
          }
        }
      };

      (axios.post as any).mockResolvedValueOnce(mockResponse);

      const response = await authService.login({
        email: 'admin@cluby.com',
        password: 'admin123456'
      });

      expect(response.user).toBeDefined();
      expect(response.token).toBe('mock-admin-token');
      expect(response.user?.role).toBe('admin');
    });

    // Club Representatives Login Tests
    it('should handle successful tech club rep login', async () => {
      const mockTechClubUser = {
        _id: '680974e0aeaf3d8e1784044b',
        email: 'tech.club@cluby.com',
        fullName: 'Tech Club Rep',
        role: 'club_rep',
        status: 'active'
      };

      const mockResponse = {
        data: {
          success: true,
          data: {
            user: mockTechClubUser,
            token: 'mock-tech-token'
          }
        }
      };

      (axios.post as any).mockResolvedValueOnce(mockResponse);

      const response = await authService.login({
        email: 'tech.club@cluby.com',
        password: 'clubrep123456'
      });

      expect(response.user).toBeDefined();
      expect(response.token).toBe('mock-tech-token');
      expect(response.user?.role).toBe('club_rep');
    });

    it('should handle successful arts club rep login', async () => {
      const mockArtsClubUser = {
        _id: '680974e0aeaf3d8e1784044c',
        email: 'arts.club@cluby.com',
        fullName: 'Arts Club Rep',
        role: 'club_rep',
        status: 'active'
      };

      const mockResponse = {
        data: {
          success: true,
          data: {
            user: mockArtsClubUser,
            token: 'mock-arts-token'
          }
        }
      };

      (axios.post as any).mockResolvedValueOnce(mockResponse);

      const response = await authService.login({
        email: 'arts.club@cluby.com',
        password: 'clubrep123456'
      });

      expect(response.user).toBeDefined();
      expect(response.token).toBe('mock-arts-token');
      expect(response.user?.role).toBe('club_rep');
    });

    // Student Login Tests
    it('should handle successful student1 login', async () => {
      const mockStudent1User = {
        _id: '680974e0aeaf3d8e1784044e',
        email: 'student1@cluby.com',
        fullName: 'Student One',
        role: 'student',
        status: 'active'
      };

      const mockResponse = {
        data: {
          success: true,
          data: {
            user: mockStudent1User,
            token: 'mock-student1-token'
          }
        }
      };

      (axios.post as any).mockResolvedValueOnce(mockResponse);

      const response = await authService.login({
        email: 'student1@cluby.com',
        password: 'student123456'
      });

      expect(response.user).toBeDefined();
      expect(response.token).toBe('mock-student1-token');
      expect(response.user?.role).toBe('student');
    });

    it('should handle successful student2 login', async () => {
      const mockStudent2User = {
        _id: '680974e0aeaf3d8e1784044f',
        email: 'student2@cluby.com',
        fullName: 'Student Two',
        role: 'student',
        status: 'active'
      };

      const mockResponse = {
        data: {
          success: true,
          data: {
            user: mockStudent2User,
            token: 'mock-student2-token'
          }
        }
      };

      (axios.post as any).mockResolvedValueOnce(mockResponse);

      const response = await authService.login({
        email: 'student2@cluby.com',
        password: 'student123456'
      });

      expect(response.user).toBeDefined();
      expect(response.token).toBe('mock-student2-token');
      expect(response.user?.role).toBe('student');
    });

    // Error Cases
    it('should handle login failure with invalid credentials', async () => {
      const mockErrorResponse = {
        response: {
          data: {
            message: 'Invalid email or password'
          },
          status: 401
        }
      };

      (axios.post as any).mockRejectedValueOnce(mockErrorResponse);

      const response = await authService.login({
        email: 'wrong@cluby.com',
        password: 'wrongpassword'
      });

      expect(response.user).toBeNull();
      expect(response.token).toBeNull();
      expect(response.error).toBeDefined();
      expect(response.error?.message).toContain('Invalid email or password');
    });

    it('should handle server connection error', async () => {
      const mockErrorResponse = {
        message: 'Server is not responding. Please check your connection.'
      };

      (axios.post as any).mockRejectedValueOnce(new Error(mockErrorResponse.message));

      const response = await authService.login({
        email: 'admin@cluby.com',
        password: 'admin123456'
      });

      expect(response.user).toBeNull();
      expect(response.token).toBeNull();
      expect(response.error).toBeDefined();
      expect(response.error?.message).toBe(mockErrorResponse.message);
    });
  });

  describe('register', () => {
    it('should handle successful registration', async () => {
      const mockUser = {
        _id: '123',
        email: 'newuser@example.com',
        fullName: 'New User',
        role: 'student',
        status: 'pending'
      };

      const mockResponse = {
        data: {
          success: true,
          data: {
            user: mockUser,
            token: 'mock-register-token'
          }
        }
      };

      (axios.post as any).mockResolvedValueOnce(mockResponse);

      const response = await authService.register({
        email: 'newuser@example.com',
        password: 'password123',
        fullName: 'New User',
        role: 'student'
      });

      expect(response.user).toBeDefined();
      expect(response.token).toBe('mock-register-token');
      expect(response.user?.email).toBe('newuser@example.com');
    });
  });

  describe('token verification', () => {
    beforeEach(() => {
      // Clear any existing tokens
      localStorage.clear();
      authService.logout();
    });

    it('should handle valid token verification', async () => {
      const mockUser = {
        _id: '680974e0aeaf3d8e1784044a',
        email: 'admin@cluby.com',
        fullName: 'Admin User',
        role: 'admin',
        status: 'active'
      };

      const mockResponse = {
        data: {
          success: true,
          data: {
            user: mockUser
          }
        }
      };

      // Set up the mock token before the request
      const mockToken = 'mock-admin-token';
      localStorage.setItem('auth_token', mockToken);
      
      // Force the auth service to reinitialize with the new token
      (authService as any).token = mockToken;
      
      // Mock the axios get request
      (axios.get as any).mockResolvedValueOnce(mockResponse);

      const response = await authService.verifyToken();

      expect(response.user).toBeDefined();
      expect(response.user).toEqual(mockUser);
      expect(response.token).toBe(mockToken);
    });

    it('should handle invalid token', async () => {
      (axios.get as any).mockRejectedValueOnce(new Error('Invalid token'));
      localStorage.setItem('auth_token', 'invalid-token');

      const response = await authService.verifyToken();

      expect(response.user).toBeNull();
      expect(response.token).toBeNull();
      expect(response.error).toBeDefined();
      expect(response.error?.message).toContain('Token verification failed');
    });
  });
}); 