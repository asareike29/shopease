import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '../types';
import { authService } from '../services/authService';

interface AuthContextType {
  currentUser: User | null;
  isLoggedIn: boolean;
  login: (data: any) => Promise<void>;
  register: (data: any) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('shopease_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const isLoggedIn = !!currentUser;

  const login = async (data: any) => {
    const user = await authService.login(data);
    setCurrentUser(user);
    localStorage.setItem('shopease_user', JSON.stringify(user));
  };

  const register = async (data: any) => {
    const user = await authService.register(data);
    setCurrentUser(user);
    localStorage.setItem('shopease_user', JSON.stringify(user));
  };

  const logout = async () => {
    await authService.logout();
    setCurrentUser(null);
  };

  useEffect(() => {
    const checkAuth = async () => {
      const savedUser = localStorage.getItem('shopease_user');
      if (savedUser) {
        try {
          const user = await authService.getMe();
          setCurrentUser(user);
          localStorage.setItem('shopease_user', JSON.stringify(user));
        } catch (e) {
          setCurrentUser(null);
          localStorage.removeItem('shopease_user');
          localStorage.removeItem('shopease_token');
        }
      }
    };
    checkAuth();
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser, isLoggedIn, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
