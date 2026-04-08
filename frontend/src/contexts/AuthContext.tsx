import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { authApi } from '@/lib/api';

export type Role = 'admin' | 'user';

export interface User {
  id: string;
  name: string;
  email: string;
  role: Role;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (name: string, email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  switchRole: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // On mount, verify stored token and load user
  useEffect(() => {
    const token = localStorage.getItem('budget_token');
    if (!token) {
      setLoading(false);
      return;
    }
    authApi.me()
      .then(u => setUser({ id: u.id, name: u.name, email: u.email, role: u.role as Role }))
      .catch(() => {
        localStorage.removeItem('budget_token');
        localStorage.removeItem('budget_user');
      })
      .finally(() => setLoading(false));
  }, []);

  const persistAuth = (token: string, u: User) => {
    localStorage.setItem('budget_token', token);
    localStorage.setItem('budget_user', JSON.stringify(u));
    setUser(u);
  };

  const login = async (email: string, password: string) => {
    try {
      const data = await authApi.login(email, password);
      const u: User = { id: data.user.id, name: data.user.name, email: data.user.email, role: data.user.role as Role };
      persistAuth(data.token, u);
      return { success: true };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : 'Login failed' };
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const data = await authApi.register(name, email, password);
      const u: User = { id: data.user.id, name: data.user.name, email: data.user.email, role: data.user.role as Role };
      persistAuth(data.token, u);
      return { success: true };
    } catch (err: unknown) {
      return { success: false, error: err instanceof Error ? err.message : 'Registration failed' };
    }
  };

  const logout = () => {
    localStorage.removeItem('budget_token');
    localStorage.removeItem('budget_user');
    setUser(null);
  };

  // Client-side role switch (for demo/admin access — backend role is the real one)
  const switchRole = () => {
    if (user) {
      const newUser = { ...user, role: user.role === 'admin' ? ('user' as Role) : ('admin' as Role) };
      setUser(newUser);
      localStorage.setItem('budget_user', JSON.stringify(newUser));
    }
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, loading, login, register, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}