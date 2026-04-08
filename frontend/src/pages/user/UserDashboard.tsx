import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/mockData';
import { DollarSign, TrendingDown, TrendingUp, HandCoins } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

// Placeholder data
const mockExpenses: any[] = [];
const mockDebts: any[] = [];
const weeklySpending = [];
const categorySpending = [];

const totalSpent = mockExpenses.reduce((s, e) => s + e.amount, 0);
const monthlyBudget = 30000;
const remaining = monthlyBudget - totalSpent;
const owedToMe = mockDebts.filter(d => d.type === 'lent' && d.status !== 'paid').reduce((s, d) => s + d.amount - d.paidAmount, 0);
const iOwe = mockDebts.filter(d => d.type === 'borrowed' && d.status !== 'paid').reduce((s, d) => s + d.amount - d.paidAmount, 0);

const summaryCards = [
  { title: 'Total Spent', value: formatCurrency(totalSpent), icon: DollarSign, trend: '+12%', trendUp: true },
  { title: 'Remaining Budget', value: formatCurrency(remaining), icon: TrendingDown, trend: `${Math.round((totalSpent / monthlyBudget) * 100)}% used`, trendUp: false },
  { title: 'Owed to Me', value: formatCurrency(owedToMe), icon: TrendingUp, trend: `${mockDebts.filter(d => d.type === 'lent' && d.status !== 'paid').length} pending`, trendUp: true },
  { title: 'I Owe', value: formatCurrency(iOwe), icon: HandCoins, trend: `${mockDebts.filter(d => d.type === 'borrowed' && d.status !== 'paid').length} pending`, trendUp: false },
];

export default function UserDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-display">Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">Welcome back! Here's your financial overview.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {summaryCards.map((card) => (
          <Card key={card.title} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">{card.title}</span>
                <card.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="text-2xl font-bold font-display">{card.value}</div>
              <p className="text-xs text-muted-foreground mt-1">{card.trend}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card className="lg:col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">Weekly Spending Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={weeklySpending}>
                  <defs>
                    <linearGradient id="colorAmount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="hsl(191, 56%, 40%)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="hsl(191, 56%, 40%)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} tickFormatter={(v) => `₱${v / 1000}k`} />
                  <Tooltip formatter={(value: number) => [formatCurrency(value), 'Spent']} />
                  <Area type="monotone" dataKey="amount" stroke="hsl(191, 56%, 40%)" strokeWidth={2} fill="url(#colorAmount)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">By Category</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[180px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={categorySpending} cx="50%" cy="50%" innerRadius={50} outerRadius={75} dataKey="value" paddingAngle={2}>
                    {categorySpending.map((entry, i) => (
                      <Cell key={i} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value: number) => formatCurrency(value)} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="space-y-1 mt-2">
              {categorySpending.slice(0, 4).map((cat) => (
                <div key={cat.name} className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cat.color }} />
                    <span className="text-muted-foreground">{cat.name}</span>
                  </div>
                  <span className="font-medium">{formatCurrency(cat.value)}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-base font-semibold">Recent Transactions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {mockExpenses.slice(0, 6).map((expense) => (
              <div key={expense.id} className="flex items-center justify-between py-2 border-b last:border-0">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate">{expense.description}</p>
                  <p className="text-xs text-muted-foreground">{expense.category} • {expense.date}</p>
                </div>
                <div className="flex items-center gap-2 ml-4">
                  <Badge variant="outline" className="text-xs shrink-0">{expense.paymentMethod}</Badge>
                  <span className="text-sm font-semibold text-destructive whitespace-nowrap">-{formatCurrency(expense.amount)}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
