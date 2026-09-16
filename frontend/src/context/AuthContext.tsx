import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';
import { getStoredUser, setStoredSession, clearStoredSession, apiFetch } from '../lib/api';

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password?: string) => Promise<User>;
  register: (data: { email: string; fullName: string; phone: string; country: string; password?: string }) => Promise<User>;
  sendRegistrationOtp: (email: string, phone?: string) => Promise<{ success: boolean; message: string; otpPreview?: string }>;
  validateOtpCode: (email: string, otp: string) => Promise<{ success: boolean; message: string }>;
  verifyAndRegisterWithOtp: (data: { email: string; fullName: string; phone: string; country: string; password?: string; otp: string }) => Promise<User>;
  logout: () => void;
  quickSwitchUser: (email: string) => Promise<void>;
  updateUserInState: (updated: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const stored = getStoredUser();
    if (stored) {
      setUser(stored);
      setToken(`fake-jwt-token-${stored.id}`);
    } else {
      // Default initial session for quick demo evaluation if wanted
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password = 'password123'): Promise<User> => {
    const res = await apiFetch<{ token: string; user: User }>('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
    setStoredSession(res.token, res.user);
    setUser(res.user);
    setToken(res.token);
    return res.user;
  };

  const register = async (data: { email: string; fullName: string; phone: string; country: string; password?: string }): Promise<User> => {
    const res = await apiFetch<{ token: string; user: User }>('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ ...data, password: data.password || 'password123' }),
    });
    setStoredSession(res.token, res.user);
    setUser(res.user);
    setToken(res.token);
    return res.user;
  };

  const sendRegistrationOtp = async (email: string, phone?: string) => {
    const res = await apiFetch<{ success: boolean; message: string; otpPreview?: string }>('/api/auth/send-otp', {
      method: 'POST',
      body: JSON.stringify({ email, phone, isNewRegistration: true }),
    });
    return res;
  };

  const validateOtpCode = async (email: string, otp: string) => {
    const res = await apiFetch<{ success: boolean; message: string }>('/api/auth/validate-otp', {
      method: 'POST',
      body: JSON.stringify({ email, otp }),
    });
    return res;
  };

  const verifyAndRegisterWithOtp = async (data: {
    email: string;
    fullName: string;
    phone: string;
    country: string;
    password?: string;
    otp: string;
  }): Promise<User> => {
    const res = await apiFetch<{ success: boolean; message: string; token: string; user: User }>('/api/auth/verify-otp-register', {
      method: 'POST',
      body: JSON.stringify({ ...data, password: data.password || 'password123' }),
    });
    setStoredSession(res.token, res.user);
    setUser(res.user);
    setToken(res.token);
    return res.user;
  };

  const quickSwitchUser = async (email: string) => {
    try {
      const u = await login(email, 'admin123');
      setUser(u);
    } catch {
      // If password failed, try with fallback
      const u = await login(email, 'password123');
      setUser(u);
    }
  };

  const logout = () => {
    clearStoredSession();
    setUser(null);
    setToken(null);
  };

  const updateUserInState = (updated: User) => {
    setUser(updated);
    if (token) setStoredSession(token, updated);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        login,
        register,
        sendRegistrationOtp,
        validateOtpCode,
        verifyAndRegisterWithOtp,
        logout,
        quickSwitchUser,
        updateUserInState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
