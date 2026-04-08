export interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

export const PAYMENT_METHODS = ['Cash', 'GCash', 'Bank Transfer', 'Credit Card'];

export interface Expense {
  id: string;
  amount: number;
  category: string;
  date: string;
  description: string;
  paymentMethod: string;
}

export interface Debt {
  id: string;
  personName: string;
  amount: number;
  type: 'lent' | 'borrowed';
  dueDate: string;
  status: 'pending' | 'partial' | 'paid';
  notes: string;
  paidAmount: number;
}

export interface Wallet {
  id: string;
  name: string;
  balance: number;
  icon: string;
  color: string;
}

export interface SavingsGoal {
  id: string;
  name: string;
  target: number;
  saved: number;
  deadline: string;
  icon: string;
}

export interface Notification {
  id: string;
  type: 'warning' | 'info' | 'success' | 'error';
  title: string;
  message: string;
  date: string;
  read: boolean;
}















export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);
};
