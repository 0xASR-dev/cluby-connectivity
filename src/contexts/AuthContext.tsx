import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService, { User, LoginCredentials, RegisterData } from '../lib/services/auth.service';
import { toast } from '@/components/ui/use-toast';

export type UserRole = 'student' | 'club_rep' | 'admin';

export interface Profile {
  id: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  department?: string;
  year?: string;
  bio?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Setup axios interceptor
    authService.setupAxiosInterceptor();
    
    const validateToken = async () => {
      try {
        const token = authService.getToken();
        if (!token) {
          setIsLoading(false);
          return;
        }

        const response = await authService.verifyToken();
        if (response.error || !response.user) {
          throw new Error(response.error?.message || 'Invalid token');
        }

        setUser(response.user);
      } catch (error) {
        console.error('Token validation error:', error);
        authService.logout();
        toast({
          title: "Session Expired",
          description: "Please log in again",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    validateToken();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      if (!credentials.email || !credentials.password) {
        throw new Error('Email and password are required');
      }

      const response = await authService.login(credentials);
      
      if (response.error) {
        throw response.error;
      }
      
      if (!response.user || !response.token) {
        throw new Error('Invalid response from server');
      }

      setUser(response.user);
      
      toast({
        title: "Welcome back!",
        description: `Logged in as ${response.user.fullName}`,
      });

      // Redirect based on user role and status
      if (response.user.status !== 'active') {
        navigate('/verify-account');
        return;
      }

      switch (response.user.role) {
        case 'admin':
          navigate('/admin/dashboard');
          break;
        case 'club_rep':
          navigate('/club/dashboard');
          break;
        default:
          navigate('/dashboard');
      }
    } catch (error) {
      console.error('Login error:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Unable to connect to server. Please try again.';
      
      toast({
        title: "Login Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      if (!data.email || !data.password || !data.fullName || !data.role) {
        throw new Error('All required fields must be filled');
      }

      const response = await authService.register(data);
      
      if (response.error) {
        throw response.error;
      }

      if (!response.user || !response.token) {
        throw new Error('Invalid response from server');
      }

      setUser(response.user);
      
      toast({
        title: "Welcome!",
        description: "Your account has been created successfully",
      });

      navigate('/dashboard');
    } catch (error) {
      console.error('Registration error:', error);
      const errorMessage = error instanceof Error 
        ? error.message 
        : 'Registration failed. Please try again.';
      
      toast({
        title: "Registration Failed",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    }
  };

  const logout = () => {
    try {
      authService.logout();
      setUser(null);
      toast({
        title: "Goodbye!",
        description: "You have been logged out successfully",
      });
      navigate('/login');
    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error, we want to clear the local state
      setUser(null);
      navigate('/login');
    }
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    register,
    logout
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
