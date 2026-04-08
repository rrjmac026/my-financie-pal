const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5000/api';

const getAuthHeaders = () => {
  const token = localStorage.getItem('budget_token');
  return token ? { 'x-auth-token': token } : {};
};

const apiRequest = async (endpoint: string, options: RequestInit = {}) => {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...getAuthHeaders(),
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.text();
    throw new Error(error || `HTTP ${response.status}`);
  }

  return response.json();
};

// Types
export interface Expense {
  _id?: string;
  id?: string;
  user: string;
  amount: number;
  category: string;
  date: string;
  description: string;
  paymentMethod: string;
  wallet?: string | { _id?: string; id?: string; name?: string };
  createdAt?: string;
}

export interface Wallet {
  _id?: string;
  id?: string;
  user: string;
  name: string;
  balance: number;
  icon: string;
  color: string;
  createdAt?: string;
}

export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

// Auth API
export const authApi = {
  login: async (email: string, password: string) => {
    return apiRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    });
  },

  register: async (name: string, email: string, password: string) => {
    return apiRequest('/auth/register', {
      method: 'POST',
      body: JSON.stringify({ name, email, password }),
    });
  },

  me: async () => {
    return apiRequest('/users/me');
  },
};

// Expenses API
export const expensesApi = {
  getAll: async (): Promise<Expense[]> => {
    return apiRequest('/expenses');
  },

  create: async (expense: Omit<Expense, '_id' | 'id' | 'user' | 'createdAt'>): Promise<Expense> => {
    return apiRequest('/expenses', {
      method: 'POST',
      body: JSON.stringify(expense),
    });
  },

  update: async (id: string, expense: Partial<Omit<Expense, '_id' | 'id' | 'user' | 'createdAt'>>): Promise<Expense> => {
    return apiRequest(`/expenses/${id}`, {
      method: 'PUT',
      body: JSON.stringify(expense),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiRequest(`/expenses/${id}`, {
      method: 'DELETE',
    });
  },
};

// Wallets API
export const walletsApi = {
  getAll: async (): Promise<Wallet[]> => {
    return apiRequest('/wallets');
  },

  create: async (wallet: Omit<Wallet, '_id' | 'id' | 'user' | 'createdAt'>): Promise<Wallet> => {
    return apiRequest('/wallets', {
      method: 'POST',
      body: JSON.stringify(wallet),
    });
  },

  update: async (id: string, wallet: Partial<Omit<Wallet, '_id' | 'id' | 'user' | 'createdAt'>>): Promise<Wallet> => {
    return apiRequest(`/wallets/${id}`, {
      method: 'PUT',
      body: JSON.stringify(wallet),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiRequest(`/wallets/${id}`, {
      method: 'DELETE',
    });
  },
};

export const categoriesApi = {
  getAll: async (): Promise<Category[]> => {
    return apiRequest('/categories');
  },

  create: async (category: Omit<Category, 'id'>): Promise<Category> => {
    return apiRequest('/categories', {
      method: 'POST',
      body: JSON.stringify(category),
    });
  },

  update: async (id: string, category: Omit<Category, 'id'>): Promise<Category> => {
    return apiRequest(`/categories/${id}`, {
      method: 'PUT',
      body: JSON.stringify(category),
    });
  },

  delete: async (id: string): Promise<void> => {
    return apiRequest(`/categories/${id}`, {
      method: 'DELETE',
    });
  },
};