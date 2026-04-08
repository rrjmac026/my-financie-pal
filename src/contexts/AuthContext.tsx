import { createContext, useContext, useState, ReactNode } from 'react';

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
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  switchRole: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => {
    const saved = localStorage.getItem('budget_user');
    return saved ? JSON.parse(saved) : null;
  });

  const persist = (u: User | null) => {
    setUser(u);
    if (u) localStorage.setItem('budget_user', JSON.stringify(u));
    else localStorage.removeItem('budget_user');
  };

  const login = async (email: string, _password: string) => {
    const role: Role = email.includes('admin') ? 'admin' : 'user';
    const u: User = { id: Date.now().toString(), name: role === 'admin' ? 'Admin User' : 'John Doe', email, role };
    persist(u);
    return true;
  };

  const register = async (name: string, email: string, _password: string) => {
    const u: User = { id: Date.now().toString(), name, email, role: 'user' };
    persist(u);
    return true;
  };

  const logout = () => persist(null);

  const switchRole = () => {
    if (user) persist({ ...user, role: user.role === 'admin' ? 'user' : 'admin' });
  };

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, switchRole }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
