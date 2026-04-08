import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Receipt, Tags, TrendingUp } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { formatCurrency } from '@/lib/mockData';

const stats = [
  { title: 'Total Users', value: '1,248', icon: Users, change: '+12%' },
  { title: 'Total Expenses', value: '34,521', icon: Receipt, change: '+8%' },
  { title: 'Most Used Category', value: 'Food & Dining', icon: Tags, change: '32%' },
  { title: 'Avg Spending/User', value: formatCurrency(15400), icon: TrendingUp, change: '+5%' },
];

const userGrowth = [
  { month: 'Nov', users: 820 }, { month: 'Dec', users: 910 }, { month: 'Jan', users: 980 },
  { month: 'Feb', users: 1050 }, { month: 'Mar', users: 1150 }, { month: 'Apr', users: 1248 },
];

export default function AdminDashboard() {
  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h1 className="text-2xl md:text-3xl font-bold font-display">Admin Dashboard</h1>
        <p className="text-muted-foreground text-sm mt-1">System overview and analytics</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map(s => (
          <Card key={s.title} className="hover:shadow-md transition-shadow">
            <CardContent className="p-5">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm text-muted-foreground">{s.title}</span>
                <s.icon className="h-4 w-4 text-primary" />
              </div>
              <div className="text-2xl font-bold font-display">{s.value}</div>
              <p className="text-xs text-success mt-1">{s.change} from last month</p>
            </CardContent>
          </Card>
        ))}
      </div>
      <Card>
        <CardHeader><CardTitle className="text-base">User Growth</CardTitle></CardHeader>
        <CardContent>
          <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={userGrowth}>
                <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                <XAxis dataKey="month" tick={{ fontSize: 12 }} />
                <YAxis tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="users" name="Users" fill="hsl(191, 56%, 40%)" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
