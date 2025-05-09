"use client";

import { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '../utils/api';

interface User {
  id: string | number;
  name: string;
  email: string;
}

interface AuthResponse {
  token: string;
  user: User;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to get API URL with environment variable fallback
const getApiUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';
};

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check if user is logged in when the component mounts
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
    
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await api.post<AuthResponse>('/api/auth/login', { email, password });
      
      // Store token and user data
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      setToken(data.token);
      setUser(data.user);
      
      router.push('/dashboard');
    } catch (error: any) {
      console.error('Login error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    setIsLoading(true);
    try {
      const data = await api.post<AuthResponse>('/api/auth/register', { name, email, password });
      
      // For automatic login after registration
      // Uncomment these lines if you want to auto-login after registration
      // localStorage.setItem('token', data.token);
      // localStorage.setItem('user', JSON.stringify(data.user));
      // setToken(data.token);
      // setUser(data.user);
      // router.push('/dashboard');
      
      // For manual login after registration
      router.push('/login?registered=true');
    } catch (error: any) {
      console.error('Registration error:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async () => {
    setIsLoading(true);
    try {
      // Clear local storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      // Clear state
      setToken(null);
      setUser(null);
      
      router.push('/login');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthContext.Provider value={{ user, token, isLoading, login, register, logout }}>
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