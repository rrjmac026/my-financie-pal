export const CATEGORIES = [
  { id: '1', name: 'Food & Dining', icon: '🍔', color: '#2d8a9e' },
  { id: '2', name: 'Transportation', icon: '🚗', color: '#5cbdb9' },
  { id: '3', name: 'Shopping', icon: '🛍️', color: '#1a4a6e' },
  { id: '4', name: 'Bills & Utilities', icon: '💡', color: '#e85d3a' },
  { id: '5', name: 'Entertainment', icon: '🎬', color: '#8b5cf6' },
  { id: '6', name: 'Health', icon: '🏥', color: '#10b981' },
  { id: '7', name: 'Education', icon: '📚', color: '#f59e0b' },
  { id: '8', name: 'Others', icon: '📦', color: '#6b7280' },
];

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

export const mockExpenses: Expense[] = [
  { id: '1', amount: 450, category: 'Food & Dining', date: '2026-04-07', description: 'Lunch at Jollibee', paymentMethod: 'GCash' },
  { id: '2', amount: 150, category: 'Transportation', date: '2026-04-07', description: 'Grab ride to office', paymentMethod: 'GCash' },
  { id: '3', amount: 2500, category: 'Shopping', date: '2026-04-06', description: 'New shoes at SM', paymentMethod: 'Credit Card' },
  { id: '4', amount: 1800, category: 'Bills & Utilities', date: '2026-04-05', description: 'Electric bill - Meralco', paymentMethod: 'Bank Transfer' },
  { id: '5', amount: 350, category: 'Entertainment', date: '2026-04-04', description: 'Movie tickets', paymentMethod: 'Cash' },
  { id: '6', amount: 800, category: 'Food & Dining', date: '2026-04-03', description: 'Grocery at Puregold', paymentMethod: 'Cash' },
  { id: '7', amount: 500, category: 'Health', date: '2026-04-02', description: 'Vitamins at Mercury Drug', paymentMethod: 'GCash' },
  { id: '8', amount: 1200, category: 'Education', date: '2026-04-01', description: 'Udemy online course', paymentMethod: 'Credit Card' },
  { id: '9', amount: 280, category: 'Food & Dining', date: '2026-04-01', description: 'Coffee at Starbucks', paymentMethod: 'GCash' },
  { id: '10', amount: 3500, category: 'Bills & Utilities', date: '2026-03-30', description: 'Internet bill - PLDT', paymentMethod: 'Bank Transfer' },
];

export const mockDebts: Debt[] = [
  { id: '1', personName: 'Maria Santos', amount: 5000, type: 'lent', dueDate: '2026-04-15', status: 'pending', notes: 'For emergency expenses', paidAmount: 0 },
  { id: '2', personName: 'Juan Dela Cruz', amount: 3000, type: 'lent', dueDate: '2026-04-10', status: 'partial', notes: 'Birthday contribution', paidAmount: 1500 },
  { id: '3', personName: 'Pedro Reyes', amount: 8000, type: 'borrowed', dueDate: '2026-04-20', status: 'pending', notes: 'Tuition fee advance', paidAmount: 0 },
  { id: '4', personName: 'Ana Garcia', amount: 2000, type: 'borrowed', dueDate: '2026-03-30', status: 'paid', notes: 'Gas money', paidAmount: 2000 },
  { id: '5', personName: 'Carlo Mendoza', amount: 1500, type: 'lent', dueDate: '2026-05-01', status: 'pending', notes: 'Lunch money', paidAmount: 0 },
];

export const mockWallets: Wallet[] = [
  { id: '1', name: 'Cash', balance: 15000, icon: '💵', color: '#10b981' },
  { id: '2', name: 'GCash', balance: 8500, icon: '📱', color: '#0070f3' },
  { id: '3', name: 'BDO Savings', balance: 45000, icon: '🏦', color: '#1a4a6e' },
  { id: '4', name: 'Credit Card', balance: -12000, icon: '💳', color: '#e85d3a' },
];

export const mockSavingsGoals: SavingsGoal[] = [
  { id: '1', name: 'New Laptop', target: 45000, saved: 28000, deadline: '2026-06-30', icon: '💻' },
  { id: '2', name: 'Emergency Fund', target: 100000, saved: 62000, deadline: '2026-12-31', icon: '🛡️' },
  { id: '3', name: 'Travel to Japan', target: 80000, saved: 22000, deadline: '2026-10-15', icon: '✈️' },
  { id: '4', name: 'New Phone', target: 25000, saved: 25000, deadline: '2026-04-30', icon: '📱' },
];

export const mockNotifications: Notification[] = [
  { id: '1', type: 'warning', title: 'Budget Alert', message: 'You have reached 85% of your monthly Food budget (₱4,250 / ₱5,000)', date: '2026-04-07T10:30:00', read: false },
  { id: '2', type: 'info', title: 'Debt Reminder', message: 'Juan Dela Cruz owes you ₱1,500 — due in 3 days', date: '2026-04-07T09:00:00', read: false },
  { id: '3', type: 'success', title: 'Goal Achieved!', message: 'You reached your "New Phone" savings goal of ₱25,000 🎉', date: '2026-04-06T14:00:00', read: false },
  { id: '4', type: 'warning', title: 'Upcoming Due Date', message: 'Your debt to Pedro Reyes (₱8,000) is due on April 20', date: '2026-04-05T08:00:00', read: true },
  { id: '5', type: 'info', title: 'Monthly Summary Ready', message: 'Your March 2026 spending report is now available', date: '2026-04-01T06:00:00', read: true },
  { id: '6', type: 'error', title: 'Budget Exceeded', message: 'You exceeded your Shopping budget by ₱500 this month', date: '2026-03-31T20:00:00', read: true },
];

export const weeklySpending = [
  { day: 'Mon', amount: 850 },
  { day: 'Tue', amount: 1200 },
  { day: 'Wed', amount: 450 },
  { day: 'Thu', amount: 2100 },
  { day: 'Fri', amount: 1800 },
  { day: 'Sat', amount: 3200 },
  { day: 'Sun', amount: 600 },
];

export const monthlySpending = [
  { month: 'Nov', current: 25000, previous: 28000 },
  { month: 'Dec', current: 35000, previous: 30000 },
  { month: 'Jan', current: 28000, previous: 35000 },
  { month: 'Feb', current: 32000, previous: 28000 },
  { month: 'Mar', current: 27500, previous: 32000 },
  { month: 'Apr', current: 11530, previous: 27500 },
];

export const categorySpending = [
  { name: 'Food & Dining', value: 1530, color: '#2d8a9e' },
  { name: 'Transportation', value: 150, color: '#5cbdb9' },
  { name: 'Shopping', value: 2500, color: '#1a4a6e' },
  { name: 'Bills & Utilities', value: 5300, color: '#e85d3a' },
  { name: 'Entertainment', value: 350, color: '#8b5cf6' },
  { name: 'Health', value: 500, color: '#10b981' },
  { name: 'Education', value: 1200, color: '#f59e0b' },
];

export const mockAnnouncements = [
  { id: '1', title: 'System Maintenance', message: 'Scheduled maintenance on April 10, 2026 from 2:00 AM to 4:00 AM. The system may be temporarily unavailable.', date: '2026-04-07', active: true },
  { id: '2', title: 'New Feature: Savings Goals', message: 'We just launched the Savings Goals feature! Set your financial goals and track your progress.', date: '2026-04-01', active: true },
  { id: '3', title: 'Welcome to BudgetTracker', message: 'Thank you for using BudgetTracker! Start by adding your first expense.', date: '2026-03-15', active: false },
];

export const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('en-PH', { style: 'currency', currency: 'PHP' }).format(amount);
};
