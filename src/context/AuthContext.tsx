import type React from 'react';
import { createContext, useContext, useState, useEffect } from 'react';
import axiosInstance from '../utils/axiosConfig';
import axios from 'axios';

interface AuthContextType {
  accessToken: string | null;
  user: any;
  isAuthenticated: boolean;
  login: (data: { employeeId: string; password: string }) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    return localStorage.getItem('isAuthenticated') === 'true';
  });
  const [accessToken, setAccessToken] = useState(() => {
    return localStorage.getItem('site') || null;
  });
  const [user, setUser] = useState<any>(() => {
    const userData = localStorage.getItem('user');
    return userData ? JSON.parse(userData) : null;
  });

  useEffect(() => {
    localStorage.setItem('isAuthenticated', isAuthenticated.toString());
    if (user) {
      localStorage.setItem('user', JSON.stringify(user));
    }
  }, [isAuthenticated, user]);

  const login = async (data: { employeeId: string; password: string }) => {
    try {
      const response = await axiosInstance.post(
        '/users/login',
        {
          email: data.employeeId,
          password: data.password,
        },
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 200) {
        const { access_token, token_type } = response.data;
        setAccessToken(access_token);
        localStorage.setItem('site', access_token);
        localStorage.setItem('tokenType', token_type);
        const userResponse = await axiosInstance.get('/users/me', {
          headers: {
            Authorization: `${token_type} ${access_token}`,
          },
        });
        console.log('userResponse', userResponse.data);
        setUser(userResponse.data);
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
        setAccessToken(null);
        setUser(null);
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const errorMessage =
          error.response?.data?.message ||
          JSON.stringify(error.response?.data) ||
          error.message;
        console.error('Login error:', errorMessage);
        console.error('Login error 1:', JSON.stringify(error));
      } else {
        console.error('An unexpected error occurred:', error);
      }
      setIsAuthenticated(false);
    }
  };

  const logout = () => {
    setAccessToken(null);
    setIsAuthenticated(false);
    localStorage.removeItem('site');
    localStorage.removeItem('tokenType');
    delete axios.defaults.headers.common['Authorization'];
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{ accessToken, user, isAuthenticated, login, logout }}
    >
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
