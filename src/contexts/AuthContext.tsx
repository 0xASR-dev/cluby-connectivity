<<<<<<< HEAD
import React, { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import authService, { User, LoginCredentials, RegisterData } from '../lib/services/auth.service';
=======

import React, { createContext, useState, useContext, useEffect } from 'react';
>>>>>>> 5c0145fb4b60299445eee33f2a48bfb2fa84bcc8
import { toast } from '@/components/ui/use-toast';
import { registerUser, loginUser, getUserByToken, logoutUser } from '@/lib/mongodb/services/authService';

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

<<<<<<< HEAD
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
=======
export interface User {
  id: string;
  email: string;
  role: UserRole;
  club_id?: string;
  profile?: Profile;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
>>>>>>> 5c0145fb4b60299445eee33f2a48bfb2fa84bcc8
  isLoading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

<<<<<<< HEAD
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
=======
const AuthContext = createContext<AuthContextType>({
  user: null,
  token: null,
  isLoading: true,
  login: async () => {},
  logout: async () => {},
  register: async () => {},
  refreshUser: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
>>>>>>> 5c0145fb4b60299445eee33f2a48bfb2fa84bcc8
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

<<<<<<< HEAD
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
=======
  const register = async (name: string, email: string, password: string, role: UserRole) => {
    setIsLoading(true);
    try {
      const result = await registerUser({ name, email, password, role });
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      setUser(result.user);
      setToken(result.token!);
      localStorage.setItem('cluby_auth_token', result.token!);
      
      toast({
        title: "Registration successful",
        description: "Welcome to Cluby! Your account has been created."
      });
    } catch (error: any) {
      console.error("Registration error:", error);
      toast({
        title: "Registration failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive"
      });
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const result = await loginUser({ email, password });
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      setUser(result.user);
      setToken(result.token!);
      localStorage.setItem('cluby_auth_token', result.token!);
      
      toast({
        title: "Login successful",
        description: `Welcome back!`,
      });
    } catch (error: any) {
      console.error("Login exception:", error);
      toast({
        title: "Login failed",
        description: error.message || "Invalid credentials. Please try again.",
>>>>>>> 5c0145fb4b60299445eee33f2a48bfb2fa84bcc8
        variant: "destructive",
      });
      throw error;
    }
  };

<<<<<<< HEAD
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
=======
  const logout = async () => {
    try {
      setIsLoading(true);
      await logoutUser();
      setUser(null);
      setToken(null);
      localStorage.removeItem('cluby_auth_token');
      
>>>>>>> 5c0145fb4b60299445eee33f2a48bfb2fa84bcc8
      toast({
        title: "Goodbye!",
        description: "You have been logged out successfully",
      });
<<<<<<< HEAD
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
=======
    } catch (error: any) {
      toast({
        title: "Logout failed",
        description: error.message || "Something went wrong. Please try again.",
        variant: "destructive",
      });
      console.error("Logout error:", error);
    } finally {
      setIsLoading(false);
    }
>>>>>>> 5c0145fb4b60299445eee33f2a48bfb2fa84bcc8
  };

  const refreshUser = async () => {
    const storedToken = localStorage.getItem('cluby_auth_token');
    if (!storedToken) {
      setIsLoading(false);
      return;
    }
    
    try {
      setIsLoading(true);
      const result = await getUserByToken(storedToken);
      
      if (result.success && result.user) {
        setUser(result.user);
        setToken(storedToken);
      } else {
        // Clear invalid token
        localStorage.removeItem('cluby_auth_token');
        setUser(null);
        setToken(null);
      }
    } catch (error) {
      console.error('Error refreshing user:', error);
      localStorage.removeItem('cluby_auth_token');
      setUser(null);
      setToken(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Check for existing session on load
  useEffect(() => {
    refreshUser();
  }, []);

  return (
<<<<<<< HEAD
    <AuthContext.Provider value={value}>
=======
    <AuthContext.Provider 
      value={{ 
        user, 
        token,
        isLoading, 
        login, 
        logout, 
        register,
        refreshUser
      }}
    >
>>>>>>> 5c0145fb4b60299445eee33f2a48bfb2fa84bcc8
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
