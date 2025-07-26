'use client';

import { createContext, useContext, useEffect, useState } from 'react';

type UserRole = 'admin' | 'doctor' | 'patient';

interface User {
  _id: string;
  name: string;
  email: string;
  // Add more fields as per your API
}

interface AuthContextType {
  user: User | null;
  role: UserRole | null;
  token: string | null;
  login: (user: User, role: UserRole, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('userData') || 'null');
    const storedRole = localStorage.getItem('userRole') as UserRole | null;
    const storedToken = localStorage.getItem('token');

    if (storedUser && storedRole && storedToken) {
      setUser(storedUser);
      setRole(storedRole);
      setToken(storedToken);
    }
  }, []);

  const login = (user: User, role: UserRole, token: string) => {
    setUser(user);
    setRole(role);
    setToken(token);
    localStorage.setItem('userData', JSON.stringify(user));
    localStorage.setItem('userRole', role);
    localStorage.setItem('token', token);
  };

  const logout = () => {
    setUser(null);
    setRole(null);
    setToken(null);
    localStorage.removeItem('userData');
    localStorage.removeItem('userRole');
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ user, role, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
