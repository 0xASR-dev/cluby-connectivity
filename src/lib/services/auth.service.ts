import axios, { AxiosError } from 'axios';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  fullName: string;
  role: 'student' | 'club_rep' | 'admin';
  department?: string;
  year?: string;
  clubId?: string;
}

export interface User {
  _id: string;
  email: string;
  fullName: string;
  role: string;
  clubId?: string;
  department?: string;
  year?: string;
  status: string;
  lastLogin?: Date;
  createdAt?: Date;
}

export interface AuthResponse {
  user: User | null;
  token: string | null;
  error?: Error;
}

class AuthService {
  private token: string | null = null;
  private baseURL: string;

  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
    
    if (typeof window !== 'undefined') {
      this.token = localStorage.getItem('auth_token');
    }

    this.setupAxiosDefaults();
  }

  private setupAxiosDefaults() {
    axios.defaults.baseURL = this.baseURL;
    axios.defaults.headers.common['Content-Type'] = 'application/json';
    axios.defaults.withCredentials = true;
    
    if (this.token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
    }
  }

  async login(credentials: LoginCredentials): Promise<AuthResponse> {
    try {
      console.log(' Attempting login...');
      
      const response = await axios.post('/api/auth/login', credentials);
      
      console.log('Login response:', response.data);

      if (response.data.success && response.data.data) {
        const { token, user } = response.data.data;
        
        if (!token || !user) {
          throw new Error('Invalid response from server: missing token or user');
        }

        this.setToken(token);
        
        console.log(' Login successful');
        return { user, token };
      }
      
      throw new Error(response.data.message || 'Login failed');
      
    } catch (error) {
      console.error(' Login error:', error);
      
      this.logout();
      
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<any>;
        
        if (!axiosError.response) {
          return {
            user: null,
            token: null,
            error: new Error('Cannot connect to server. Please check your connection.')
          };
        }

        const errorMessage = axiosError.response?.data?.message || axiosError.message || 'Login failed';
        return {
          user: null,
          token: null,
          error: new Error(errorMessage)
        };
      }

      return {
        user: null,
        token: null,
        error: error instanceof Error ? error : new Error('An unexpected error occurred')
      };
    }
  }

  async register(data: RegisterData): Promise<AuthResponse> {
    try {
      console.log('📝 Attempting registration...');
      console.log('Registration URL:', `${this.baseURL}/api/auth/register`);
      
      const response = await axios.post('/api/auth/register', data);
      
      console.log('Registration response:', response.data);

      if (response.data.success && response.data.data) {
        const { token, user } = response.data.data;
        
        if (!token || !user) {
          throw new Error('Invalid response from server: missing token or user');
        }

        this.setToken(token);
        
        console.log(' Registration successful');
        return { user, token };
      }
      
      throw new Error(response.data.message || 'Registration failed');
      
    } catch (error) {
      console.error(' Registration error:', error);
      
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<any>;
        
        if (!axiosError.response) {
          return {
            user: null,
            token: null,
            error: new Error('Cannot connect to server. Please check your connection.')
          };
        }

        const errorMessage = axiosError.response?.data?.message || axiosError.message || 'Registration failed';
        return {
          user: null,
          token: null,
          error: new Error(errorMessage)
        };
      }

      return {
        user: null,
        token: null,
        error: error instanceof Error ? error : new Error('An unexpected error occurred')
      };
    }
  }

  async verifyToken(): Promise<AuthResponse> {
    try {
      if (!this.token) {
        throw new Error('No token found');
      }

      console.log('🔍 Verifying token...');
      
      const response = await axios.get('/api/auth/me', {
        headers: { Authorization: `Bearer ${this.token}` }
      });

      console.log('Token verification response:', response.data);

      if (response.data.success && response.data.data) {
        const user = response.data.data.user;
        
        if (!user) {
          throw new Error('Invalid response from server: missing user');
        }

        console.log(' Token verified successfully');
        return { user, token: this.token };
      }

      throw new Error(response.data.message || 'Token verification failed');
      
    } catch (error) {
      console.error(' Token verification error:', error);
      this.logout();
      
      if (axios.isAxiosError(error)) {
        const axiosError = error as AxiosError<any>;
        const errorMessage = axiosError.response?.data?.message || axiosError.message || 'Token verification failed';
        return {
          user: null,
          token: null,
          error: new Error(errorMessage)
        };
      }

      return {
        user: null,
        token: null,
        error: error instanceof Error ? error : new Error('An unexpected error occurred')
      };
    }
  }

  logout(): void {
    console.log(' Logging out...');
    this.token = null;
    
    if (typeof window !== 'undefined') {
      localStorage.removeItem('auth_token');
      delete axios.defaults.headers.common['Authorization'];
    }

    axios.post('/api/auth/logout').catch(() => {});
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  getToken(): string | null {
    return this.token;
  }

  private setToken(token: string): void {
    this.token = token;
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('auth_token', token);
      axios.defaults.headers.common['Authorization'] = `Bearer ${this.token}`;
    }
    
    console.log(' Token saved');
  }

  setupAxiosInterceptor(): void {
    axios.interceptors.request.use(
      (config) => {
        if (this.token && config.headers) {
          config.headers.Authorization = `Bearer ${this.token}`;
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.log(' Unauthorized - logging out');
          this.logout();
        }
        return Promise.reject(error);
      }
    );
  }
}

export const authService = new AuthService();
export default authService;
