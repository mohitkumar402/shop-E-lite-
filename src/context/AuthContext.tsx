import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User, AuthContextType } from '../types';
import { storage } from '../utils/storage';

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [sessionExpiry, setSessionExpiry] = useState<number | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const session = storage.getSession();
    if (session) {
      setUser(session.user);
      setSessionExpiry(session.expiry);
      setIsAuthenticated(true);
      
      const timeUntilExpiry = session.expiry - Date.now();
      if (timeUntilExpiry > 0) {
        const timer = setTimeout(() => {
          logout();
        }, timeUntilExpiry);
        
        return () => clearTimeout(timer);
      } else {
        logout();
      }
    }
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const foundUser = storage.findUser(email);
      
      if (foundUser && foundUser.password === password) {
        // Set admin flag for admin users (admin@test.com or any email with 'admin')
        const userWithRole = {
          ...foundUser,
          isAdmin: email.toLowerCase().includes('admin')
        };
        
        storage.setSession(userWithRole);
        setUser(userWithRole);
        setIsAuthenticated(true);
        
        const newSessionExpiry = Date.now() + (15 * 60 * 1000);
        setSessionExpiry(newSessionExpiry);
        
        setTimeout(() => {
          logout();
        }, 15 * 60 * 1000);
        
        return true;
      }
      
      return false;
    } catch (error) {
      console.error('Login error:', error);
      return false;
    }
  };

  const register = async (userData: Omit<User, 'id'>): Promise<boolean> => {
    try {
      const existingUser = storage.findUser(userData.email);
      if (existingUser) {
        return false;
      }
      
      const newUser: User = {
        id: Date.now().toString(),
        ...userData
      };
      
      storage.saveUser(newUser);
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      return false;
    }
  };

  const logout = () => {
    storage.clearSession();
    setUser(null);
    setIsAuthenticated(false);
    setSessionExpiry(null);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      const updatedUser = { ...user, ...updates };
      storage.saveUser(updatedUser);
      setUser(updatedUser);
      storage.setSession(updatedUser);
    }
  };

  const value: AuthContextType = {
    user,
    login,
    register,
    logout,
    updateProfile,
    isAuthenticated,
    sessionExpiry
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
